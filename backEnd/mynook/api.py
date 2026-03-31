from ninja import Router, File
from ninja_jwt.authentication import JWTAuth
from Accounts.models import Account
from django.shortcuts import get_object_or_404
from django.db import transaction
from typing import List, Optional
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import uuid
from Houses.models import House, Pictures, Features, FeatureList, Location, houseRules
from Posts.models import Post, PostStatus
from ninja.files import UploadedFile
from ninja import Router
from .schemas import SellerPublicProfileOut, NookPrivateOut, NookDetailOut, PostNookIn, UpdateNookIn, PictureUploadOut

from Houses.models import FeatureList
#add feature for the icons shown in create and update post
features = [ "Pool","Wifi","Heating", "Air Conditioning",'Television','Kitchen','Microwave','Fridge','Washing machine','Cleaning products','Sea view','Parking','Dishes',"Freezer",'Stove','Oven']
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
        Post.objects
        .filter(seller=seller)
        .select_related('house')
        .prefetch_related('house__location', 'house__pictures')
        .order_by('house__location__State', '-rating')  # grouped by wilaya on frontend, best rated first
    )

    return {"seller": seller, "nooks": list(posts)}

# ── 2. PRIVATE DASHBOARD view
@router.get(
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
    )

# Helpers
def _get_seller_post(post_id: str, user) -> Post:
    """Returns the post only if the requesting user is the seller."""
    post = get_object_or_404(
        Post.objects.select_related('house').prefetch_related(
            'house__pictures', 'house__location', 'house__features__features' ),
        id=post_id,)
    if str(post.seller_id) != str(user.id):
        from ninja.errors import HttpError
        raise HttpError(403, "You are not the owner of this nook.")
    return post

 



def _apply_features(house: House, feature_ids: List[int]):
    """Replaces the feature set on the house."""
   
    features_obj, _ = Features.objects.get_or_create(house=house)
    if feature_ids:
        print("Feature IDs to set:", feature_ids)  # Debug print
        selected = FeatureList.objects.filter(id__in=feature_ids)
        features_obj.features.set(selected)
    else:
        features_obj.features.clear()
 
#create a nook (house + post) — pictures uploaded separately
@router.post(
    '/',
    response={201: NookDetailOut},auth=JWTAuth(),

    summary='Create a new nook post new nook',
)
@transaction.atomic
def post_new_nook(request, payload: PostNookIn,):
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
    '/{post_id}',
    response={204: None},auth=JWTAuth(),
    summary='Delete a nook ',
)
@transaction.atomic
def delete_nook(request, post_id: str):
    post = _get_seller_post(post_id, request.user)
    post.delete()    # Post deleted first (FK constraint)
    return 204, None



