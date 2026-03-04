from ninja import Router
from .models import *
from .schemas import *
from django.db.models import Q
from django.contrib.auth.hashers import check_password ,make_password 
from django.contrib.auth.tokens import PasswordResetTokenGenerator
import json
from pathlib import Path
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from asgiref.sync import sync_to_async

tokenizer = PasswordResetTokenGenerator()
router = Router()

#function to sign in  a new user with given fields 
@router.post("/Signup")
def Signin(request , Acc:AccountSignin):
    if Account.objects.filter(email__exact = Acc.email).exists():
        return {"Error" : "User Already in Data Base"}
    
    if Acc.gender == 'male':
        gen = True
    else:
        gen = False
    
    main_dir = Path(__file__).parents[1]
    wilaya_dir = main_dir / "wilayas/wilayas.json"
    with open(wilaya_dir ,"r") as file_json:
        wilayas = json.load(file_json)

    NewAcc = Account.objects.create_user(email=Acc.email , password = Acc.password,is_active = False, gender = gen , full_name = Acc.full_name , date_of_birth = Acc.date_of_birth)
    location.objects.create(Account = NewAcc,County = wilayas[Acc.state])
    NewAcc.save()
    return {"Message" : "success ,  account has been signed in"}

#function that logs a user in (missing JWT implementation)
@router.post("/Login")
def Login(request , Acc:AccountLogin):
    User = Account.objects.filter(Q(username__exact = Acc.Identifier ) | Q(email__exact = Acc.Identifier ) ).first()

    if User.DoesNotExist :
        return {"Error" : "Account doesnt exist would you please sign in"}
    if not User.check_password(Acc.password):
        return {"Error" : "Account doesnt exist would you please sign in"}
    else :
        return {"Message" : "Account Successfully found , welcome back"}


#@sync_to_async
#def get_key(request , ResetKey : str):
    
#function that resets the password of the user through a key
@router.patch("password/reset")
def password_reset(request , Key : ResetKey ):   
    splitKey = Key.key.split(':')
    id = urlsafe_base64_decode(splitKey[1]).decode()
    User = Account.objects.get(pk = id)
    if not User:
        return {"Error ": "Wrong Key"}
    if not tokenizer.check_token(User, splitKey[0]):
        return {"Error " : "expired token "}
    User.set_password(Key.new_password)
    User.save()
    return {"Success" : "password has been reset"}

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
    

'''
@router.get("{ID}" ,response=AccountSchema)
def show(request ,ID):
    return Account.objects.get(id=ID)
'''

