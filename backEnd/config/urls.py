
from django.contrib import admin
from django.urls import path

from .api import API

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", API.urls),
]
