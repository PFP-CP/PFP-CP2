from typing import List
from django.core.files.storage import default_storage
from django.db import transaction
from django.shortcuts import get_object_or_404
from ninja import File, Router
from ninja.files import UploadedFile
from ninja_jwt.authentication import JWTAuth
from Accounts.models import Account
from Houses.models import FeatureList, Features, House, Location, Pictures, houseRules
from Posts.models import Post, PostStatus
from ninja.errors import HttpError
from .schemas import (
    NookDetailOut,
    NookPrivateOut,
    PictureUploadOut,PictureDeleted,
    PostNookIn,
    SellerPublicProfileOut,
    UpdateNookIn,
)

# add feature for the icons shown in create and update post
features = [
    "Pool",
    "Wifi",
    "Heating",
    "Air Conditioning",
    "Television",
    "Kitchen",
    "Microwave",
    "Fridge",
    "Washing machine",
    "Cleaning products",
    "Sea view",
    "Parking",
    "Dishes",
    "Freezer",
    "Stove",
    "Oven",
]
for f in features:
    FeatureList.objects.get_or_create(feature=f)


router = Router(tags=["My Nooks"])


# ── 1. PUBLIC PROFILE view
@router.get(
    "/profile/{seller_id}",
    response=SellerPublicProfileOut,
    summary="Public view of a seller profile with all their available nooks",
    auth=JWTAuth(),
)
def get_seller_public_profile(request, seller_id: int):
    seller = get_object_or_404(Account, pk=seller_id)

    posts = (
        Post.objects.filter(seller=seller)
        .select_related("house")
        .prefetch_related("house__location", "house__pictures")
        .order_by(
            "house__location__State", "-rating"
        )  # grouped by wilaya on frontend, best rated first
    )

    return {"seller": seller, "nooks": list(posts)}


# ── 2. PRIVATE DASHBOARD view
"""@router.get(
    "/dashboard",
    response=List[NookPrivateOut],auth=JWTAuth(),
    summary="Private dashboard — owner sees all their nooks with tenant info",

)
def get_my_nook_dashboard(request):
    return (
        Post.objects
        .filter(seller=request.user)
        .select_related(
            'house',
        )
        .prefetch_related('house__location', 'house__pictures','reservations__renter__contact')
        .order_by('house__location__State', '-created_at')  # sorted by Wilaya as shown
    )"""


# Helpers
def _get_seller_post(post_id: str, user) -> Post:
    """Returns the post only if the requesting user is the seller."""
    post = get_object_or_404(
        Post.objects.select_related("house").prefetch_related(
            "house__pictures", "house__location", "house__features__features"
        ),
        id=post_id,
    )
    if post.seller_id != user.id:
        from ninja.errors import HttpError

        raise HttpError(403, "You are not the owner of this nook.")
    return post


def _apply_features(house: House, feature_ids: List[int]):
    """Replaces the feature set on the house."""

    features_obj, _ = Features.objects.get_or_create(house=house)
    if feature_ids:
        selected = FeatureList.objects.filter(id__in=feature_ids)
        features_obj.features.set(selected)
    else:
        features_obj.features.clear()


# create a nook (house + post) — pictures uploaded separately
@router.post(
    "/",
    response={201: NookDetailOut},auth=JWTAuth(),
    summary="Create a new nook post new nook",
)
@transaction.atomic
def post_new_nook(
    request,
    payload: PostNookIn,
):
    # 1. Create the House
    payload.validate_rules()
    house = House.objects.create(
        Price=payload.price,
        RoomNum=payload.room_num,
        num_bedroom=payload.num_bedroom,
        num_bathroom=payload.num_bathroom,
        num_beds=payload.num_beds,
        max_tenants=payload.max_tenants,
        Surface=payload.surface,
        Description=payload.description,
        Types_of_Renters=payload.types_of_renters,
    )
    # 2. Create the Rules (Linked to House)
    houseRules.objects.create(
        house=house,
        allows_animals=payload.allows_animals,
        allows_smoking=payload.allows_smoking,
        allows_noise=payload.allows_noise,
    )

    # 2. Create Location
    Location.objects.create(
        house=house,
        County=payload.county,
        State=payload.state,
        Country=payload.country,
        Longitude=payload.longitude,
        Latitude=payload.latitude,
    )

    # 3. Attach features
    if payload.feature_ids:
        _apply_features(house, payload.feature_ids)

    # 4. Create the Post
    post = Post.objects.create(
        house=house,
        seller=request.user,
        title=f"{payload.house_type} in {payload.state}",
        status=PostStatus.Available,
    )

    return 201, post


