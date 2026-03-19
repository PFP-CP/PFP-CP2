from Accounts.models import Account, Contact
from django.shortcuts import get_object_or_404
from Houses.models import Location, Pictures
from ninja import Router
from ninja.errors import HttpError
from ninja_jwt.authentication import JWTAuth
from Posts.models import Post

from .models import Reservation
from .schemas import DeleteReservationOut, ReservationIn, ReservationOut

router = Router()


# Helper — converts one Reservation ORM instance into a dict that exactly
# matches ReservationOut (including all nested sub-schemas).
# Called by both GET and POST so the shape is always identical.


def _reservation_to_dict(r: Reservation) -> dict:
    # Wilaya comes from Houses.Location (FK from House)
    try:
        wilaya = Location.objects.get(house=r.post.House).State
    except Location.DoesNotExist:
        wilaya = "—"

    # Phone comes from Accounts.Contact (OneToOne from Account)
    try:
        phone = Contact.objects.get(Account=r.renter).Phone_Number
    except Contact.DoesNotExist:
        phone = None
    first_pic = Pictures.objects.filter(house=r.post.House).first()
    photo = first_pic.URL if first_pic else Pictures.blank_house_image
    return {
        "id": r.id,
        "renter": {
            "id": r.renter.id,
            "full_name": r.renter.full_name,
            "email": r.renter.email,
            "phone": phone,  # matches RenterOut.phone
        },
        "post": {
            "id": r.post.id,
            "Title": r.post.Title,
            "House": {
                "id": r.post.House.id,
                "Price": r.post.House.Price,
                "Description": r.post.House.Description,
                "wilaya": wilaya,
                "photo": photo,
            },
        },
        "arrival_date": r.arrival_date.isoformat(),
        "departure_date": r.departure_date.isoformat(),
        "created_at": r.created_at.isoformat(),
    }


@router.get("/", response=list[ReservationOut], auth=JWTAuth())
def list_reservations(request):
    user: Account = request.user

    reservations = (
        Reservation.objects.filter(post__Poster=user)  # only this host's listings
        .select_related(
            "renter",  # avoids N+1 on renter fields
            "post",
            "post__House",  # avoids N+1 on house fields
        )
        .order_by("-created_at")  # most recent first
    )

    return [_reservation_to_dict(r) for r in reservations]


@router.post(
    "/",
    response={201: ReservationOut},
    auth=JWTAuth(),
)
def create_reservation(request, payload: ReservationIn):
    user: Account = request.user

    if payload.arrival_date >= payload.departure_date:
        raise HttpError(400, "arrival_date must be strictly before departure_date.")

    post = get_object_or_404(Post, id=payload.post_id)

    # Overlap check — two ranges [A,B) and [C,D) overlap when A < D and B > C
    overlap = Reservation.objects.filter(
        post=post,
        arrival_date__lt=payload.departure_date,
        departure_date__gt=payload.arrival_date,
    ).exists()

    if overlap:
        raise HttpError(409, "These dates overlap with an existing reservation.")

    reservation = Reservation.objects.create(
        renter=user,
        post=post,
        arrival_date=payload.arrival_date,
        departure_date=payload.departure_date,
    )

    # select_related so _reservation_to_dict can access renter/post/House
    reservation = Reservation.objects.select_related(
        "renter", "post", "post__House"
    ).get(pk=reservation.pk)

    return 201, _reservation_to_dict(reservation)


@router.delete("/{reservation_id}", auth=JWTAuth(), response=DeleteReservationOut)
def delete_reservation(request, reservation_id: int):
    """
    Delete a reservation.
    Allowed if:
      - requester is the renter who made the reservation, OR
      - requester is the host/owner of the post (post.Poster)
    """
    user: Account = request.user

    reservation = (
        Reservation.objects.select_related("renter", "post", "post__Poster")
        .filter(id=reservation_id)
        .first()
    )

    if not reservation:
        raise HttpError(404, "Reservation not found.")

    # Authorization rule
    is_renter = reservation.renter_id == user.id
    is_host = reservation.post.Poster_id == user.id

    if not (is_renter or is_host):
        raise HttpError(403, "You are not allowed to delete this reservation.")

    reservation.delete()
    return {
        "message": "Reservation deleted successfully.",
        "reservation_id": reservation_id,
    }
