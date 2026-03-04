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
    gender :str
    state :str
    class Meta:
        model = Account
        fields = [ "full_name", "email", "password" , "date_of_birth"]

class ResetKey(Schema):

    new_password : str
    #Token : UID string 
    key : str

class AccountLogin(Schema):

    password : str
    Identifier : str