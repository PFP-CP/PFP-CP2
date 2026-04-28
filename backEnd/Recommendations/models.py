from django.db import models

# Create your models here.
class UserProfile(models.Model):
    user = models.OneToOneField(Account, on_delete=models.CASCADE, related_name='preference_profile')
    preferred_wilaya = models.CharField(max_length=100, null=True)
    preferred_house_type = models.CharField(max_length=100, null=True)
    preferred_allowed_people = models.CharField(max_length=100, null=True)
    preferred_features = models.JSONField(default=list)
    preferred_rules = models.JSONField(default=list)
    avg_price = models.FloatField(null=True)
    avg_rooms = models.FloatField(null=True)
    avg_tenants = models.FloatField(null=True)
    price_range = models.JSONField(default=dict)
    last_updated = models.DateTimeField(auto_now=True)