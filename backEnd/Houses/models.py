from django.db import models
from django.db.models.functions import Extract 
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
    Created_at = models.DateTimeField(auto_now_add=True)
    Updated_at = models.DateTimeField(auto_now=True)
    Types_of_Renters = models.CharField(max_length=2 ,choices=AllowedPeople.People_Allowed_To_Rent ,default="AL")


class Pictures(models.Model):
    blank_house_image =  https://images.template.net/465793/Blank-House-Clipart-edit-online.png
    house = models.ForeignKey(House,on_delete=models.CASCADE)
    URL = models.URLField(max_length=200,default=blank_house_image,blank=True)
    time_stamp = models.DateTimeField(auto_now_add=True)

class FeatureList():
    feature = models.CharField(max_length=75 , unique=True)

    def __str__(self):
        return self.feature

class Features():
    models.ForeignKey(House,on_delete=models.CASCADE)
    featues = models.ManyToManyField(FeatureList , blank=True)

class AvalabilityCalendar(models.Model):
    Start_at = models.DateTimeField(default=House.created_at)
    end_at = models.DateTimeField()
    #make a function that make a array/list of the days from start to end modulo months and mark each day as available or not
    # then save those days into a json to either update or just print
    # also add a function to print the day of said month that are booked

class Location(models.Model):
    house = models.ForeignKey(House,on_delete=models.CASCADE)
    #BALADIA
    County = models.TextField(max_length=100)
    #Wilaya
    State = models.TextField(max_length=100)
    #Country
    Country = models.TextField(max_length=100)
    #coords
    Longitude = models.FloatField()
    Latitude = models.FloatField()
  