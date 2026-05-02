import uuid
from datetime import datetime
from decimal import Decimal
from multiprocessing import context
from multiprocessing.util import info
from typing import List, Optional

from ninja import Schema
from pydantic import field_validator

from Accounts.models import Account
from Houses.models import Pictures
from Posts.models import Comment, Post


class TypeOfPeople(Schema):
    Families: bool = True
    Couple: bool = True
    Single: bool = True


class SearchCriteria(Schema):
    house_type: Optional[str] = None
    number_of_rooms: Optional[int] = None
    wilaya: Optional[str] = None
    renter_rating: Optional[float] = None
    post_rating: Optional[float] = None
    min_price: Optional[int] = None
    max_price: Optional[int] = None
    features: Optional[list[str]] = []
    allowed_people: Optional[TypeOfPeople] = None
    rules: Optional[list[str]] = []
    order_by: Optional[str] = "newest"


class SearchResult(Schema):
    id: uuid.UUID
    renter_name: str
    wilaya: Optional[str] = None
    price: int
    rating: float
    description: str
    phone_number: Optional[str] = None
    contact: str
    creation_time: str
    picture: str

    class Config:
        from_attributes = True

    @staticmethod
    def resolve_id(obj):
        return obj.id

    @staticmethod
    def resolve_renter_name(obj):
        # Adjust to your Account field — e.g. full_name, username, etc.
        return obj.seller.full_name

    @staticmethod
    def resolve_nooks_count(obj):
        return Post.objects.filter(seller=obj).count()

    @staticmethod
    def resolve_wilaya(obj):
        # House → location (FK/related) → State
        loc = obj.house.location.first()
        return loc.State if loc else None

    @staticmethod
    def resolve_price(obj):
        return obj.house.Price

    @staticmethod
    def resolve_rating(obj):
        # Post no longer has a Rating field — computed from comments
        return obj.rating

    @staticmethod
    def resolve_description(obj):
        return obj.house.Description

    @staticmethod
    def resolve_phone_number(obj):
        return obj.phone_number

    @staticmethod
    def resolve_contact(obj):
        return obj.seller.email

    @staticmethod
    def resolve_creation_time(obj):
        return obj.created_at.isoformat()

    @staticmethod
    def resolve_picture(obj):
        first_pic = obj.house.pictures.first()
        if first_pic:
            return first_pic.picture.url
        return Pictures.blank_house_image


class SellerRatingIn(Schema):
    rating: Decimal

    @field_validator("rating")
    @classmethod
    def valid_rating(cls, v):
        if not (0 <= v <= 5):
            raise ValueError("Rating must be between 0 and 5.")
        return v


class SellerRatingUpdate(Schema):
    rating: Decimal

    @field_validator("rating")
    @classmethod
    def valid_rating(cls, v):
        if not (0 <= v <= 5):
            raise ValueError("Rating must be between 0 and 5.")
        return v


#  helper schemas for nested data in PostOut


class SellerMiniOut(Schema):
    id: int
    full_name: str
    email: str
    profile_picture: Optional[str] = None
    rating: Decimal
    verified: bool = False

    @staticmethod
    def resolve_profile_picture(obj):
        if obj.profile_picture:
            print("profile picture url:", obj.profile_picture)  # Debug print
            return obj.profile_picture.url
        return Account.default_profile_picture


class HouseMiniOut(Schema):
    Price: Decimal
    Surface: Decimal
    RoomNum: int
    num_bedroom: Optional[int]
    num_bathroom: Optional[int]
    Types_of_Renters: Optional[str]
    num_beds : Optional[int]
    max_tenants: Optional[int]

    Description: str


class HouseLocationMiniOut(Schema):
    County: str
    State: str
    Country: str
    Latitude: float
    Longitude: float


class HouseImageMiniOut(Schema):
    id: Optional[int] = None  # Make ID optional for the blank fallback
    URL: str | None

    @staticmethod
    def resolve_URL(obj):
        if isinstance(obj, dict):  # This is the case for the blank image fallback
            return obj.get("URL")
        if obj.picture:
            return obj.picture.url  # when image exists return its url
        return None


class CommenterOut(Schema):
    id: int
    full_name: str
    profile_picture: Optional[str] = None

    @staticmethod
    def resolve_profile_picture(obj):
        if obj.profile_picture:
            return obj.profile_picture.url
        return Account.default_profile_picture


# Comment schemas
class CommentOut(Schema):
    id: uuid.UUID
    user_id: int
    rating: Decimal
    comment: str
    commenter: CommenterOut
    created_at: datetime
    modified_at: datetime

    @staticmethod
    def resolve_commenter(obj):
        return obj.user

    @staticmethod
    def resolve_user_id(obj):
        return obj.user.id


class CommentIn(Schema):
    comment: str = ""
    rating: Decimal

    @field_validator("rating")
    @classmethod
    def valid_rating(cls, v):
        if not (0 <= v <= 5):
            raise ValueError("Rating must be between 0 and 5.")
        return v

    @field_validator("comment")
    @classmethod
    def non_empty(cls, v):
        if not v.strip():
            raise ValueError("Comment cannot be empty.")
        return v


class CommentUpdate(Schema):
    comment: Optional[str] = None
    rating: Optional[Decimal] = None

    @field_validator("rating")
    @classmethod
    def valid_rating(cls, v):
        if v is not None and not (0 <= v <= 5):
            raise ValueError("Rating must be between 0 and 5.")
        return v


