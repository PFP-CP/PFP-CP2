from ninja import Router, File
from ninja_jwt.authentication import JWTAuth
from django.shortcuts import get_object_or_404
from django.db import transaction
from typing import List, Optional
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import uuid
from Houses.models import House, Pictures, Features, FeatureList, Location
from Posts.models import Post, PostStatus
# from ninja import File
from ninja.files import UploadedFile

from .schemas import (
    MyNookCardOut, PostNookIn, UpdateNookIn,
    NookDetailOut, PictureUploadOut,
)

router = Router()

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

def _upload_picture(file: UploadedFile) -> str:
    ext = file.name.split('.')[-1].lower()
    filename = f"houses/{uuid.uuid4()}.{ext}"
    
    # This uses your Supabase S3 backend from settings.py automatically
    saved_path = default_storage.save(filename, ContentFile(file.read()))
    url = default_storage.url(saved_path)
    return url


def _apply_house_fields(house: House, data: dict):
    """Applies scalar house fields from the payload dict."""
    field_map = {
        'price':        'Price',
        'room_num':     'RoomNum',
        'num_bedroom':  'num_bedroom',
        'num_bathroom': 'num_bathroom',
        'surface':      'Surface',
        'types_of_renters': 'Types_of_Renters',
    }
    changed = False
    for payload_key, model_field in field_map.items():
        if payload_key in data and data[payload_key] is not None:
            setattr(house, model_field, data[payload_key])
            changed = True
    if changed:
        house.save()


def _apply_location(house: House, data: dict):
    """Creates or updates the house location from payload data."""
    loc_fields = ('county', 'state', 'country', 'longitude', 'latitude')
    loc_data = {k: data[k] for k in loc_fields if k in data and data[k] is not None}
    if not loc_data:
        return

    loc_qs = house.location.all()
    if loc_qs.exists():
        loc_qs.update(
            County=loc_data.get('county', loc_qs.first().County),
            State=loc_data.get('state', loc_qs.first().State),
            Country=loc_data.get('country', loc_qs.first().Country),
            Longitude=loc_data.get('longitude', loc_qs.first().Longitude),
            Latitude=loc_data.get('latitude', loc_qs.first().Latitude),
        )
    else:
        Location.objects.create(
            house=house,
            County=loc_data.get('county', ''),
            State=loc_data.get('state', ''),
            Country=loc_data.get('country', ''),
            Longitude=loc_data.get('longitude', 0.0),
            Latitude=loc_data.get('latitude', 0.0),
        )


def _apply_features(house: House, feature_ids: List[int]):
    """Replaces the feature set on the house."""
    features_obj, _ = Features.objects.get_or_create(house=house)
    selected = FeatureList.objects.filter(id__in=feature_ids)
    features_obj.features.set(selected)


# 1.  GET /my-nooks/
#     My Nooks dashboard — posts grouped by wilaya (image 1)

@router.get(
    '/',
    response=List[MyNookCardOut],

    tags=['MyNook'],
    summary="Seller's nook dashboard — all their posts grouped by wilaya",
)
def my_nooks(request, status: Optional[str] = None):
    qs = ( Post.objects
        .filter(seller_id=request.user.id)
        .select_related('house')
        .prefetch_related('house__pictures', 'house__location') )
    if status:
        qs = qs.filter(status=status)

    # Order by wilaya then newest first so frontend can group easily
    return qs.order_by('house__location__State', '-created_at')


# 2.  POST /my-nooks/
#     "Post a new nook" (image 2)
#     Creates a House + Location + Features + Post in one call.
#     Pictures are uploaded separately.

