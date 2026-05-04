from django.shortcuts import get_object_or_404
from ninja import Router
from ninja.errors import HttpError
from ninja_jwt.authentication import JWTAuth
from django.core.mail import send_mail

import utilitymethods.Pictures as Pic
from Accounts.models import Account
from Houses.models import Pictures
from Posts.models import Post, SavedPost

from .models import Reservation
from .schemas import (
    DeleteReservationOut,
    ReservationIn,
    ReservationOut,
    SimpleReservationOut,
)

router = Router()


# Helper — converts one Reservation ORM instance into a dict that exactly
# matches ReservationOut (including all nested sub-schemas).
# Called by both GET and POST so the shape is always identical.


def _reservation_to_dict(r: Reservation) -> dict:
    # Safely access Location without N+1
    try:
        wilaya = (
            r.post.house.location.State if hasattr(r.post.house, "location") else "—"
        )
    except Exception:
        wilaya = "—"

    # Safely access Phone without N+1
    try:
        phone = r.renter.contact.Phone_Number if hasattr(r.renter, "contact") else None
    except Exception:
        phone = None

    # Safely access Pictures without N+1
    try:
        house_pics = r.post.house.pictures.all()
        first_pic = house_pics[0] if house_pics else None
    except Exception:
        first_pic = None

    photo = (
        Pic.get_picture_url(first_pic, "picture")
        if first_pic
        else Pictures.blank_house_image
    )
    return {
        "id": r.id,
        "renter": {
            "id": r.renter.pk,
            "full_name": r.renter.full_name,
            "email": r.renter.email,
            "phone": phone,  # matches RenterOut.phone
        },
        "post": {
            "id": str(r.post.id),
            "Title": r.post.title,
            "House": {
                "id": r.post.house.id,
                "Price": r.post.house.Price,
                "Description": r.post.house.Description,
                "wilaya": wilaya,
                "photo": photo,
            },
        },
        "arrival_date": r.arrival_date.isoformat(),
        "departure_date": r.departure_date.isoformat(),
        "created_at": r.created_at.isoformat(),
    }


@router.get("/", response=list[ReservationOut], auth=JWTAuth(), tags=["Reservations"])
def list_reservations(request):
    user: Account = request.user

    reservations = (
        Reservation.objects.filter(post__seller=user)  # only this host's listings
        .select_related(
            "renter",  # avoids N+1 on renter fields
            "renter__contact",  # avoids N+1 on contact
            "post",
            "post__house",  # avoids N+1 on house fields
            "post__house__location",  # avoids N+1 on location
        )
        .prefetch_related(
            "post__house__pictures"  # avoids N+1 on pictures
        )
        .order_by("-created_at")  # most recent first
    )

    return [_reservation_to_dict(r) for r in reservations]


@router.post("/", response={201: ReservationOut}, auth=JWTAuth(), tags=["Reservations"])
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
    message = f"{user.full_name} has made a reservation on your Posting "
    send_mail(
        "A Reservation has been made ",
        message,
        "nook.app1@gmail.com",
        [post.seller.email],
    )
    # select_related so _reservation_to_dict can access renter/post/House without N+1
    reservation = (
        Reservation.objects.select_related(
            "renter", "renter__contact", "post", "post__house", "post__house__location"
        )
        .prefetch_related("post__house__pictures")
        .get(pk=reservation.pk)
    )


    # Auto-save the post to the user's favorites
    saved_post, created = SavedPost.objects.get_or_create(user=user, post=post)
    if created:
        post.increment_saves()

    return 201, _reservation_to_dict(reservation)


@router.get(
    "/post/{post_id}",
    response=list[SimpleReservationOut],
    auth=JWTAuth(),
    tags=["Reservations"],
)
def get_user_reservations_for_post(request, post_id: str):
    """
    Get all reservations that the current user made on a specific post.
    """
    user: Account = request.user

    reservations = Reservation.objects.filter(post_id=post_id, renter=user).order_by(
        "-created_at"
    )

    return [
        {
            "id": r.id,
            "arrival_date": r.arrival_date,
            "departure_date": r.departure_date,
        }
        for r in reservations
    ]


@router.delete(
    "/{reservation_id}",
    auth=JWTAuth(),
    tags=["Reservations"],
    response=DeleteReservationOut,
)
def delete_reservation(request, reservation_id: int):
    """
    Delete a reservation.
    Allowed if:
      - requester is the renter who made the reservation, OR
      - requester is the host/owner of the post (post.Poster)
    """
    user: Account = request.user

    reservation = (
        Reservation.objects.select_related("renter", "post", "post__seller")
        .filter(id=reservation_id)
        .first()
    )

    if not reservation:
        raise HttpError(404, "Reservation not found.")

    # Authorization rule
    is_renter = reservation.renter.pk == user.pk
    is_host = reservation.post.seller.pk == user.pk

    if not (is_renter or is_host):
        raise HttpError(403, "You are not allowed to delete this reservation.")

    reservation.delete()
    return {
        "message": "Reservation deleted successfully.",
        "reservation_id": reservation_id,
    }
