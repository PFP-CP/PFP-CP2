import json
import hashlib
from pathlib import Path
from django.core.cache import cache
from ninja import Router
from Accounts.models import Account
from Houses.models import *
from .models import *
from django.db.models import QuerySet
from .schemas import *
from ninja.pagination import PageNumberPagination , paginate
router = Router()
search_router = Router()

def post_rating_query(previous_search: QuerySet ,rating :float | None = None ) -> QuerySet :
    if rating is not None :
        previous_search = previous_search.filter(Rating__gte=rating)
    return previous_search

def renter_rating_query(previous_search: QuerySet ,rating :float | None = None ) -> QuerySet :
    if rating is not None :
        previous_search = previous_search.filter(Poster__rating__gte=rating)
    return previous_search 

def price_query(previous_search: QuerySet ,min_price :int | None = None , max_price : int| None =None) -> QuerySet :
    if min_price is not None: 
        previous_search = previous_search.filter(House__Price__gte=min_price)
    if max_price is not None: 
        previous_search = previous_search.filter(House__Price__lte=max_price)
    return previous_search

def rooms_query(previous_search: QuerySet, number_of_rooms: int | None = None) -> QuerySet:
    #needs work still isnt finished to the standard im striving for
    if number_of_rooms is not None:
        previous_search = previous_search.filter(House__RoomNum=number_of_rooms)
    return previous_search

def wilaya_query(previous_search: QuerySet, wilaya: str | None = None) -> QuerySet:
    if wilaya is not None:

        main_dir = Path(__file__).parents[1]
        wilaya_dir = main_dir / "wilayas/wilayas.json"
        with open(wilaya_dir ,"r") as file_json:
            wilayas = json.load(file_json)
        
        previous_search = previous_search.filter(House__location__State=wilayas[wilaya])
    return previous_search

def allowed_people_query(previous_search: QuerySet, allowed_people: list[str] = []) -> QuerySet:
    if not allowed_people:
        return previous_search
    return previous_search.filter(House__Types_of_Renters__in=allowed_people)

def features_query(previous_search: QuerySet, features: list[str] = []) -> QuerySet:
    for feature in features:
        previous_search = previous_search.filter(House__features__Available_features__feature=feature)
    return previous_search

def sorting(post_results: list[SearchResult] , ordering_by ):
    SORT_OPTIONS = {
        "newest": lambda x: x["creation_time"],
        "oldest": lambda x: x["creation_time"],
        "price_asc":  lambda x: x["price"],
        "price_desc": lambda x: x["price"],
        "rating_asc": lambda x: x["rating"],
        "rating_desc":lambda x: x["rating"],
        }
    
    SORT_REVERSE = {
        "newest":      True,
        "oldest":      False,
        "price_asc":   False,
        "price_desc":  True,
        "rating_asc":  False,
        "rating_desc": True,
        }
    if ordering_by in SORT_OPTIONS:
        post_results = sorted(
        post_results,
        key=SORT_OPTIONS[ordering_by],
        reverse=SORT_REVERSE[ordering_by],
        )
    return post_results

@search_router.post("" , response=list[SearchResult])
@paginate(PageNumberPagination , page_size = 5)
def search(request , Criteria : SearchCriteria ):

        
    Criteria_dict = Criteria.dict(exclude={"order_by"})
    cache_key = "search:" + hashlib.md5(
        json.dumps(Criteria_dict, sort_keys=True).encode()
    ).hexdigest()

    results = cache.get(cache_key)

    if results is None:
    
        results_query = Post.objects.select_related(
            "House__location", 
            "Poster__contact",
            "Poster",                
        ).prefetch_related(
            "House__features__Available_features",       
        )

        results_query = post_rating_query(results_query , Criteria.post_rating)
        results_query = renter_rating_query(results_query, Criteria.renter_rating)
        results_query = price_query(results_query, Criteria.min_price, Criteria.max_price)
        results_query = rooms_query(results_query, Criteria.number_of_rooms)
        results_query = wilaya_query(results_query, Criteria.wilaya)
        results_query = allowed_people_query(results_query, Criteria.allowed_people)
        results_query = features_query(results_query, Criteria.features)

        results = [SearchResult.from_orm(post).dict() for post in results_query]

        cache.set(cache_key, results, timeout=300)

    results = sorting(results,Criteria.order_by)
    return results

