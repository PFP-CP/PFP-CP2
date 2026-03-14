
from django.db import models
from Accounts.models import Account
from Houses.models import House
# Create your models here.


class Post(models.Model):
    Poster = models.ForeignKey(Account,on_delete=models.CASCADE)
    House = models.ForeignKey(House,on_delete=models.CASCADE)
    Created_at = models.DateTimeField(auto_now_add=True)
    Updated_at = models.DateTimeField(auto_now=True)
    Title = models.TextField(max_length=100)
    Description = models.TextField(max_length=1000)
    Rating = models.FloatField(default=5)

    def __str__(self):
        return self.__str__()

class Comment(models.Model):
    commenter = models.ForeignKey(Account,on_delete=models.CASCADE)
    post = models.ForeignKey(Post,on_delete=models.CASCADE)
    Body = models.TextField(max_length=1000 , blank=True)
    Rating = models.SmallIntegerField(default=5)
    Created_at = models.DateTimeField(auto_now_add=True)
    Updated_at = models.DateTimeField(auto_now=True)