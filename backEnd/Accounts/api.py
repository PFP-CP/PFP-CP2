import json
from pathlib import Path
from ninja import Router
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from ninja_jwt.tokens import RefreshToken
from ninja_jwt.authentication import JWTAuth
from asgiref.sync import sync_to_async
from .models import *
from .schemas import *

tokenizer = PasswordResetTokenGenerator()
router = Router()

def authenticate():

    return True

#function to sign in  a new user with given fields 
@router.post("/Signup")
def Signin(request , Acc:AccountSignin):
    if Account.objects.filter(email__exact = Acc.email).exists():
        return {"Error" : "User Already in Data Base"}
    #switches gender string to boolean
    gen = Acc.gender.lower() == 'male'
    #json file that has all of algerias wilayas that gets parced to get the name from code
    main_dir = Path(__file__).parents[1]
    wilaya_dir = main_dir / "wilayas/wilayas.json"
    with open(wilaya_dir ,"r") as file_json:
        wilayas = json.load(file_json)
    #create newuser with the data given 
    #add email verification
    new_acc = Account.objects.create_user(email=Acc.email , password = Acc.password,is_active = False, gender = gen , full_name = Acc.full_name , date_of_birth = Acc.date_of_birth)
    location.objects.create(Account = NewAcc,County = wilayas[Acc.state])
    new_acc.save()

    refresh = RefreshToken.for_user(new_acc)

    return {
        "message": "Account created successfully",
        "tokens": {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }
    }




#function that logs a user in (missing JWT implementation)
@router.post("/Login")
def Login(request , Acc:AccountLogin):
    User = Account.objects.filter(email__exact = Acc.Identifier ).first()

    if not User:
        return {"Error" : "Account doesnt exist would you please sign in"}
    if not User.check_password(Acc.password):
        return {"Error" : "Account doesnt exist would you please sign in"}
    else :
        # Generate JWT tokens
        refresh = RefreshToken.for_user(User)
    
        return {
            "message": "Welcome back",
            "tokens": {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }
        }


#@sync_to_async
#def get_key(request , ResetKey : str):
    
#function that resets the password of the user through a key
@router.patch("password/reset")
def password_reset(request , Key : ResetKey ):   
    
    split_key = Key.key.split(':')

    if len(split_key) != 2:
        return {"error": "Invalid key format"}

    try:
        uid = urlsafe_base64_decode(split_key[1]).decode()
        user = Account.objects.get(pk=uid)
    except (Account.DoesNotExist, ValueError):
        return {"error": "Invalid key"}

    if not tokenizer.check_token(user, split_key[0]):
        return {"error": "Key is expired or invalid"}

    user.set_password(Key.new_password)
    user.save()

    return {"message": "Password reset successfully"}

#funstion that gets a mailing address and check if a user exists with said address , if yes it sends a Key to reset the password of said user
@router.patch("/password/forget")
def password_forgotten(request , mail : str):
    User = Account.objects.filter(email__exact = mail).first()
    if not User:
        return {"Error" : "Account doesnt exist or email is wrong"}
    else:
        token = tokenizer.make_token(User)
        #hashes the user ID into a base64 encoded string
        uid = urlsafe_base64_encode(force_bytes(User.pk))
        key = f"{token}:{uid}"
        #Message including the Token and hashes UID
        Message = f"Here are your UID and Token that will enable you to reset your pass word.\n please copy and paste the sentence bellow in the corresponding field. \n {key}"
        #sends email to the account that contains our key
        send_mail("test" ,
                  Message ,
                  "nook.app1@gmail.com" ,
                  #if you want to test just put your own email in between the brackets as a string 
                  ["merouaneakli06@gmail.com"])
        return {"Message" : "Account found , email sent"}

#testing method     
@router.get("/display" , auth=JWTAuth() )
def display(request ):
    User = request.user
    return {
        "name" :User.full_name,
        "Mail" : User.email,
        "gender" : User.gender,
    }
