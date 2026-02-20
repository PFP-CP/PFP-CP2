from ninja import Router
from .models import *
from .schemas import AccountSchema
router = Router()


@router.get("{ID}" ,response=AccountSchema)
def show(request ,ID):
    return Account.objects.get(id=ID)
