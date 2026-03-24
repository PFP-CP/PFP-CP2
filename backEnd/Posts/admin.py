from django.contrib import admin

# Register your models here.
from .models import Post,SavedPost,Comment
from django.contrib import admin

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('id', 'house', 'status', 'created_at','seller')
 
admin.site.register(SavedPost)
admin.site.register(Comment)

