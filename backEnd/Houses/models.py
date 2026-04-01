import uuid

from django.db import models

# from django.db.models.functions import Extract
# Create your models here.


class AllowedPeople(models.TextChoices):
    All = "AL", "All People"
    Family = "FA", "Families only"
    No_males = "NM", "Doesnt Allow Males only"
    No_couples = "NC", "Doesnt Allow Couples"
    No_pets = "NP", "No Pets"


class House(models.Model):
    Price = models.IntegerField(default=0)
    RoomNum = models.SmallIntegerField(default=1)
    num_bedroom = models.SmallIntegerField(default=1)
    num_bathroom = models.SmallIntegerField(default=1)
    num_beds = models.SmallIntegerField(default=1)
    max_tenants = models.SmallIntegerField(default=1)

    Surface = models.FloatField()
    Description = models.TextField(max_length=1000)
    Created_at = models.DateTimeField(auto_now_add=True)
    Updated_at = models.DateTimeField(auto_now=True)
    Types_of_Renters = models.CharField(
        max_length=2, choices=AllowedPeople.choices, default=AllowedPeople.All
    )

    def __str__(self):
        return f"{str(self.Description)} id={self.id}"

    def Creation_time(self):
        return self.Created_at


class Pictures(models.Model):
    blank_house_image = (
        "https://images.template.net/465793/Blank-House-Clipart-edit-online.png"
    )
    house = models.ForeignKey(House, on_delete=models.CASCADE, related_name="pictures")
    picture = models.ImageField(upload_to="Houses/pictures", default="", blank=True)
    time_stamp = models.DateTimeField(auto_now_add=True)

class FeatureList(models.Model):
    feature = models.CharField(max_length=75, unique=True)

    def __str__(self):
        return self.feature


class Features(models.Model):
    house = models.ForeignKey(
        House, on_delete=models.CASCADE, related_name="features", db_column="house_id"
    )
    features = models.ManyToManyField(FeatureList, blank=True)


class AvalabilityCalendar(models.Model):
    Start_at = models.DateTimeField(default=House.Creation_time)
    end_at = models.DateTimeField()
    # make a function that make a array/list of the days from start to end modulo months and mark each day as available or not
    # then save those days into a json to either update or just print
    # also add a function to print the day of said month that are booked


class Location(models.Model):
    house = models.ForeignKey(House, on_delete=models.CASCADE, related_name="location")
    # BALADIA
    County = models.TextField(max_length=100)
    # Wilaya
    State = models.TextField(max_length=100)
    # Country
    Country = models.TextField(max_length=100)
    # coords
    Longitude = models.FloatField()
    Latitude = models.FloatField()

    def __str__(self):
        return f" {self.house.Description} location"


class houseRules(models.Model):
    house = models.OneToOneField(
        "House", on_delete=models.CASCADE, related_name="rules"
    )
    allows_animals = models.BooleanField(default=False)
    allows_smoking = models.BooleanField(default=False)
    allows_noise = models.BooleanField(default=False)
