from ninja import NinjaAPI
from ninja.security import APIKeyHeader
from ninja_extra import exceptions
from ninja_jwt.routers.obtain import obtain_pair_router, sliding_router
from ninja_jwt.routers.verify import verify_router

API = NinjaAPI()


def api_exception_handler(request, exc):
    headers = {}

    if isinstance(exc.detail, (list, dict)):
        data = exc.detail
    else:
        data = {"detail": exc.detail}

    response = API.create_response(request, data, status=exc.status_code)
    for k, v in headers.items():
        response.setdefault(k, v)

    return response


API.exception_handler(exceptions.APIException)(api_exception_handler)


API.add_router("/token", tags=["Auth"], router=obtain_pair_router)
API.add_router("/token", tags=["Auth"], router=verify_router)
API.add_router("/Account/", tags=["Authentication Page"], router="Accounts.api.router")
API.add_router("/Houses/", "Houses.api.router")
API.add_router("/Posts/", "Posts.api.router")
API.add_router("/Reservations/", "Reservations.api.router")
API.add_router("/Search/", "Posts.api.search_router")
