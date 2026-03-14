from ninja import Schema 
from typing import Optional


class SearchCriteria(Schema):
    number_of_rooms :Optional[int] = None
    wilaya : Optional[str] = None 
    renter_rating : Optional[float] = None 
    post_rating : Optional[float] = None 
    min_price : Optional[int] = None 
    max_price : Optional[int] = None 
    features : Optional[list[str]] = []
    allowed_people: Optional[list[str]] = []
    rules : Optional[list[str]] = []
    order_by : Optional[str] = "newest"




class SearchResult(Schema):
    renter_name: str
    wilaya : str
    price :int
    rating : float
    description : str
    phone_number:int
    contact : str
    creation_time : str
    #photo : file
    #i have yet to implement file into the Backend/DB so this will have to wait for now

    class Config:
        from_attributes = True

    @staticmethod
    def resolve_renter_name(obj):
        return obj.Poster.full_name

    @staticmethod
    def resolve_wilaya(obj):
        return obj.House.location.County  # House → Location → State

    @staticmethod
    def resolve_price(obj):
        return obj.House.Price

    @staticmethod
    def resolve_rating(obj):
        return obj.Rating

    @staticmethod
    def resolve_description(obj):
        return obj.Description

    @staticmethod
    def resolve_phone_number(obj):
        return obj.Poster.contact.Phone_Number

    @staticmethod
    def resolve_contact(obj):
        return obj.Poster.email
    
    @staticmethod
    def resolve_creation_time(obj):
        return obj.Created_at.isoformat()
    