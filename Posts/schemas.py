from ninja import Schema
from pydantic import field_validator
from typing import Optional, List
from datetime import datetime
from decimal import Decimal
import uuid


#  helper schemas for nested data in PostOut 

class SellerMiniOut(Schema):
    id:              int
    full_name:       str
    email:           str
    profile_picture: str
    rating:          Decimal
    verified:        bool
    seller_status:   Optional[str]


class HouseMiniOut(Schema):
    id:             uuid.UUID
    price:          Decimal
    surface:        Decimal
    num_room:       int
    num_bedroom:    int
    num_bathroom:   int
    type_of_people: Optional[str]
    status:         str
    description:    str


class HouseLocationMiniOut(Schema):
    address:   str
    city:      str
    country:   str
    latitude:  Decimal
    longitude: Decimal


class HouseImageMiniOut(Schema):
    id:         uuid.UUID
    image_url:  str
    is_primary: bool
    sort_order: int


# Comment schemas
class CommentOut(Schema):
    id:          uuid.UUID
    user:     int
    full_name:   str
    rating:      Decimal
    comment:     str
    created_at:  datetime
    modified_at: datetime

    @staticmethod
    def resolve_full_name(obj):
        return obj.user.full_name

    @staticmethod
    def resolve_user_id(obj):
        return obj.user.id


class CommentIn(Schema):
    comment: str
    rating:  Decimal

    @field_validator('rating')
    @classmethod
    def valid_rating(cls, v):
        if not (0 <= v <= 5):
            raise ValueError('Rating must be between 0 and 5.')
        return v

    @field_validator('comment')
    @classmethod
    def non_empty(cls, v):
        if not v.strip():
            raise ValueError('Comment cannot be empty.')
        return v


class CommentUpdate(Schema):
    comment: Optional[str]  = None
    rating:  Optional[Decimal] = None


# Post schemas

class PostOut(Schema):
    """Full post detail — used on the house detail page."""
    id:             uuid.UUID
    title:          str
    description:    str
    status:         str
    created_at:     datetime
    updated_at:     datetime
    views_count:    int
    saves_count:    int
    comments_count: int

    seller:   SellerMiniOut
    house:    HouseMiniOut
    location: Optional[HouseLocationMiniOut] = None
    images:   List[HouseImageMiniOut]        = []
    comments: List[CommentOut]               = []


class PostListOut(Schema):
    """ used on the main page listing."""
    id:             uuid.UUID
    title:          str
    status:         str
    created_at:     datetime
    views_count:    int
    saves_count:    int
    comments_count: int
    average_rating: Decimal

    price:          Decimal
    surface:        Decimal
    num_room:       int
    type_of_people: Optional[str]
    city:           Optional[str]
    country:        Optional[str]
    primary_image:  Optional[str]    # URL of primary image

    @staticmethod
    def resolve_price(obj):
        return obj.house.price

    @staticmethod
    def resolve_surface(obj):
        return obj.house.surface

    @staticmethod
    def resolve_num_room(obj):
        return obj.house.num_room

    @staticmethod
    def resolve_type_of_people(obj):
        return obj.house.type_of_people

    @staticmethod
    def resolve_city(obj):
        loc = getattr(obj.house, 'location', None)
        return loc.city if loc else None

    @staticmethod
    def resolve_country(obj):
        loc = getattr(obj.house, 'location', None)
        return loc.country if loc else None

    @staticmethod
    def resolve_primary_image(obj):
        img = obj.house.images.filter(is_primary=True).first()
        if not img:
            img = obj.house.images.first()
        return img.image_url if img else None

    @staticmethod
    def resolve_average_rating(obj):
        return obj.average_rating()


class PostCreateSchema(Schema):
    """Create a post — house must already exist and belong to the seller."""
    house:    uuid.UUID
    title:       str
    description: str = ''

    @field_validator('title')
    @classmethod
    def non_empty_title(cls, v):
        if not v.strip():
            raise ValueError('Title cannot be empty.')
        return v


class PostUpdateSchema(Schema):
    title:       Optional[str] = None
    description: Optional[str] = None

# SavedPost schemas
class SavedPostOut(Schema):
    post:  uuid.UUID
    title:    str
    saved_at: datetime
    price:    Decimal
    city:     Optional[str]
    primary_image: Optional[str]

    @staticmethod
    def resolve_title(obj):
        return obj.post.title

    @staticmethod
    def resolve_price(obj):
        return obj.post.house.price

    @staticmethod
    def resolve_city(obj):
        loc = getattr(obj.post.house, 'location', None)
        return loc.city if loc else None

    @staticmethod
    def resolve_primary_image(obj):
        img = obj.post.house.images.filter(is_primary=True).first()
        return img.image_url if img else None


# Utility

class MessageSchema(Schema):
    message: str


class ErrorSchema(Schema):
    detail: str