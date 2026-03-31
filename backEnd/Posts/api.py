import hashlib
import json
from pathlib import Path
from typing import List, Optional

from django.core.cache import cache
from django.db import transaction
from django.db.models import Avg, Prefetch, Q, QuerySet, Value
from django.http import Http404
from django.shortcuts import get_object_or_404
from ninja import Router
from ninja.errors import HttpError
from ninja.pagination import PageNumberPagination, paginate
from ninja_jwt.authentication import JWTAuth

from Accounts.models import Account
from Houses.models import *

from .models import *
from .models import Comment
from .schemas import *
from .schemas import (
    CommentIn,
    CommentOut,
    CommentUpdate,
    ErrorSchema,
    MessageSchema,
    PostCreateSchema,
    PostListOut,
    PostOut,
    PostUpdateSchema,
    SavedPostOut,
)

router = Router()
search_router = Router()


# Filter helpers — all updated to teammate's lowercase field names    #
def post_rating_query(
    previous_search: QuerySet, rating: float | None = None
) -> QuerySet:
    if rating is not None:
        previous_search = previous_search.filter(rating__gte=rating)
    return previous_search


def renter_rating_query(
    previous_search: QuerySet, rating: float | None = None
) -> QuerySet:
    """Filter by seller's Account.rating field (updated by Comment._update_seller_rating)."""
    if rating is not None:
        previous_search = previous_search.filter(seller__rating__gte=rating)
    return previous_search


def price_query(
    previous_search: QuerySet,
    min_price: int | None = None,
    max_price: int | None = None,
) -> QuerySet:
    """Filter by House.Price through Post.house (OneToOneField)."""
    if min_price is not None:
        previous_search = previous_search.filter(house__Price__gte=min_price)
    if max_price is not None:
        previous_search = previous_search.filter(house__Price__lte=max_price)
    return previous_search


def rooms_query(
    previous_search: QuerySet, number_of_rooms: int | None = None
) -> QuerySet:
    """Filter by House.RoomNum — adjust field name if yours differs."""
    if number_of_rooms is not None:
        previous_search = previous_search.filter(house__RoomNum=number_of_rooms)
    return previous_search


def wilaya_query(previous_search: QuerySet, wilaya: str | None = None) -> QuerySet:
    """
    Translate wilaya name → code via wilayas.json,
    then filter House → location → State.
    """
    if wilaya is not None:
        main_dir = Path(__file__).parents[1]
        wilaya_dir = main_dir / "wilayas/wilayas.json"
        with open(wilaya_dir, "r") as f:
            wilayas = json.load(f)

        if wilaya in wilayas:
            previous_search = previous_search.filter(
                house__location__State=wilayas[wilaya]
            )
        else:
            # handle invalid wilaya
            return previous_search
    return previous_search


def allowed_people_query(
    previous_search: QuerySet, allowed_people: list[str] = []
) -> QuerySet:
    """Filter by House.Types_of_Renters (adjust field name if needed)."""
    if not allowed_people:
        return previous_search
    return previous_search.filter(house__Types_of_Renters__in=allowed_people)


def features_query(previous_search: QuerySet, features: list[str] = []) -> QuerySet:
    """Filter by house features (adjust traversal to match your House model)."""
    for feature in features:
        previous_search = previous_search.filter(
            house__features__features__feature=feature
        )
    return previous_search


# Sorting — operates on serialised dicts, keys are SearchResult names #


def sorting(post_results: list[dict], ordering_by: str) -> list[dict]:
    SORT_OPTIONS = {
        "newest": lambda x: x["creation_time"],
        "oldest": lambda x: x["creation_time"],
        "price_asc": lambda x: x["price"],
        "price_desc": lambda x: x["price"],
        "rating_asc": lambda x: x["rating"],
        "rating_desc": lambda x: x["rating"],
    }
    SORT_REVERSE = {
        "newest": True,
        "oldest": False,
        "price_asc": False,
        "price_desc": True,
        "rating_asc": False,
        "rating_desc": True,
    }
    if ordering_by in SORT_OPTIONS:
        post_results = sorted(
            post_results,
            key=SORT_OPTIONS[ordering_by],
            reverse=SORT_REVERSE[ordering_by],
        )
    return post_results


# Search endpoint


