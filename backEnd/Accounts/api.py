from ninja import Router
from .models import *
from .schemas import *
from django.db.models import Q
from django.contrib.auth.hashers import check_password

router = Router()

@router.post("/Signin")
def Signin(request , Acc:AccountSignin):
    if Account.objects.filter(email__exact = Acc.email).exists():
        return {"Error" : "User Already in Data Base"}
    NewAcc = Account.objects.create(**Acc.dict())
    NewAcc.save()
    return {"Message" : "success"}

@router.post("/Login")
def Login(request , Acc:AccountLogin):
    User = Account.objects.filter(Q(username__exact = Acc.Identifier ) | Q(email__exact = Acc.Identifier ) ).first()

    if not User :
        return {"Error" : "Account doesnt exist would you please sign in"}
    if not User.check_password(Acc.password):
        return {"Error" : "Account doesnt exist would you please sign in"}
    else :
        return {"Message" : "Account Successfully found , welcome back"}



@router.get("{ID}" ,response=AccountSchema)
def show(request ,ID):
    return Account.objects.get(id=ID)
