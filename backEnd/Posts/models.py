from django.db import models
# Create your models here.

class Post(models.Model):
    Poster = models.ForeignKey("Users.User",on_delete=models.CASCADE)
    House = models.ForeignKey("Houses.House",on_delete=models.CASCADE)
    Created_at = models.DateTimeField(auto_now_add=True)
    Updated_at = models.DateTimeField(auto_now=True)
    Title = models.TextField(max_length=100)
    #i dont remember what status is 
    Description = models.TextField(max_length=1000)
     