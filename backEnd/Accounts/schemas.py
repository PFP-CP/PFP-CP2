from ninja import ModelSchema, Schema
from .models import Account
from typing import Optional

class AccountSchema(ModelSchema):

    class Meta:
        model = Account
        exclude = ["gender","password"]
    
    Gender : str
    @staticmethod
    def resolve_Gender(obj:Account):
        return "Male" if obj.Gender else "Female"

class AccountSignin(ModelSchema):
    gender :str
    state :str
    class Meta:
        model = Account
        fields = [ "full_name", "email", "password" , "date_of_birth"]

class ResetPassword(Schema):

    email : str
    new_password : Optional[str] = None
    key : Optional[str] = None

class AccountLogin(Schema):

    password : str
    Identifier : str

class EmailConfirmation(Schema):

    email : str
    key: Optional[str] = None