@router.post(
    '/',
    response={201: NookDetailOut},

    tags=['MyNook'],
    summary='Create a new nook (house + post) — pictures uploaded separately',
)
@transaction.atomic
def post_new_nook(request, payload: PostNookIn):
    # 1. Create the House
    house = House.objects.create(
        Price=payload.price,
        RoomNum=payload.room_num,
        num_bedroom=payload.num_bedroom,
        num_bathroom=payload.num_bathroom,
        Surface=payload.surface,
        Description=payload.description,
        Types_of_Renters=payload.types_of_renters,
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

    # 4. Create the Post (status=PENDING until admin approves)
    post = Post.objects.create(
        house=house,
        seller=request.user,
        title=payload.title,
        description=payload.description,
        status=PostStatus.PENDING,
    )

    return 201, post


# 3.  GET /my-nooks/{post_id}/
#     Full detail — pre-fills the "Modify your nook" form (image 3)

@router.get(
    '/{post_id}',
    response=NookDetailOut,

    tags=['MyNook'],
    summary='Get full nook detail (pre-fills the modify form)',
)
def get_nook(request, post_id: str):
    return _get_seller_post(post_id, request.user)


# 4.  PATCH /my-nooks/{post_id}/
#     "Save changes" (image 3)
#     Partial update — only sent fields are updated.

@router.patch(
    '/{post_id}',
    response=NookDetailOut,

    tags=['MyNook'],
    summary='Partially update a nook (house fields + post fields)',
)
@transaction.atomic
def update_nook(request, post_id: str, payload: UpdateNookIn):
    post = _get_seller_post(post_id, request.user)
    house = post.house
    data = payload.dict(exclude_unset=True)

    # -- Post-level fields --
    if 'title' in data:
        post.title = data['title']
    if 'description' in data:
        post.description = data['description']
    post.save(update_fields=['title', 'description', 'updated_at'])

    # -- House scalar fields --
    _apply_house_fields(house, data)

    # -- Location --
    _apply_location(house, data)

    # -- Features --
    if 'feature_ids' in data and data['feature_ids'] is not None:
        _apply_features(house, data['feature_ids'])

    post.refresh_from_db()
    return post


# 5.  DELETE /my-nooks/{post_id}/
#     Delete a nook (post + house cascade)

@router.delete(
    '/{post_id}',
    response={204: None},

    tags=['MyNook'],
    summary='Delete a nook entirely (removes post and house)',
)
@transaction.atomic
def delete_nook(request, post_id: str):
    post = _get_seller_post(post_id, request.user)
    post.delete()    # Post deleted first (FK constraint)
    return 204, None


# 6.  POST /my-nooks/{post_id}/pictures/
#     Upload a picture for the nook (max 10)

@router.post(
    '/{post_id}/pictures',
    response={201: PictureUploadOut},

    tags=['MyNook'],
    summary='Upload a picture to a nook ',
)
def upload_picture(request, post_id: str, file: UploadedFile = File(...)):
    post = _get_seller_post(post_id, request.user)
    house = post.house
    url = _upload_picture(file)
    picture = Pictures.objects.create(house=house, URL=url)
    return 201, picture


# 7.  DELETE /my-nooks/{post_id}/pictures/{picture_id}/
#     Delete a specific picture

@router.delete(
    '/{post_id}/pictures/{picture_id}',
    response={204: None},

    tags=['MyNook'],
    summary='Delete a picture from a nook',
)
def delete_picture(request, post_id: str, picture_id: int):
    post = _get_seller_post(post_id, request.user)
    picture = get_object_or_404(Pictures, id=picture_id, house=post.house)
    picture.delete()
    return 204, None


# 8.  POST /my-nooks/{post_id}/archive/
#     Seller archives their own nook

@router.post(
    '/{post_id}/archive',
    response={200: NookDetailOut},

    tags=['MyNook'],
    summary='Archive a nook (hides it from public listings)',
)
def archive_nook(request, post_id: str):
    post = _get_seller_post(post_id, request.user)
    post.archive()    # uses your existing Post.archive() method
    post.refresh_from_db()
    return post


# 9.  POST /my-nooks/{post_id}/republish/
#     Seller re-submits an archived nook for review

@router.post(
    '/{post_id}/republish',
    response={200: NookDetailOut},

    tags=['MyNook'],
    summary='Re-submit an archived nook for admin review',
)
def republish_nook(request, post_id: str):
    post = _get_seller_post(post_id, request.user)

    if post.status != PostStatus.ARCHIVED:
        from ninja.errors import HttpError
        raise HttpError(400, f"Only archived nooks can be republished. Current status: {post.status}")

    post.status = PostStatus.PENDING
    post.save(update_fields=['status', 'updated_at'])
    post.refresh_from_db()
    return post