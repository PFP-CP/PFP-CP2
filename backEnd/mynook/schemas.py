from ninja import Schema, Field
from typing import Optional, List
from Accounts.models import Account
from Reservations.models import Reservation  # avoid circular import
from uuid import UUID
from Houses.models import Pictures
from Posts.models import PostStatus


# Sub-schemas (reusable pieces)
class LocationOut(Schema):
    County:    str
    State:     str
    Country:   str
    Longitude: float
    Latitude:  float

class PictureOut(Schema):
    url: str

    @staticmethod
    def resolve_url(obj):
        if obj.picture:
            return obj.picture.url
        return Pictures.blank_house_image 

class FeatureOut(Schema):
    id:      int
    feature: str 

#  SHARED
class NookCardOut(Schema):
    """Single  list."""
    id: UUID
    title: str                    
    primary_image: Optional[str]  # resolved by Post.primary_image property
    price_per_night: float
    rating: float                
    wilaya: Optional[str]=None         # used by frontend to group cards
    County: Optional[str]=None         

    @staticmethod
    def resolve_price_per_night(obj):
        return obj.house.Price

    @staticmethod
    def resolve_wilaya(obj):
        loc = obj.house.location.first()
        return loc.State if loc else None

    @staticmethod
    def resolve_commune(obj):
        loc = obj.house.location.first()
        return loc.County if loc else None  # adjust to your Location field name


#  PUBLIC VIEW  —  GET /profile/{seller_id}
class SellerPublicOut(Schema):
    id: int
    full_name: str
    profile_picture: Optional[str]
    gender: Optional[str]         # ♂ / ♀ displayed as icons on frontend
    date_of_birth: Optional[str]=None   
    host_since: int                # year only: 2016
    rating: float                  # 4.30
    location: Optional[str] =None       
    email: str
    mobile_number: Optional[str]
    reviews_count: int       # num_review on Account
    nooks_count: int         # available posts count
    reservations_count: int  # all reservations ever made on seller's posts

    
    @staticmethod
    def resolve_profile_picture(obj):
        if obj.profile_picture : 
         return obj.profile_picture.url  
        return Account.default_profile_picture

    @staticmethod
    def resolve_date_of_birth(obj):
        if obj.date_of_birth:
            return obj.date_of_birth.strftime("%d/%m/%Y")
        return None

    @staticmethod
    def resolve_host_since(obj):
        return obj.date_joined.year

    @staticmethod
    def resolve_location(obj):
        # adjust to your Account field that stores the seller's city
        location=obj.location
        return getattr(location, 'State', None)  

    @staticmethod
    def resolve_mobile_number(obj):
        contact = getattr(obj, 'contact', None)
        return contact.Phone_Number if contact else None 

    @staticmethod
    def resolve_reviews_count(obj):
        return obj.num_review if obj.num_review is not None else 0
    @staticmethod
    def resolve_nooks_count(obj):
        return obj.num_posts if obj.num_posts is not None else 0
    @staticmethod
    def resolve_reservations_count(obj):
        return Reservation.objects.filter(post__seller=obj).count()


class SellerPublicProfileOut(Schema):
    """Full response for the public profile page."""
    seller: SellerPublicOut
    nooks: List[NookCardOut]


#  PRIVATE DASHBOARD  —  GET /dashboard

class TenantOut(Schema):
    """Only populated when the post status is RENTED """
    full_name: str
    mobile: Optional[str]
    email: str

    @staticmethod
    def resolve_full_name(obj):
        return obj.full_name 
    
    @staticmethod
    def resolve_mobile(obj):
        contact = getattr(obj, 'contact', None)
        return contact.Phone_Number if contact else None
    
    @staticmethod
    def resolve_email(obj):
        return obj.email


class NookPrivateOut(Schema):
    """One row in the owner's dashboard table."""
    id: UUID
    primary_image: Optional[str]

    # Description column: 
    title: str
    price_per_night: float
    rating: float

    # Wilaya column (table is sorted by this)
    wilaya: Optional[str]

    # Status column: 
    status: str

    # Tenant columns — None when status is not Rented
    current_tenant: Optional[TenantOut]=None

    @staticmethod
    def resolve_price_per_night(obj):
        return obj.house.Price

    @staticmethod
    def resolve_wilaya(obj):
        loc = obj.house.location.first()
        return loc.State if loc else None

    @staticmethod
    def resolve_current_tenant(obj):
        # only expose tenant data when actually rented
        if obj.status == PostStatus.RENTED:
            return obj.current_tenant
        return None




# Post a new nook  (image 2 — CREATE)

