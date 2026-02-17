from django.db import models

# Create your models here.

class Account(models.Model):
    Default_profile_picture = "https://i.pinimg.com/1200x/83/bc/8b/83bc8b88cf6bc4b4e04d153a418cde62.jpg"
    Name = models.TextField(max_length=100)
    UName = models.TextField(max_length=100)
    Gender = models.BooleanField()
    Profile_picture = models.URLField(default=Default_profile_picture,blank=True)
    Created_at = models.DateTimeField(auto_now_add=True , blank=True) 
    #we gotta hash the password aka secure it before adding it
    Password = models.TextField()
    Rating = models.FloatField(default=5 , blank=True)

    def __str__(self):
        return self.Name
    
class Contact(models.Model):
    Account = models.OneToOneField(Account,on_delete=models.CASCADE)
    Phone_Number = models.SmallIntegerField(default=0)
    Email = models.EmailField()
    WhatsApp = models.SmallIntegerField(default=0 ,blank = True)
    Facebook = models.URLField(blank=True) 



class location(models.Model):
    Account = models.ForeignKey(Account,on_delete=models.CASCADE)
    #BALADIA
    County = models.TextField(max_length=100)
    #Wilaya
    State = models.TextField(max_length=100)
    #Country
    Country = models.TextField(max_length=100)
    #coords
    Longitude = models.FloatField()
    Latitude = models.FloatField()
  