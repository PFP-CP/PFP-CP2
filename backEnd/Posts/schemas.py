 
from ninja import Schema
from pydantic import field_validator
from typing import Optional, List
from datetime import datetime
from decimal import Decimal
import uuid
from ninja import Schema
from typing import Optional


class SearchCriteria(Schema):
    number_of_rooms:  Optional[int]       = None
    wilaya:           Optional[str]       = None
    renter_rating:    Optional[float]     = None
    post_rating:      Optional[float]     = None
    min_price:        Optional[int]       = None
    max_price:        Optional[int]       = None
    features:         Optional[list[str]] = []
    allowed_people:   Optional[list[str]] = []
    rules:            Optional[list[str]] = []
    order_by:         Optional[str]       = "newest"


class SearchResult(Schema):
    renter_name:   str
    wilaya:        str
    price:         int
    rating:        float
    description:   str
    phone_number:  Optional[str]=None
    contact:       str
    creation_time: str

    class Config:
        from_attributes = True

    @staticmethod
    def resolve_renter_name(obj):
        # Adjust to your Account field — e.g. full_name, username, etc.
        return obj.seller.full_name

    @staticmethod
    def resolve_wilaya(obj):
        # House → location (FK/related) → State
        loc=obj.house.location.first()
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
        return obj.description

    @staticmethod
    def resolve_phone_number(obj):
        return obj.phone_number

    @staticmethod
    def resolve_contact(obj):
        return obj.seller.email

    @staticmethod
    def resolve_creation_time(obj):
        return obj.created_at.isoformat()
#  helper schemas for nested data in PostOut 

class SellerMiniOut(Schema):
    id:              int
    full_name:       str
    email:           str
    profile_picture: str
    rating:          Decimal
    verified:        bool
    


class HouseMiniOut(Schema):
   
    Price:          Decimal
    Surface:        Decimal
    RoomNum:       int
    num_bedroom:    Optional[int]
    num_bathroom:   Optional[int]
    Types_of_Renters: Optional[str]
    
    Description:    str


class HouseLocationMiniOut(Schema):
    County:   str 
    State:      str 
    Country:   str
    Latitude:  float
    Longitude: float
class HouseImageMiniOut(Schema):
    URL: str


# Comment schemas
class CommentOut(Schema):
    id:          uuid.UUID
    user_id:     int
    rating:      Decimal
    comment:     str
    created_at:  datetime
    modified_at: datetime

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
    rating :       float
    created_at:     datetime 
    updated_at:     datetime
    views_count:    int
    saves_count:    int
    comments_count: int

    seller:   SellerMiniOut
    house:    HouseMiniOut
    location: Optional[HouseLocationMiniOut] = None
    house_pictures:   List[HouseImageMiniOut]        = []
    comments: List[CommentOut]               = []

    @staticmethod
    def resolve_location(obj):
        locs = getattr(obj.house, 'location', None)
        if locs and hasattr(locs, 'first'):
            return locs.first()
        return locs

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

    Price:          Decimal
    Surface:        Decimal
    RoomNum:       int
    Types_of_Renters: Optional[str]
    County:           Optional[str]
    # primary_image:  Optional[str]    # URL of primary image

    @staticmethod
    def resolve_Price(obj):
        return obj.house.Price

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
        loc = getattr(obj.house, 'location', None)
        if loc and hasattr(loc, 'first'):
            loc_obj = loc.first()
            return loc_obj.County if loc_obj else None
        return None
  
    @staticmethod
    def resolve_average_rating(obj):
        return obj.rating
    # @staticmethod
    # def resolve_primary_image(obj):
    #     img = obj.house.pictures.first()
    #     return img.URL if img else None

class PostCreateSchema(Schema):
    # --- REQUIRED ---
    title: str
    price: Decimal
    surface: Decimal
    room_num: int
    county: str
    state: str
    
    # --- OPTIONAL
    description: str = ""  # Post-specific summary
    house_description: str = ""  # Detailed house info
    types_of_renters: Optional[str] = "All"
    country: str = "Algeria"
    num_bedroom: Optional[int] = None
    num_bathroom: Optional[int] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
  
    @field_validator('title')
    @classmethod
    def non_empty_title(cls, v):
        if not v.strip():
            raise ValueError('Title cannot be empty.')
        return v

class PostUpdateSchema(Schema):
    title:       Optional[str] = None
    description: Optional[str] = None
    status:         Optional[str]
    

# SavedPost schemas
class SavedPostOut(Schema):
    
    post_id:  uuid.UUID
    title:    str
    saved_at: datetime
    Price:    Decimal
    State:     Optional[str]
    primary_image: Optional[str]

    @staticmethod
    def resolve_title(obj):
        return obj.post.title

    @staticmethod
    def resolve_price(obj):
        return obj.price

    @staticmethod
    def resolve_State(obj):
         
        return obj.State
    

    @staticmethod
    def resolve_primary_image(obj):
        return obj.primary_image


# Utility

class MessageSchema(Schema):
    message: str


class ErrorSchema(Schema):
    detail: str     