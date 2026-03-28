from ninja import Schema, Field
from typing import Optional, List
from datetime import datetime


# ─────────────────────────────────────────────
# Sub-schemas (reusable pieces)
# ─────────────────────────────────────────────

class LocationOut(Schema):
    County:    str
    State:     str
    Country:   str
    Longitude: float
    Latitude:  float


class PictureOut(Schema):
    id:  int
    URL: str


class FeatureOut(Schema):
    id:      int
    feature: str


# ─────────────────────────────────────────────
# My Nooks list  (image 1 — grid cards)
# ─────────────────────────────────────────────

class MyNookCardOut(Schema):
    """
    Light card shown in the My Nooks grid.
    Grouped by wilaya on the frontend using `state` field.
    """
    id:            str          # Post UUID
    title:         str
    status:        str
    rating:        float
    views_count:   int
    saves_count:   int
    comments_count: int

    # House fields
    price_per_night: int
    house_type:      str          # Apartment / Villa / Chalet
    primary_image:   Optional[str]
    state:           Optional[str] = None    # Wilaya  (for grouping)
    district:        Optional[str] = None    # County

    @staticmethod
    def resolve_id(obj):
        return str(obj.id)

    @staticmethod
    def resolve_price_per_night(obj):
        return obj.house.Price

    @staticmethod
    def resolve_house_type(obj):
        return obj.house.Types_of_Renters   # or add a type field to House

    @staticmethod
    def resolve_primary_image(obj):
        return obj.primary_image            # uses Post @property

    @staticmethod
    def resolve_state(obj):
        return obj.State                    # uses Post @property

    @staticmethod
    def resolve_district(obj):
        loc = obj.house.location.first()
        return loc.County if loc else None


# Post a new nook  (image 2 — CREATE)

class PostNookIn(Schema):
    """
    Payload for 'Post a new nook'.
    Pictures are uploaded separately via multipart (see api.py).
    """
    title:       str = Field(..., max_length=400)
    description: str = Field("", max_length=1000)

    # House core fields
    price:        int  = Field(..., gt=0, description="Price per night in DA")
    room_num:     int  = Field(1, ge=1,  description="Total rooms")
    num_bedroom:  int  = Field(1, ge=1)
    num_bathroom: int  = Field(1, ge=1)
    surface:      float = Field(..., gt=0, description="Surface in m²")
    types_of_renters: str = Field(
        "AL",
        description="AL=All  FA=Families  NM=No Males  NC=No Couples  NP=No Pets",
    )

    # Location
    county:    str    # baladia
    state:     str    # wilaya
    country:   str
    longitude: float
    latitude:  float

    # Features  (list of FeatureList IDs the seller selects)
    feature_ids: List[int] = []

    # Rules / toggles visible in the form
    allows_animals: bool = False
    allows_smoking: bool = False
    allows_noise:   bool = False

    # Categories
    for_family: bool = False
    for_single: bool = False
    for_couple: bool = False


# ─────────────────────────────────────────────
# Modify your nook  (image 3 — UPDATE)
# All fields optional — only sent fields are updated
# ─────────────────────────────────────────────

class UpdateNookIn(Schema):
    title:       Optional[str]   = Field(None, max_length=400)
    description: Optional[str]   = Field(None, max_length=1000)

    price:        Optional[int]   = Field(None, gt=0)
    room_num:     Optional[int]   = Field(None, ge=1)
    num_bedroom:  Optional[int]   = Field(None, ge=1)
    num_bathroom: Optional[int]   = Field(None, ge=1)
    surface:      Optional[float] = Field(None, gt=0)
    types_of_renters: Optional[str] = None

    county:    Optional[str]   = None
    state:     Optional[str]   = None
    country:   Optional[str]   = None
    longitude: Optional[float] = None
    latitude:  Optional[float] = None

    feature_ids: Optional[List[int]] = None

    allows_animals: Optional[bool] = None
    allows_smoking: Optional[bool] = None
    allows_noise:   Optional[bool] = None

    for_family: Optional[bool] = None
    for_single: Optional[bool] = None
    for_couple: Optional[bool] = None


# ─────────────────────────────────────────────
# Full nook detail  (pre-fills the Modify form)
# ─────────────────────────────────────────────

class NookDetailOut(Schema):
    id:            str
    title:         str
    description:   str
    status:        str
    rating:        float
    views_count:   int
    saves_count:   int
    comments_count: int
    created_at:    str
    updated_at:    str

    # House
    price_per_night:  int
    room_num:         int
    num_bedroom:      int
    num_bathroom:     int
    surface:          float
    types_of_renters: str

    # Location
    location: Optional[LocationOut] = None

    # Features
    features: List[FeatureOut] = []

    # Pictures
    pictures: List[PictureOut] = []
    primary_image: str

    # Toggles stored on House (you can add these fields to House model)
    allows_animals: bool = False
    allows_smoking: bool = False
    allows_noise:   bool = False
    for_family:     bool = False
    for_single:     bool = False
    for_couple:     bool = False

    @staticmethod
    def resolve_id(obj):
        return str(obj.id)

    @staticmethod
    def resolve_price_per_night(obj):
        return obj.house.Price

    @staticmethod
    def resolve_room_num(obj):
        return obj.house.RoomNum

    @staticmethod
    def resolve_num_bedroom(obj):
        return obj.house.num_bedroom

    @staticmethod
    def resolve_num_bathroom(obj):
        return obj.house.num_bathroom

    @staticmethod
    def resolve_surface(obj):
        return obj.house.Surface

    @staticmethod
    def resolve_types_of_renters(obj):
        return obj.house.Types_of_Renters

    @staticmethod
    def resolve_location(obj):
        return obj.house.location.first()

    @staticmethod
    def resolve_features(obj):
        f = obj.house.features.first()
        return list(f.features.all()) if f else []

    @staticmethod
    def resolve_pictures(obj):
        return list(obj.house.pictures.all())

    @staticmethod
    def resolve_primary_image(obj):
        return obj.primary_image

    @staticmethod
    def resolve_created_at(obj):
        return obj.created_at.isoformat()

    @staticmethod
    def resolve_updated_at(obj):
        return obj.updated_at.isoformat()


# ─────────────────────────────────────────────
# Picture upload response
# ─────────────────────────────────────────────

class PictureUploadOut(Schema):
    id:      int
    URL:     str
    message: str = "Picture uploaded successfully"