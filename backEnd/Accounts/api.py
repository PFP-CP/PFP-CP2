import json
import secrets
import string as STRING
import time
from pathlib import Path

from asgiref.sync import sync_to_async
from django.contrib.auth.hashers import check_password, make_password
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.cache import cache
from django.core.mail import send_mail
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from ninja import Router
from ninja.errors import HttpError
from ninja_jwt.authentication import JWTAuth
from ninja_jwt.tokens import RefreshToken

from .models import *
from .schemas import *

tokenizer = PasswordResetTokenGenerator()
router = Router()


# function to sign in  a new user with given fields
@router.post("/Signup")
def Signin(request, Acc: AccountSignin):
    if Account.objects.filter(email__exact=Acc.email).exists():
        return {"Error": "User Already in Data Base"}
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


# testing method
@router.get("/display", auth=JWTAuth())
def display(request):
    User = request.user
    return {
        "name": User.full_name,
        "Mail": User.email,
        "gender": User.gender,
    }


@router.patch("/{User_id}", auth=JWTAuth())
def change_name(request, name: str):
    User = request.user
    User.set_name(name)
    User.save()