@search_router.post("", tags=["Search"])
def search(request, Criteria: SearchCriteria):
    # Cache key excludes order_by — sorting is in-memory after retrieval
    criteria_dict = Criteria.dict(exclude={"order_by"})
    cache_key = (
        "search:"
        + hashlib.md5(json.dumps(criteria_dict, sort_keys=True).encode()).hexdigest()
    )

    results = cache.get(cache_key)

    if results is None:
        results_query = Post.objects.select_related(
            "seller__contact",
            "seller",
        ).prefetch_related(
            "house__location",
            "house__features__features",
            "comments",
        )

        # Apply all filters
        results_query = post_rating_query(results_query, Criteria.post_rating)
        results_query = renter_rating_query(results_query, Criteria.renter_rating)
        results_query = price_query(
            results_query, Criteria.min_price, Criteria.max_price
        )
        results_query = rooms_query(results_query, Criteria.number_of_rooms)
        results_query = wilaya_query(results_query, Criteria.wilaya)
        results_query = allowed_people_query(results_query, Criteria.allowed_people)
        results_query = features_query(results_query, Criteria.features)

        # Serialise to plain dicts for caching
        results = [SearchResult.from_orm(post).dict() for post in results_query]

        cache.set(cache_key, results, timeout=300)  # 5-minute cache

    results = sorting(results, Criteria.order_by)
    return results


# List Post with query parameter
@router.get("/", response=List[PostListOut], auth=JWTAuth(), tags=["List post"])
def list_posts(
    request,
    # Filters
    status: str = None,
    country: str = None,
    city: str = None,
    min_price: float = None,
    max_price: float = None,
    min_surface: float = None,
    type_of_people: str = None,
    min_rooms: int = None,
    # Sorting
    sort_by: str = "newest",  # newest
    # Pagination
    page: int = 1,
    per_page: int = 20,
):
    """
    Main page
    Returns available posts houses info, location, and primary image.
    """
    qs = Post.objects.select_related("house").prefetch_related(
        "house__pictures",
        Prefetch("comments", queryset=Comment.objects.order_by("-created_at")),
    )

    # ── Filters
    if country:
        qs = qs.filter(house__location__Country__icontains=country)
    if status:
        qs = qs.filter(status=status)
    if city:
        qs = qs.filter(house__location__State__icontains=city)
    if min_price is not None:
        qs = qs.filter(house__Price__gte=min_price)
    if max_price is not None:
        qs = qs.filter(house__Price__lte=max_price)
    if min_surface is not None:
        qs = qs.filter(house__Surface__gte=min_surface)
    if type_of_people:
        qs = qs.filter(
            Q(house__Types_of_Renters=type_of_people)
            | Q(house__Types_of_Renters__isnull=True)
        )
    if min_rooms is not None:
        qs = qs.filter(house__RoomNum__gte=min_rooms)

    # ── Sorting
    sort_map = {
        "newest": "-created_at",
        "oldest": "created_at",
        "price_asc": "house__Price",
        "price_desc": "-house__Price",
        "popular": "-views_count",
    }
    qs = qs.order_by(sort_map.get(sort_by, "-created_at"))

    # ── Pagination
    offset = (page - 1) * per_page
    qs = qs[offset : offset + per_page]

    return qs


# saved post bookmark -favorite post


@router.get(
    "/saved",
    response=List[SavedPostOut],
    auth=JWTAuth(),
    tags=["Saved Posts (my favorite)"],
)
def list_saved_posts(request):
    """Return all posts saved by the authenticated user."""
    return (
        SavedPost.objects.filter(user=request.user)
        .select_related(
            "post",
            "post__house",
        )
        .prefetch_related("post__house__pictures", "post__house__location")
    )


@router.post(
    "/{post_id}/save",
    response={201: MessageSchema, 409: ErrorSchema, 404: ErrorSchema},
    auth=JWTAuth(),
    tags=["Saved Posts (my favorite)"],
)
def save_post(request, post_id: uuid.UUID):
    """favorite post"""
    from django.http import Http404

    try:
        post = Post.objects.get(pk=post_id, status=PostStatus.ACTIVE)
    except Post.DoesNotExist:
        raise Http404(
            "This post cannot be saved because it does not exist or is inactive"
        )
    created = SavedPost.objects.get_or_create(user=request.user, post=post)
    if not created:
        return 409, {"detail": "Post already saved."}
    post.increment_saves()
    return 201, {"message": "Post saved."}


