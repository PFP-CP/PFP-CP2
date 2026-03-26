from datetime import date
from typing import Optional
from uuid import UUID

from ninja import Schema
from uuid import UUID 
#  Renter block


class RenterOut(Schema):
    id: int
    full_name: str
    email: str
    phone: Optional[int]


# House block


class HouseOut(Schema):
    id: int
    Price: int
    Description: str
    wilaya: str
    photo: str


# Post block


class PostOut(Schema):
    id: UUID
    Title: str
    House: HouseOut


# Full reservation row (one row in the UI table)


class ReservationOut(Schema):
    id: int
    renter: RenterOut
    post: PostOut
    arrival_date: date
    departure_date: date
    created_at: str


# Input body for POST /Reservations/


class ReservationIn(Schema):
    post_id: UUID
    arrival_date: date
    departure_date: date


# output for DELETE /Reservations/{reservation_id}
class DeleteReservationOut(Schema):
    message: str
    reservation_id: int
