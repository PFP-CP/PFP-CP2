import uuid
from typing import List, Optional
from ninja import Field, Schema
from datetime import datetime
from pydantic import field_validator

class PostListOut(Schema):
    """used on the main page listing."""

    id: uuid.UUID
    title: str
    status: str
    created_at: datetime
    views_count: int
    saves_count: int
    comments_count: int
    
    # Map directly to the rating field on Post
    rating: float = Field(..., alias="rating")

    # Map directly to House attributes
    Price: int = Field(..., alias="house.Price")
    Surface: float = Field(..., alias="house.Surface")
    RoomNum: int = Field(..., alias="house.RoomNum")
    Types_of_Renters: Optional[str] = Field(None, alias="house.Types_of_Renters")

    # Map directly to Location attributes (Now that it's OneToOne)
    Country: Optional[str] = Field(None, alias="house.location.Country")
    County: Optional[str] = Field(None, alias="house.location.County")
    State: Optional[str] = Field(None, alias="house.location.State")
    
    primary_image: Optional[str] = None

    @staticmethod
    def resolve_State(obj):
        loc = getattr(obj.house, "location", None)
        if loc and hasattr(loc, "first"):
            loc_obj = loc.first()
            return loc_obj.State if loc_obj else None
        return None

    @staticmethod
    def resolve_Price(obj):
        return obj.house.Price

    @staticmethod
    def resolve_Country(obj):
        loc = obj.house.location.first()
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
        if loc and hasattr(loc, "first"):
            loc_obj = loc.first()
            return loc_obj.County if loc_obj else None
        return None

    @staticmethod
    def resolve_rating(obj):
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
