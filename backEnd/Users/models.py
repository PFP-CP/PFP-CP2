from django.db import models
from Posts.models import Post
# Create your models here.

class User(models.Model):
    Name = models.TextField(max_length=100)
    UName = models.TextField(max_length=100)
    Gender = models.BooleanField()
    Profile_picture = models.URLField()
    Created_at = models.DateTimeField(auto_now_add=True) 
    #we gotta hash the password aka secure it before adding it
    Password = models.TextField()
    Rating = models.FloatField(default=5)

    def __str__(self):
        return self.__str__()
class Contact(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    Phone_Number = models.SmallIntegerField(default=0)
    Email = models.EmailField()
    WhatsApp = models.SmallIntegerField(default=0 ,blank = True)
    Facebook = models.URLField(blank=True) 

class Comment(models.Model):
    commenter = models.ForeignKey(User,on_delete=models.CASCADE)
    post = models.ForeignKey(Post,on_delete=models.CASCADE)
    Body = models.TextField(max_length=1000 , blank=True)
    Rating = models.SmallIntegerField(default=5)
    Created_at = models.DateTimeField(auto_now_add=True)
    Updated_at = models.DateTimeField(auto_now=True)

class location(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    #BALADIA
    County = models.TextField(max_length=100)
    #Wilaya
    State = models.TextField(max_length=100)
    #Country
    Country = models.TextField(max_length=100)
    #coords
    Longitude = models.FloatField()
    Latitude = models.FloatField()
  