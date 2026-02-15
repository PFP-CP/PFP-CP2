from django.db import models
from enum import Enum
# Create your models here.


class AllowedPeople(models.TextChoices):
    People_Allowed_To_Rent = {
        "AL" : "All People",
        "FA" : "Families only",
        "NM" : "Doesnt Allow Males only",
        "NC" : "Doesnt Allow Couples",
        "NP" : "No Pets",
    }

class House(models.Model):
    Price = models.IntegerField(default=0)
    RoomNum = models.SmallIntegerField(default=1)
    Surface = models.FloatField()
    Description = models.TextField(max_length=1000)
    created_at = models.DateTimeField()
    Updated_at = models.DateTimeField()
    Types_of_Renters = models.CharField(max_length=2 ,choices=AllowedPeople.People_Allowed_To_Rent ,default="AL")
    #PICTURES
    # LOCATION
    # FEATURES 

class Pictures(models.Model):
    blank_house_image =  https://images.template.net/465793/Blank-House-Clipart-edit-online.png
    house = models.ForeignKey(House,on_delete=models.CASCADE)
    URL = models.URLField(max_length=200,default=blank_house_image,blank=True)
class featues():
    models.ForeignKey(House,on_delete=models.CASCADE)
    featues = models.JSONField(null=True)