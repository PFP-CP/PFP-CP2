from datetime import date
from typing import Dict, List, Optional
from uuid import UUID

from ninja import ModelSchema, Schema

from .models import Account


class AccountSchema(ModelSchema):
    class Meta:
        model = Account
        exclude = ["password"]

    Gender: str

    @staticmethod
    def resolve_Gender(obj: Account):
        return "Male" if obj.gender else "Female"


class AccountSignin(ModelSchema):
    gender: str
    state: str
    type_of_user: str = "GUEST"
    phone_number: str

    class Meta:
        model = Account
        fields = ["full_name", "email", "password", "date_of_birth"]


class ResetPassword(Schema):
    email: str
    new_password: Optional[str] = None
    key: Optional[str] = None


class AccountLogin(Schema):
    password: str
    Identifier: str


class EmailConfirmation(Schema):
    email: str
    key: Optional[str] = None


class HostPostOut(Schema):
    # Schema for the small post cards shown under each city

    id: UUID
    title: str
    price: int
    rating: float
    primary_image: Optional[str] = None


class HostProfileOut(Schema):
    # Schema for the entire host profile page

    id: int
    full_name: str
    gender: str
    email: str
    phone_number: Optional[str] = None
    date_of_birth: Optional[date] = None
    location: str
    rating: float
    num_reviews: int
    num_nooks: int
    num_reservations: int
    join_date: date
    profile_picture: Optional[str] = None

    # Dictionary where keys are City names, and values are lists of posts
    posts_by_city: Dict[str, List[HostPostOut]]
