from django.db import models

from Accounts.models import Account
from Posts.models import Post


class Reservation(models.Model):
    id = models.AutoField(primary_key=True)

    renter = models.ForeignKey(
        Account,
        on_delete=models.CASCADE,
        related_name="reservations",
    )
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name="reservations",
    )
    arrival_date = models.DateField()
    departure_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        unique_together = [("renter", "post", "arrival_date")]

    def __str__(self):
        return (
            f"{self.renter} → {self.post} [{self.arrival_date} / {self.departure_date}]"
        )
