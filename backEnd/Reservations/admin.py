from django.contrib import admin

from .models import Reservation


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ("renter", "post", "arrival_date", "departure_date", "created_at")
    list_filter = ("arrival_date",)
    search_fields = ("renter__full_name", "renter__email", "post__title")
    ordering = ("-created_at",)