# 5.  DELETE /my-nooks/{post_id}/
#     Delete a nook (post + house cascade)
@router.delete(
    "/{post_id}",
    response={204: None},
    auth=JWTAuth(),
    summary="Delete a nook ",
)
@transaction.atomic
def delete_nook(request, post_id: str):
    post = _get_seller_post(post_id, request.user)
    post.delete()  # Post deleted first (FK constraint)
    return 204, None

#update a nook (house + post) — pictures updated separately
@router.patch(
    "/{post_id}",response=NookDetailOut,auth=JWTAuth(),summary="Update a nook (house and post details, features) ")
def update_mynook(request,post_id: str,payload:UpdateNookIn):
    post = _get_seller_post(post_id, request.user)
    house = post.house
    payload.validate_rules()#validate num_beds and max_tenatns 
    data = payload.dict(exclude_unset=True)
    # -- update house fields --
    house_payload_maps = {'Price':'price', 'RoomNum':'room_num', 'num_bedroom':'num_bedroom', 'num_bathroom':'num_bathroom', 'num_beds':'num_beds', 'max_tenants':'max_tenants', 'Surface':'surface', 'Types_of_Renters':'types_of_renters', 'Description':'description'}
    house_update_fields=[]  
    for field, payload_key in house_payload_maps.items():
        if payload_key in data:
            setattr(house, field, data[payload_key])
            house_update_fields.append(field)
    if house_update_fields:
        house.save(update_fields=house_update_fields)

    # -- Location update 
    location_payload_maps = {'County':'county', 'State':'state', 'Country':'country', 'Longitude':'longitude', 'Latitude':'latitude'}
    update_loction_fields = []
    location=house.location.first()
    for field, payload_key in location_payload_maps.items():

        if payload_key in data:
            setattr(location, field, data[payload_key])
            update_loction_fields.append(field)     
    if update_loction_fields:
        location.save(update_fields=list(location_payload_maps.keys()))
     # -- Post-level fields -- update 

    if 'apartment_type' in data:
        State=data['state'] if 'state' in data else location.State
        post.title = f"{data['apartment_type']} in {State}"
        post.save(update_fields=['title'])
    #update  rules if included in payload
    
    rules=['allows_animals','allows_smoking','allows_noise']
    house_rules, created =houseRules.objects.get_or_create(house=house)

    house_updated_fields = []
    for rule in rules:
        if rule in data:
            setattr(house_rules, rule, data[rule])
            house_updated_fields.append(rule)
    if house_updated_fields:
        house_rules.save(update_fields=house_updated_fields)
    # -- Features --
    if 'feature_ids' in data and data['feature_ids'] is not None:
        _apply_features(house, data['feature_ids'])

    post.refresh_from_db()
    return post



# 6.  POST /my-nooks/{post_id}/pictures/
#     Upload a picture for the nook (max 10)

max_pictures = 10
@router.post(
    '/{post_id}/pictures',
    response={201: PictureUploadOut},auth=JWTAuth(),
    summary='Upload a picture to a nook ',
)
def upload_picture(request, post_id: str, file: UploadedFile = File(...)):
    post = _get_seller_post(post_id, request.user)
    house = post.house
    # limit to 10 pictures
    if house.pictures.count() >=max_pictures:
        raise HttpError(400, "Maximum 10 pictures allowed per nook.")
    picture = Pictures.objects.create(house=house, picture=file)
    return 201, picture


# 7.  DELETE /my-nooks/{post_id}/pictures/{picture_id}/
#     Delete a specific picture

@router.delete(
    '/{post_id}/pictures/{picture_id}',auth=JWTAuth(),
    response={200:PictureDeleted},
    summary='Delete a picture from a nook',
)
def delete_picture(request, post_id: str, picture_id: int):
    post = _get_seller_post(post_id, request.user)
    picture = get_object_or_404(Pictures, id=picture_id, house=post.house)
    picture.delete()
    return 200,{'message':'picture deleted successfuly.'}