import json
import secrets
import string as STRING
from pathlib import Path

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.cache import cache
from django.core.mail import send_mail
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from ninja import Router
from ninja.errors import HttpError
from ninja_jwt.authentication import JWTAuth
from ninja_jwt.tokens import RefreshToken

import utilitymethods.Pictures as Pic
from Houses.models import Pictures
from Posts.models import Post, PostStatus
from Reservations.models import Reservation

from .models import *
from .schemas import *

tokenizer = PasswordResetTokenGenerator()
router = Router()


# function to sign in  a new user with given fields
@router.post("/Signup")
def Signin(request, Acc: AccountSignin):
    # check is user already exist
    if Account.objects.filter(email__exact=Acc.email).exists():
        return {"Error": "User Already in Data Base"}

    # 2. Check if phone number already exists (#noCrash)
    if Contact.objects.filter(Phone_Number=Acc.phone_number).exists():
        return {"Error": "Phone number is already registered"}

    # switches gender string to boolean
    gen = Acc.gender.lower() == "male"

    # json file that has all of algerias wilayas that gets parced to get the name from code
    main_dir = Path(__file__).parents[1]
    wilaya_dir = main_dir / "wilayas/wilayas.json"
    with open(wilaya_dir, "r") as file_json:
        wilayas = json.load(file_json)

    # create newuser with the data given
    # add email verification
    new_acc = Account.objects.create_user(
        email=Acc.email,
        password=Acc.password,
        is_active=False,
        gender=gen,
        full_name=Acc.full_name,
        date_of_birth=Acc.date_of_birth,
        type_of_user=Acc.type_of_user,
    )
    location.objects.create(
        Account=new_acc,
        County=wilayas[Acc.state],
        State=Acc.state,
        Country="Algeria",
    )
    # CREATE contact object
    Contact.objects.create(
        Account=new_acc,
        Phone_Number=Acc.phone_number,
    )
    new_acc.save()

    refresh = RefreshToken.for_user(new_acc)

    return {
        "message": "Account created successfully",
        "tokens": {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        },
    }


def generate_confirmation_key():
    length = 8
    mail_conf_key = "".join(
        secrets.choice(STRING.ascii_letters + STRING.digits) for _ in range(length)
    )
    return mail_conf_key


def verify_confirmation_key(cached_key, user_key):
    if not cached_key:
        return False, "Key has expired or no key was requested"
    if cached_key != user_key:
        return False, "Wrong Key"
    return True, "Success"


# add a function for email confirmation
@router.patch(
    "/email_confirmation", auth=JWTAuth(), response={200: dict, 400: dict, 404: dict}
)
def confirm_email(request, confirmdata: EmailConfirmation):
    User = Account.objects.filter(email__exact=confirmdata.email).first()

    if not User:
        raise HttpError(404, "User not found")
    if User.is_active:
        return 400, {"detail": "user's email already active"}

    if confirmdata.key is not None:
        cached_key = cache.get(f"email_confirmation_{User.id}")
        success, message = verify_confirmation_key(cached_key, confirmdata.key)
        if success:
            User.is_active = True
            User.save()
            cache.delete(f"email_confirmation_{User.id}")
        return 200, {"detail": message}

    key = generate_confirmation_key()
    # 300 is the number of seconds before the expiration of the key aka 5min
    cache.set(f"email_confirmation_{User.id}", key, timeout=300)

    send_mail(
        "Email Confirmation",
        f"Here is the code that will enable you to confirm your email address\n {key}\n please copy it into the appropriate field ",
        "nook.app1@gmail.com",
        [confirmdata.email],
    )
    return 200, {"detail": "Email Sent Successfully"}


