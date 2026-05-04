
from django.contrib import admin
from django.urls import path , include
from django.conf import settings

from .api import API

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", API.urls),
    path('silk/', include('silk.urls', namespace='silk')),
]
