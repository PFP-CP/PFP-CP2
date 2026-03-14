
from ninja import Router
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.db.models import Prefetch, Q
from typing import List
import uuid

from .models import Post, SavedPost, Comment, PostStatus
from .schemas import (
    PostOut, PostListOut, PostCreateSchema, PostUpdateSchema,
    CommentOut, CommentIn, CommentUpdate,
    SavedPostOut,
    MessageSchema, ErrorSchema,
)

router = Router()


# MAIN PAGE  –  Public post listing
@router.get('/', response=List[PostListOut], tags=['Main Page'], auth=None)
def list_posts(
    request,
    # Filters
    status:         str   = 'active',
    city:           str   = None,
    min_price:      float = None,
    max_price:      float = None,
    min_surface:    float = None,
    type_of_people: str   = None,
    min_rooms:      int   = None,
    # Sorting
    sort_by: str = 'newest',   # newest
    # Pagination
    page:     int = 1,
    per_page: int = 20,
):
    """
    Main page 
    Returns active posts houses info, location, and primary image.
    """
    qs = Post.objects.select_related(
        'house', 'house__location'
    ).prefetch_related(
        'house__images',
        Prefetch('comments', queryset=Comment.objects.order_by('-created_at')),
    ).filter(status=status)

    # ── Filters 
    if city:
        qs = qs.filter(house__location__city__icontains=city)
    if min_price is not None:
        qs = qs.filter(house__price__gte=min_price)
    if max_price is not None:
        qs = qs.filter(house__price__lte=max_price)
    if min_surface is not None:
        qs = qs.filter(house__surface__gte=min_surface)
    if type_of_people:
        qs = qs.filter(
            Q(house__type_of_people=type_of_people) |
            Q(house__type_of_people__isnull=True)
        )
    if min_rooms is not None:
        qs = qs.filter(house__num_room__gte=min_rooms)

    # ── Sorting
    sort_map = {
        'newest':     '-created_at',
        'oldest':     'created_at',
        'price_asc':  'house__price',
        'price_desc': '-house__price',
        'popular':    '-views_count',
    }
    qs = qs.order_by(sort_map.get(sort_by, '-created_at'))

    # ── Pagination 
    offset = (page - 1) * per_page
    qs = qs[offset: offset + per_page]

    return qs


# POST  –  CRUD

@router.get('/{post_id}', response={200: PostOut, 404: ErrorSchema},
            tags=['Posts'], auth=None)
def get_post(request, post_id: uuid.UUID):
    """Full post detail with house, seller, images, comments."""
    post = get_object_or_404(
        Post.objects.select_related(
            'house', 'house__location', 'seller' ).prefetch_related(
            'house__images',
            'house__features__feature',
            'house__rules',
            Prefetch('comments',
                     queryset=Comment.objects.select_related('user').order_by('-created_at')),
        ),
        pk=post_id,
    )
    post.increment_views() 
    return 200, post


@router.post('/', response={201: PostOut, 422: ErrorSchema, 403: ErrorSchema},
             tags=['Posts'])
@transaction.atomic
def create_post(request, payload: PostCreateSchema):
    """
    Seller creates a post for one of their houses.
    The house must exist and must not already have a post.
    """
    from Houses.models import House

    house = get_object_or_404(House, pk=payload.house)

    # Business rule: only the house owner (seller) can post it
    if Post.objects.filter(house=house).exists():
        return 422, {'detail': 'This house already has a post.'}

    if request.user.type_of_user != 'SELLER':
        return 403, {'detail': 'Only sellers can create posts.'}

    post = Post.objects.create(
        house=house,
        seller=request.user,
        title=payload.title,
        description=payload.description,
        status=PostStatus.PENDING,
    )

    # Update seller's post count
    from Accounts.models import Account
    Account.objects.filter(pk=request.user.pk).update(
        num_post=request.user.num_post + 1
    )

    return 201, post


@router.patch('/{post_id}',
              response={200: PostOut, 403: ErrorSchema, 404: ErrorSchema},
              tags=['Posts'])
def update_post(request, post_id: uuid.UUID, payload: PostUpdateSchema):
    """Seller updates their own post title / description."""
    post = get_object_or_404(Post, pk=post_id)

    if post.seller != request.user.pk:
        return 403, {'detail': 'You can only edit your own posts.'}

    for field, value in payload.dict(exclude_none=True).items():
        setattr(post, field, value)
    post.save()
    return 200, post


@router.delete('/{post_id}',
               response={200: MessageSchema, 403: ErrorSchema, 404: ErrorSchema},
               tags=['Posts'])
def delete_post(request, post_id: uuid.UUID):
    """Seller deletes their own post."""
    post = get_object_or_404(Post, pk=post_id)

    if post.seller != request.user.pk:
        return 403, {'detail': 'You can only delete your own posts.'}

    post.delete()
    return 200, {'message': 'Post deleted.'}


# POST STATUS  –  Business logic transitions

@router.post('/{post_id}/publish',
             response={200: MessageSchema, 400: ErrorSchema, 403: ErrorSchema},
             tags=['Post Status'])
def publish_post(request, post_id: uuid.UUID):
    """Activate a pending/draft post (seller or admin action)."""
    post = get_object_or_404(Post, pk=post_id)
    if post.seller!= request.user.pk and not request.user.is_staff:
        return 403, {'detail': 'Not allowed.'}
    try:
        post.publish()
    except Exception as e:
        return 400, {'detail': str(e)}
    return 200, {'message': 'Post is now active.'}