class PostNookIn(Schema):
    """
    Payload for 'Post a new nook'.
    Pictures are uploaded separately via multipart (see api.py).
    """ 
    house_type: str = "Apartment"
    description: str = Field("", max_length=1000) 

    # House core fields
    price:        int  = Field(..., gt=0, description="Price per night in DA")
    room_num:     int  = Field(1, ge=1,  description="Total rooms")
    num_bedroom:  int  = Field(1, ge=1)
    num_bathroom: int  = Field(1, ge=1)
    num_beds:     Optional[int]   = Field(None, ge=1)
    max_tenants:  Optional[int]   = Field(None, ge=1)
    surface:      float = Field(..., gt=0, description="Surface in m²")
    types_of_renters: str = Field(
        "AL",
        description="AL=All  FA=Families  NM=No Males  NC=No Couples  NP=No Pets",
    )

    # Location
    county:    str   
    state:     str   
    country:   str="Algeria"
    longitude: float
    latitude:  float

    # Features  (list of FeatureList IDs the seller selects)
    feature_ids: List[int] = []

    # Rules
    allows_animals: bool = False
    allows_smoking: bool = False
    allows_noise:   bool = False
    
    def validate_rules(self):
        """Validate that number of beds and max tenants are correct"""
        # Validate num_beds
        if self.num_beds is not None and self.num_beds < self.num_bedroom:
            raise ValueError("Number of beds cannot be less than number of bedrooms")

        # Validate max_tenants
        if self.max_tenants is not None:
            beds = self.num_beds if self.num_beds is not None else self.num_bedroom
            if self.max_tenants < beds:
                raise ValueError("Max tenants cannot be less than number of beds")

# Modify your nook  
# All fields optional — only sent fields are updated

class UpdateNookIn(Schema):
    house_type:       Optional[str]   = "Apartment"
    description: Optional[str]   = Field(None, max_length=1000)

    price:        Optional[int]   = Field(None, gt=0)
    room_num:     Optional[int]   = Field(None, ge=1)
    num_bedroom:  Optional[int]   = Field(None, ge=1)
    num_bathroom: Optional[int]   = Field(None, ge=1)
    num_beds:      Optional[int]   = Field(None, ge=1)
    max__tenants:   Optional[int]   = Field(None, ge=1)
    surface:      Optional[float] = Field(None, gt=0)
    types_of_renters:Optional[str] = Field(
        "AL",
        description="AL=All  FA=Families  NM=No Males  NC=No Couples  NP=No Pets",
    )
 
    county:    Optional[str]   = None
    state:     Optional[str]   = None
    country:   Optional[str]   = None
    longitude: Optional[float] = None
    latitude:  Optional[float] = None

    feature_ids: Optional[List[int]] = [ ]

    allows_animals: Optional[bool] = None
    allows_smoking: Optional[bool] = None
    allows_noise:   Optional[bool] = None
    def validate_rules(self):
        """Validate that number of beds and max tenants are correct"""
        # Validate num_beds
        if self.num_beds is not None and self.num_beds < self.num_bedroom:
            raise ValueError("Number of beds cannot be less than number of bedrooms")

        # Validate max_tenants
        if self.max_tenants is not None:
            beds = self.num_beds if self.num_beds is not None else self.num_bedroom
            if self.max_tenants < beds:
                raise ValueError("max tenants cannot be less than number of beds")
        

       
 # Full nook detail  (pre-fills the Modify form)

class NookDetailOut(Schema):
    id:            UUID
    title:         Optional[str]
    description:   Optional[str]    
    status:        Optional[str]
    rating:        Optional[float]
    views_count:   Optional[int]
    saves_count:   Optional[int]
    comments_count: Optional[int]
    created_at:   Optional[str]
    updated_at:    Optional[str]

    # House
    price_per_night:  Optional[int]
    room_num:         Optional[int]
    num_bedroom:     Optional[int]
    num_bathroom:     Optional[int]
    surface:          Optional[float]
    types_of_renters: Optional[str]

    # Location
    location: Optional[LocationOut] = None

    # Features
    features: List[FeatureOut] = []

    # Pictures
    pictures: List[PictureOut]= []
    primary_image: Optional[str] 

    # Toggles stored on House (you can add these fields to House model)
    house_rules: Optional[dict[str, bool]] = None
    types_of_renters: str = "AL"  
    @staticmethod
    def resolve_primary_image(obj):
        return obj.primary_image
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
    def resolve_price_per_night(obj):
        return obj.house.Price

    @staticmethod
    def resolve_room_num(obj):
        return obj.house.RoomNum
    @staticmethod 
    def resolve_description(obj):
        return obj.house.Description
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
    def resolve_created_at(obj):
        return obj.created_at.isoformat()

    @staticmethod
    def resolve_updated_at(obj):
        return obj.updated_at.isoformat()

        
# Picture upload response

class PictureUploadOut(Schema):
    id:      int
    url:     str
    message: str = "Picture uploaded successfully"
    @staticmethod
    def resolve_url(obj):
        if obj.picture:
            return obj.picture.url
class PictureDeleted(Schema):
    message: str
    