# schemas for reservations in the post detail page
class PostReservationOut(Schema):
    id: int
    post_id: uuid.UUID
    arrival_date: str  # ISO date string
    departure_date: str
    created_at: str
    duration_days: int  # Computed field

    @staticmethod
    def resolve_post_id(obj):
        return obj.post.id

    @staticmethod
    def resolve_arrival_date(obj):
        return obj.arrival_date.isoformat()

    @staticmethod
    def resolve_departure_date(obj):
        return obj.departure_date.isoformat()

    @staticmethod
    def resolve_created_at(obj):
        return obj.created_at.isoformat()

    @staticmethod
    def resolve_duration_days(obj):
        delta = obj.departure_date - obj.arrival_date
        return delta.days


# Post schemas


class PostOut(Schema):
    """Full post detail — used on the house detail page."""

    id: uuid.UUID
    title: str
    description: str
    status: str
    rating: float
    created_at: datetime
    updated_at: datetime
    views_count: int
    saves_count: int
    comments_count: int

    user_rating_post: Optional[Decimal] = None
    user_rating_seller: Optional[Decimal] = None

    seller: SellerMiniOut
    house: HouseMiniOut
    location: Optional[HouseLocationMiniOut] = None
    house_pictures: List[HouseImageMiniOut] = []
    comments: List[CommentOut] = []
    features: Optional[List[str]] = []
    allowed_people: Optional[str]
    house_rules: Optional[dict[str, bool]] = None
    reservations: List[
        PostReservationOut
    ] = []  # for the reservations related to this post

    @staticmethod
    def resolve_reservations(obj):
        """Return list of reservations for this post"""
        if hasattr(obj, "reservations") and obj.reservations.exists():
            return obj.reservations.all()
        return []

    @staticmethod
    def resolve_features(obj):
        features_qs = getattr(obj.house, "features", None)
        if features_qs:
            feature_list = features_qs.first().features.all()
            return [f.feature for f in feature_list]
        return []

    @staticmethod
    def resolve_allowed_people(obj):
        renter_type = obj.house.Types_of_Renters
        return renter_type if renter_type else "AL"

    @staticmethod
    def resolve_house_rules(obj):
        rules = obj.house.rules
        if rules:
            return {
                "allows_animals": rules.allows_animals,
                "allows_smoking": rules.allows_smoking,
                "allows_noise": rules.allows_noise,
            }
        return None

    @staticmethod
    def resolve_location(obj):
        locs = getattr(obj.house, "location", None)
        if locs and hasattr(locs, "first"):
            return locs.first()
        return locs

    @staticmethod
    def resolve_user_rating_post(obj, context):
        request = context["request"]
        user = request.user
        if not user.is_authenticated:
            return None
        return (
            Comment.objects.filter(post=obj, user=user, type="post")
            .values_list("rating", flat=True)
            .first()
        )

    @staticmethod
    def resolve_user_rating_seller(obj, context):
        request = context["request"]
        if not request.user.is_authenticated:
            return None
        return (
            Comment.objects.filter(
                user=request.user, post__seller=obj.seller, type="seller"
            )
            .values_list("rating", flat=True)
            .first()
        )

    @staticmethod
    def resolve_house_pictures(obj):
        pics = obj.house.pictures.all()

        if pics.exists():
            return pics
        return [{"URL": Pictures.blank_house_image}]

    @staticmethod
    def resolve_description(obj):
        return obj.house.Description


class PostListOut(Schema):
    """used on the main page listing."""

    id: uuid.UUID
    title: str
    status: str
    created_at: datetime
    views_count: int
    saves_count: int
    comments_count: int
    average_rating: Decimal

    Price: Decimal
    Surface: Decimal
    RoomNum: int
    Types_of_Renters: Optional[str]
    Country: Optional[str]
    County: Optional[str] 
    State: Optional[str]
    primary_image: Optional[str] = None  # URL of primary image

    @staticmethod
    def resolve_State(obj):
        loc = getattr(obj.house, "location", None)
        return loc.State if loc else None

    @staticmethod
    def resolve_Price(obj):
        return obj.house.Price

    @staticmethod
    def resolve_Country(obj):
        loc = getattr(obj.house, "location", None)
        return loc.Country if loc else None

    @staticmethod
    def resolve_Surface(obj):
        return obj.house.Surface

    @staticmethod
    def resolve_RoomNum(obj):
        return obj.house.RoomNum

    @staticmethod
    def resolve_Types_of_Renters(obj):
        return obj.house.Types_of_Renters

    @staticmethod
    def resolve_County(obj):
        loc = getattr(obj.house, "location", None)
        return loc.County if loc else None

    @staticmethod
    def resolve_average_rating(obj):
        return obj.rating

    @staticmethod
    def resolve_primary_image(obj):
        img = obj.primary_image
        return img

    @field_validator("title")
    @classmethod
    def non_empty_title(cls, v):
        if not v.strip():
            raise ValueError("Title cannot be empty.")
        return v


# SavedPost schemas
class SavedPostOut(Schema):
    post_id: uuid.UUID
    title: str
    saved_at: datetime
    price: Decimal
    State: Optional[str] = None
    primary_image: Optional[str] = None

    @staticmethod
    def resolve_post_id(obj):
        return obj.post.id


# Utility


class MessageSchema(Schema):
    message: str


class ErrorSchema(Schema):
    detail: str
