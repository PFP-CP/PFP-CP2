from ninja import NinjaAPI

API = NinjaAPI()

API.add_router("/Account/" , "Accounts.api.router")
API.add_router("/Houses/" , "Houses.api.router")
API.add_router("/Posts/" , "Posts.api.router")