@router.delete(
    "/{post_id}/save",
    response={200: MessageSchema, 404: ErrorSchema},
    auth=JWTAuth(),
    tags=["Saved Posts (my favorite)"],
)
def unsave_post(request, post_id: uuid.UUID):
    """Remove a bookmark."""
    saved = get_object_or_404(SavedPost, user=request.user, post=post_id)
    saved.delete()
    get_object_or_404(Post, pk=post_id).decrement_saves()
    return 200, {"message": "Post removed from saved."}


@router.get("/{post_id}", response={200: PostOut, 404: ErrorSchema}, tags=["Posts"])
def get_post(request, post_id: uuid.UUID):
    """Full post detail with house, seller, images, comments."""
    post = get_object_or_404(
        Post.objects.select_related("house", "seller").prefetch_related(
            "house__location",
            "house__pictures",
            "house__features__features",
            Prefetch(
                "comments",
                queryset=Comment.objects.select_related("user").order_by("-created_at"),
            ),
        ),
        pk=post_id,
    )
    post.increment_views()
    return 200, post


# POST STATUS  –  Business logic transitions


@router.post(
    "/{post_id}/publish",
    response={200: MessageSchema, 400: ErrorSchema, 403: ErrorSchema},
    auth=JWTAuth(),
    tags=["Post Status"],
)
def publish_post(request, post_id: uuid.UUID):
    """make pending post available for rent."""
    post = get_object_or_404(Post, pk=post_id)
    if post.seller != request.user and not request.user.is_staff:
        return 403, {"detail": "Not allowed."}
    try:
        post.publish()
    except Exception as e:
        return 400, {"detail": str(e)}
    return 200, {"message": "Post is now available."}


@router.post(
    "/{post_id}/mark-rented",
    response={200: MessageSchema, 403: ErrorSchema},
    auth=JWTAuth(),
    tags=["Post Status"],
)
# we need to mark the house as rented too to exclude it from search results and prevent new reservations
def mark_rented(request, post_id: uuid.UUID):
    post = get_object_or_404(Post, pk=post_id)
    if post.seller != request.user:
        return 403, {"detail": "Only the seller can mark as rented."}
    post.mark_rented()
    return 200, {"message": "Post and house marked as rented."}


# COMMENTS  –  Review system


@router.get(
    "/{post_id}/comments", response=List[CommentOut], auth=JWTAuth(), tags=["Comments"]
)
def list_comments(request, post_id: uuid.UUID):
    post = get_object_or_404(Post, pk=post_id)
    return post.comments.select_related("user").order_by("-created_at")


@router.post(
    "/{post_id}/comments",
    response={201: CommentOut, 409: ErrorSchema, 404: ErrorSchema},
    auth=JWTAuth(),
    tags=["Comments"],
)
def add_comment(request, post_id: uuid.UUID, payload: CommentIn):
    """
    Guest leaves a review on a post.
    """
    post = get_object_or_404(Post, pk=post_id)

    if Comment.objects.filter(post=post, user=request.user).exists():
        return 409, {"detail": "You have already reviewed this post."}

    comment = Comment.objects.create(
        post=post,
        user=request.user,
        comment=payload.comment,
        rating=payload.rating,
    )

    return 201, comment


@router.patch(
    "/{post_id}/comments/{comment_id}",
    response={200: CommentOut, 403: ErrorSchema, 404: ErrorSchema},
    auth=JWTAuth(),
    tags=["Comments"],
)
def update_comment(
    request, post_id: uuid.UUID, comment_id: uuid.UUID, payload: CommentUpdate
):
    comment = get_object_or_404(Comment, pk=comment_id, post=post_id)
    if comment.user != request.user and not request.user.is_staff:
        return 403, {"detail": "You can only edit your own comments."}
    for field, value in payload.dict(exclude_none=True).items():
        setattr(comment, field, value)
    comment.save()
    return 200, comment


@router.delete(
    "/{post_id}/comments/{comment_id}",
    response={200: MessageSchema, 403: ErrorSchema, 404: ErrorSchema},
    auth=JWTAuth(),
    tags=["Comments"],
)
def delete_comment(request, post_id: uuid.UUID, comment_id: uuid.UUID):
    comment = get_object_or_404(Comment, pk=comment_id, post=post_id)
    if comment.user != request.user and not request.user.is_staff:
        return 403, {"detail": "Not allowed."}
    post = comment.post
    seller = comment.post.seller
    comment.delete()
    post._update_post_rating()
    seller._update_seller_rating()
    return 200, {"message": "Comment deleted."}