@router.post('/{post_id}/archive',
             response={200: MessageSchema, 403: ErrorSchema},
             tags=['Post Status'])
def archive_post(request, post_id: uuid.UUID):
    post = get_object_or_404(Post, pk=post_id)
    if post.seller != request.user.pk and not request.user.is_staff:
        return 403, {'detail': 'Not allowed.'}
    post.archive()
    return 200, {'message': 'Post archived.'}


@router.post('/{post_id}/mark-rented',
             response={200: MessageSchema, 403: ErrorSchema},
             tags=['Post Status'])
def mark_rented(request, post_id: uuid.UUID):
    post = get_object_or_404(Post, pk=post_id)
    if post.seller!= request.user.pk:
        return 403, {'detail': 'Only the seller can mark as rented.'}
    post.mark_rented()
    return 200, {'message': 'Post and house marked as rented.'}


@router.post('/{post_id}/reject',
             response={200: MessageSchema, 403: ErrorSchema},
             tags=['Post Status'])
def reject_post(request, post_id: uuid.UUID):
    """Admin only — reject a pending post."""
    if not request.user.is_staff:
        return 403, {'detail': 'Only admins can reject posts.'}
    post = get_object_or_404(Post, pk=post_id)
    post.reject()
    return 200, {'message': 'Post rejected.'}


# saved post bookmark -favorite post 

@router.get('/saved', response=List[SavedPostOut], tags=['Saved Posts'])
def list_saved_posts(request):
    """Return all posts saved by the authenticated user."""
    return SavedPost.objects.filter(user=request.user).select_related(
        'post', 'post__house', 'post__house__location',
    ).prefetch_related('post__house__images')


@router.post('/{post_id}/save',
             response={201: MessageSchema, 409: ErrorSchema, 404: ErrorSchema},
             tags=['Saved Posts'])
def save_post(request, post_id: uuid.UUID):
    """favorite post """
    post = get_object_or_404(Post, pk=post_id, status=PostStatus.ACTIVE)
    created = SavedPost.objects.get_or_create(user=request.user, post=post)
    if not created:
        return 409, {'detail': 'Post already saved.'}
    post.increment_saves()
    return 201, {'message': 'Post saved.'}


@router.delete('/{post_id}/save',
               response={200: MessageSchema, 404: ErrorSchema},
               tags=['Saved Posts'])
def unsave_post(request, post_id: uuid.UUID):
    """Remove a bookmark."""
    saved = get_object_or_404(SavedPost, user=request.user, post=post_id)
    saved.delete()
    get_object_or_404(Post, pk=post_id).decrement_saves()
    return 200, {'message': 'Post removed from saved.'}


# COMMENTS  –  Review system

@router.get('/{post_id}/comments',
            response=List[CommentOut], tags=['Comments'], auth=None)
def list_comments(request, post_id: uuid.UUID):
    post = get_object_or_404(Post, pk=post_id)
    return post.comments.select_related('user').order_by('-created_at')


@router.post('/{post_id}/comments',
             response={201: CommentOut, 409: ErrorSchema, 404: ErrorSchema},
             tags=['Comments'])
def add_comment(request, post_id: uuid.UUID, payload: CommentIn):
    """
    Guest leaves a review on a post.
    """
    post = get_object_or_404(Post, pk=post_id, status=PostStatus.ACTIVE)

    if Comment.objects.filter(post=post, user=request.user).exists():
        return 409, {'detail': 'You have already reviewed this post.'}

    comment = Comment.objects.create(
        post=post,
        user=request.user,
        comment=payload.comment,
        rating=payload.rating,
    )
    return 201, comment


@router.patch('/{post_id}/comments/{comment_id}',
              response={200: CommentOut, 403: ErrorSchema, 404: ErrorSchema},
              tags=['Comments'])
def update_comment(request, post_id: uuid.UUID,
                   comment_id: uuid.UUID, payload: CommentUpdate):
    comment = get_object_or_404(Comment, pk=comment_id, post=post_id)
    if comment.user!= request.user.pk:
        return 403, {'detail': 'You can only edit your own comments.'}
    for field, value in payload.dict(exclude_none=True).items():
        setattr(comment, field, value)
    comment.save()
    comment._update_seller_rating()
    return 200, comment


@router.delete('/{post_id}/comments/{comment_id}',
               response={200: MessageSchema, 403: ErrorSchema, 404: ErrorSchema},
               tags=['Comments'])
def delete_comment(request, post_id: uuid.UUID, comment_id: uuid.UUID):
    comment = get_object_or_404(Comment, pk=comment_id, post=post_id)
    if comment.user != request.user.pk and not request.user.is_staff:
        return 403, {'detail': 'Not allowed.'}
    comment.delete()
    return 200, {'message': 'Comment deleted.'}


# SELLER  –  My posts dashboard

@router.get('/my-posts', response=List[PostListOut], tags=['Seller'])
def my_posts(request, status: str = None):
    """Seller sees their own posts."""
    qs = Post.objects.select_related(
        'house', 'house__location').prefetch_related('house__images').filter(seller=request.user)
    if status:
        qs = qs.filter(status=status)
    return qs