from ninja import ModelSchema
from .models import Account

class AccountSchema(ModelSchema):

    class Meta:
        model = Account
        fields = ['id' ,'Name' , 'UName' , 'Created_at' , 'Rating']
    
    Gender : str
    @staticmethod
    def resolve_Gender(obj:Account):
        return "Male" if obj.Gender else "Female"
