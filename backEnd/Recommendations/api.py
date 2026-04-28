from ninja import Router
from ninja_jwt.authentication import JWTAuth
import time
from Accounts.models import Account
from Houses.models import *
from Posts.models import SavedPost , Post
from Reservations.models import Reservation
from .schemas import PostListOut

router = Router()



def profile_create( saved_posts):

    
    if not saved_posts:
        return None
    profile = {
        'wilaya': {},
        'house_type': {},
        'features': {},
        'rules': {},
        'allowed_people': {},
        'prices': [],
        'rooms': [],
        'tenants': [],
    }


    for saved in saved_posts:
            house = saved.post.house
            weight = saved.post.rating if saved.post.rating else 1
            house_type = saved.post.title.split(" ",1)[0]
            # location
            profile['wilaya'][house.location.County] = profile['wilaya'].get(house.location.County, 0) + weight

            # house type
            profile['house_type'][house_type] = profile['house_type'].get(house_type, 0) + weight

            # allowed people type
            if house.Types_of_Renters:
                profile['allowed_people'][house.Types_of_Renters] = profile['allowed_people'].get(house.Types_of_Renters, 0) + weight

            # rules
            rules_obj = getattr(house, 'rules', None)

            if rules_obj:
                # Since houseRules has specific boolean fields, you handle them individually
                if rules_obj.allows_animals:
                    profile['rules']['allows_animals'] = profile['rules'].get('allows_animals', 0) + weight
                if rules_obj.allows_smoking:
                    profile['rules']['allows_smoking'] = profile['rules'].get('allows_smoking', 0) + weight
                if rules_obj.allows_noise:
                    profile['rules']['allows_noise'] = profile['rules'].get('allows_noise', 0) + weight

            # features
            for feature_set in house.features.all():
                for f_item in feature_set.features.all():
                    profile['features'][f_item.feature] = profile['features'].get(f_item.feature, 0) + weight

            # numerical averages
            profile['prices'].append(house.Price * weight)
            profile['rooms'].append(house.RoomNum * weight)
            if house.max_tenants:
                profile['tenants'].append(house.max_tenants * weight)

    total_weight = sum(saved.post.rating if saved.post.rating else 1 for saved in saved_posts)

    top_wilayas = list(dict(sorted(profile['wilaya'].items(), key=lambda x: x[1], reverse=True)[:3]).keys())
    
    return {
            'preferred_wilaya':       top_wilayas if profile['wilaya'] else None,
            'preferred_type':         max(profile['house_type'], key=profile['house_type'].get) if profile['house_type'] else None,
            'preferred_allowed':      max(profile['allowed_people'], key=profile['allowed_people'].get) if profile['allowed_people'] else None,
            'preferred_features':     sorted(profile['features'], key=profile['features'].get, reverse=True)[:5],
            'preferred_rules':        sorted(profile['rules'], key=profile['rules'].get, reverse=True)[:5],
            'avg_price':              sum(profile['prices']) / total_weight if profile['prices'] else None,
            'avg_rooms':              sum(profile['rooms']) / total_weight if profile['rooms'] else None,
            'avg_tenants':            sum(profile['tenants']) / total_weight if profile['tenants'] else None,
        }


def score_post(post, profile):
    score = 0
    house = post.house
    house_type = post.title.split(" ",1)[0]
    pref_wilayas = profile.get('preferred_wilaya', [])
    location = getattr(house, 'location', None)
    
    if not location:
        return 0
    if pref_wilayas:
        # Check top 3 preferred counties
        for index, county_name in enumerate(pref_wilayas[:3]):
            if house.location.County == county_name:
                score += (3 - index)
                break  # Stop if we found the match

    if profile['preferred_type'] and house_type == profile['preferred_type']:
        score += 2

    if profile['avg_price']:
        price_diff = abs(house.Price - profile['avg_price'])
        # closer to preferred price = higher score
        if price_diff < 5000:
            score += 3
        elif price_diff < 15000:
            score += 1

    if profile['avg_rooms']:
        room_diff = abs(house.RoomNum - profile['avg_rooms'])
        if room_diff == 0:
            score += 2
        elif room_diff == 1:
            score += 1

    house_features = [f.features for f in house.features.all()]
    for feature in profile['preferred_features']:
        if feature in house_features:
            score += 1

    return score

@router.get("/recommended", auth=JWTAuth() ,response=list[PostListOut])
def get_recommendations(request):
    user = request.user
    saved= SavedPost.objects.filter(
        user_id = user.id
    ).select_related('post__house','post__house__location')
    profile = profile_create(saved) 
    # if user has no history, return newest posts as fallback
    if not saved:
        qs = Post.objects.filter(status = "active").order_by('-created_at')[:20]
        return qs
       
    # exclude posts the user already saved
    saved_post_ids = saved.values_list('post_id', flat=True)
    candidates = Post.objects.exclude(
        id__in=saved_post_ids
    ).select_related(
        'house__location', 
        'house__rules'
    ).prefetch_related(
        'house__features__features'
    )

    # score and sort
    scored = sorted(candidates, key=lambda post: score_post(post, profile), reverse=True)

    return scored[:20]