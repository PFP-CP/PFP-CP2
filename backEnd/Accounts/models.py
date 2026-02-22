from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission


# Create your models here.
#status of a user aka banned and such
class Account_status(models.TextChoices):
    Banned = "BN" , "Account banned"

class Account(AbstractUser):
    Default_profile_picture = "https://i.pinimg.com/1200x/83/bc/8b/83bc8b88cf6bc4b4e04d153a418cde62.jpg"
    
    gender = models.BooleanField(default=True)
    date_of_birth = models.DateField(default='2000-01-01' , null = True , blank = True)
    profile_picture = models.URLField(default=Default_profile_picture, blank=True)
    rating = models.FloatField(default=5, blank=True)
    verified = models.BooleanField(default=False)
    
    def __str__(self):
        return self.username
    
    groups = models.ManyToManyField(
        Group,
        related_name='account_set',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups'
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='account_permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions'
    )

class Contact(models.Model):
    Account = models.OneToOneField(Account,on_delete=models.CASCADE)
    Phone_Number = models.SmallIntegerField(default=0)
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
  