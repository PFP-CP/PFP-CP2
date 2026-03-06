from ninja import NinjaAPI
from ninja_jwt.routers.obtain import obtain_pair_router, sliding_router
from ninja_jwt.routers.verify import verify_router

API = NinjaAPI()

API.add_router("/token", tags=["Auth"], router=obtain_pair_router)
API.add_router("/token", tags=["Auth"], router=verify_router)
API.add_router("/Account/", tags=["Authentication Page"], router="Accounts.api.router")
API.add_router("/Houses/", "Houses.api.router")
API.add_router("/Posts/", "Posts.api.router")
API.add_router("/Reservations/", "Reservations.api.router")
