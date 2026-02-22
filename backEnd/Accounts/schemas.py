from ninja import ModelSchema, Schema
from .models import Account

class AccountSchema(ModelSchema):

    class Meta:
        model = Account
        exclude = ["gender","password"]
    
    Gender : str
    @staticmethod
    def resolve_Gender(obj:Account):
        return "Male" if obj.Gender else "Female"

class AccountSignin(ModelSchema):

    class Meta:
        model = Account
        fields = ["password" , "username" , "first_name" ,"last_name" , "email" , "gender" , "date_of_birth"]

class AccountLogin(Schema):

    password : str
    Identifier : str