# function that logs a user in (missing JWT implementation)
@router.post("/Login")
def Login(request, Acc: AccountLogin):
    User = Account.objects.filter(email__exact=Acc.Identifier).first()

    if not User:
        return {"Error": "Account doesnt exist would you please sign in"}
    if not User.check_password(Acc.password):
        return {"Error": "Account doesnt exist would you please sign in"}
    else:
        # Generate JWT tokens
        refresh = RefreshToken.for_user(User)

        return {
            "message": "Welcome back",
            "tokens": {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
        }


# function that resets the password of the user through a key
def password_reset(key: str, new_password: str):

    split_key = key.split(":")

    if len(split_key) != 2:
        return {"error": "Invalid key format"}

    try:
        uid = urlsafe_base64_decode(split_key[1]).decode()
        user = Account.objects.get(pk=uid)
    except (Account.DoesNotExist, ValueError):
        return {"error": "Invalid key"}

    if not tokenizer.check_token(user, split_key[0]):
        return {"error": "Key is expired or invalid"}

    user.set_password(new_password)
    user.save()

    return {"message": "Password reset successfully"}


# funstion that gets a mailing address and check if a user exists with said address , if yes it sends a Key to reset the password of said user
@router.patch("/passwordReset")
def password_forgotten(request, ResetCred: ResetPassword):

    if ResetCred.key and ResetCred.new_password:
        return password_reset(ResetCred.key, ResetCred.new_password)

    User = Account.objects.filter(email__exact=ResetCred.email).first()
    if not User:
        return {"Error": "Account doesnt exist or email is wrong"}
    else:
        token = tokenizer.make_token(User)
        # hashes the user ID into a base64 encoded string
        uid = urlsafe_base64_encode(force_bytes(User.pk))
        key = f"{token}:{uid}"
        # Message including the Token and hashes UID
        Message = f"Here are your UID and Token that will enable you to reset your pass word.\n please copy and paste the sentence bellow in the corresponding field. \n {key}"
        # sends email to the account that contains our key
        send_mail(
            "test",
            Message,
            "nook.app1@gmail.com",
            # if you want to test just put your own email in between the brackets as a string
            [User.email],
        )
        return {"Message": "Account found , email sent"}


# fucntion that get a profile based on ID
@router.get(
    "/my-profile/", response=HostProfileOut, tags=["Account Profile"], auth=JWTAuth()
)
def get_host_profile(request):
    """
    Returns the complete profile page for a host, including their stats
    and their active listings grouped by city.
    """
    # 1. Get the Host Account
    host = request.user

    # Get Phone & City
    phone = getattr(host, "contact", None)
    phone_number = str(phone.Phone_Number).zfill(10) if phone else None

    loc = getattr(host, "location", None)
    host_city = loc.State if loc and loc.State else "Unknown"

    # Calculate total reservations made ON this host's posts
    total_reservations = Reservation.objects.filter(post__seller=host).count()

    # Group Posts by City
    posts_by_city = {}
    active_posts = []
    if host.type_of_user.upper() == "SELLER" or host.verified:
        # Fetch hosts active posts
        active_posts = (
            Post.objects.filter(seller=host)
            .select_related("house")
            .prefetch_related("house__location", "house__pictures")
        )

        for post in active_posts:
            # get city
            post_loc = post.house.location.first()
            city_name = post_loc.State if post_loc and post_loc.State else "whatever"

            # first image
            first_pic = post.house.pictures.first()
            url = (
                Pic.get_picture_url(first_pic, "picture")
                if first_pic
                else Pictures.blank_house_image
            )
            # Build the post dictionary
            post_data = {
                "id": post.id,
                "title": post.title,
                "price": post.house.Price,
                "rating": post.rating,
                "primary_image": url,
            }

            # Add to the dictionary under the correct city
            if city_name not in posts_by_city:
                posts_by_city[city_name] = []
            posts_by_city[city_name].append(post_data)
    # format output
    return {
        "id": host.id,
        "full_name": host.full_name,
        "gender": "male" if host.gender else "female",
        "email": host.email,
        "phone_number": phone_number,
        "date_of_birth": host.date_of_birth,
        "location": host_city,
        "rating": host.rating,
        "num_reviews": host.num_review,
        "num_nooks": len(active_posts)
        if (host.type_of_user.upper() == "SELLER")
        else -255,
        "num_reservations": total_reservations,
        "join_date": host.date_joined.date(),
        "profile_picture": Pic.get_picture_url(host, "profile_picture"),
        "posts_by_city": posts_by_city
        if (host.type_of_user.upper() == "SELLER")
        else {"Become a Seller to be able to Post": []},
    }


# patch endpoint for updating profile
@router.patch("/profile/", auth=JWTAuth(), tags=["Account Profile"])
def update_profile(request, payload: AccountUpdateIn):
    user = request.user

    # Check if the new email is already taken by another user
    if (
        payload.email
        and Account.objects.exclude(id=user.id).filter(email=payload.email).exists()
    ):
        return 400, {"message": "Email already in use."}

    # Check if the new phone number is already taken by another contact
    if (
        payload.phone_number
        and Contact.objects.exclude(Account=user)
        .filter(Phone_Number=payload.phone_number)
        .exists()
    ):
        return 400, {"message": "Phone number already in use."}

    # Update main Account fields if provided
    if payload.full_name is not None:
        user.full_name = payload.full_name
    if payload.email is not None:
        user.email = payload.email
    if payload.date_of_birth is not None:
        user.date_of_birth = payload.date_of_birth
    if payload.gender is not None:
        # baroudi 9alek dir M ou F rigl
        gender_val = payload.gender.upper()
        if gender_val.startswith("M"):
            user.gender = Account.GenderType.MALE
        elif gender_val.startswith("F"):
            user.gender = Account.GenderType.FEMALE

    # Save Account changes
    user.save()

    # Update Phone Number in the Contact model
    if payload.phone_number is not None:
        contact, _ = Contact.objects.get_or_create(Account=user)
        contact.Phone_Number = payload.phone_number
        contact.save()

    # Update State in the location model
    if payload.state is not None:
        loc, _ = location.objects.get_or_create(Account=user)
        loc.State = payload.state
        loc.save()

    return {"message": "Profile updated successfully."}


@router.patch("/changePassword/", auth=JWTAuth(), response={400: dict, 200: dict})
def change_password(request, passwords: ChangePassword):
    user = request.user
    if not user.check_password(passwords.old_password):
        return 400, {"Error": "Wrong password"}

    user.set_password(passwords.new_password)
    user.save()

    return 200, {"Success": "Password changed"}
