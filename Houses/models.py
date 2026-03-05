
from django.db import models 
from django.db.models import F 
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError 
import uuid
# CHOICES

class TypeOfPeople(models.TextChoices):
    """enum for different types of people."""
    FAMILY = 'familly', 'Family'   
    SINGLE = 'single',  'Single'
    COUPLE = 'couple',  'Couple'
    All = 'AL', 'All People'
    No_males = 'NM', 'Doesnt Allow Males only'
    No_couples= 'NC', 'Doesnt Allow Couples'
    No_pets = 'NP', 'No Pets'


class HouseStatus(models.TextChoices):
    AVAILABLE         = 'available',         'Available'
    RENTED            = 'rented',            'Rented'
    UNDER_MAINTENANCE = 'under_maintenance', 'Under Maintenance'
    UNAVAILABLE       = 'unavailable',       'Unavailable'

# HOUSE ->  SQL table: "House"
class House(models.Model):
    """Represents a house listing. SQL columns: id (UUID), price, surface, num_room, type_of_people, description, created_at, updated_at. 
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # ── SQL schema fields ──────────────────────────────────────────────────── 
    price          = models.DecimalField(
                         max_digits=12, decimal_places=2,
                         validators=[MinValueValidator(0)],
                         db_index=True)
    surface        = models.DecimalField(
                         max_digits=8, decimal_places=2,
                         validators=[MinValueValidator(1)])
    num_room       = models.SmallIntegerField(
                         validators=[MinValueValidator(1), MaxValueValidator(200)])
    type_of_people = models.CharField(
                         max_length=10,
                         choices=TypeOfPeople.choices,
                         blank=True, null=True,
                         help_text="Leave blank to allow all guest types.")
    description    = models.TextField(blank=True)
    created_at     = models.DateTimeField(auto_now_add=True)
    updated_at     = models.DateTimeField(auto_now=True)

    status       = models.CharField(
                       max_length=20,
                       choices=HouseStatus.choices,
                       default=HouseStatus.AVAILABLE)
    # extra fields num_bedroom, num_bathroom, floor, total_floors, status, views_count, favorites_count are added for more detailed information about the house and for tracking user interactions (views and favorites).
    num_bedroom  = models.SmallIntegerField(default=1,
                                             validators=[MinValueValidator(0), MaxValueValidator(50)])
    num_bathroom = models.SmallIntegerField(
                       default=1,
                       validators=[MinValueValidator(0), MaxValueValidator(20)])
    floor        = models.SmallIntegerField(
                       blank=True, null=True,
                       validators=[MinValueValidator(-5), MaxValueValidator(200)])
    total_floors = models.SmallIntegerField(
                       blank=True, null=True,
                       validators=[MinValueValidator(1), MaxValueValidator(200)])
    views_count     = models.PositiveIntegerField(default=0)
    favorites_count = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'House'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['price', 'surface']),
            models.Index(fields=['status', 'created_at']),
        ]

    def __str__(self):
        return f"House {self.id} _ {self.surface} m²"

    def clean(self):
        if self.num_bedroom is not None and self.num_bedroom > self.num_room:
            raise ValidationError("Number of bedrooms cannot exceed total rooms.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    #  Race-condition-safe counters 
    def increment_views(self):
        House.objects.filter(pk=self.pk).update(views_count=F('views_count') + 1)
        self.refresh_from_db(fields=['views_count'])

    def increment_favorites(self):
        House.objects.filter(pk=self.pk).update(
            favorites_count=F('favorites_count') + 1)
        self.refresh_from_db(fields=['favorites_count'])

    def decrement_favorites(self):
        House.objects.filter(pk=self.pk).update(
            favorites_count=F('favorites_count') - 1)
        self.refresh_from_db(fields=['favorites_count'])
# HOUSE LOCATION   ->  SQL table: "House_location"
class HouseLocation(models.Model):
    """
    SQL PK is address (TEXT). We use a UUID PK for stability and keep
    address as a unique field (addresses can be corrected; UUIDs never change).
    """
    id        = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    address   = models.TextField(unique=True)
    city      = models.CharField(max_length=255, db_index=True)
    country   = models.CharField(max_length=255, db_index=True)
    latitude  = models.DecimalField(
                    max_digits=9, decimal_places=6,
                    validators=[MinValueValidator(-90), MaxValueValidator(90)])
    longitude = models.DecimalField(                         # SQL: "magnitude"
                    max_digits=9, decimal_places=6,
                    validators=[MinValueValidator(-180), MaxValueValidator(180)])
    house     = models.OneToOneField(
                    House,
                    on_delete=models.CASCADE,
                    related_name='location')

    class Meta:
        db_table = 'House_location'
        indexes = [
            models.Index(fields=['city', 'country']),
            models.Index(fields=['latitude', 'longitude']),
        ]

    def __str__(self):
        return f"{self.address}, {self.city}, {self.country}"


# HOUSE AVAILABILITY   →  SQL table: "house_availability"
#this class for check if the houe is available in the date that the user want to book it and also for the price modifier if there is any special price for a specific date range (e.g. holidays, weekends, etc.)
class HouseAvailability(models.Model):
  
    id           = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    start_date   = models.DateField(db_index=True)
    end_date     = models.DateField(db_index=True)
    is_available = models.BooleanField(default=True)
    house        = models.ForeignKey(
                       House,
                       on_delete=models.CASCADE,
                       related_name='availabilities')

    # ── Extra fields minum_stay and maximum_stay are used to specify the minimum and maximum number of nights a guest can book for this availability period. price_modifier is a multiplier applied to the base price of the house for bookings that fall within this availability period (e.g. 1.20 means +20% on the base price).
    minimum_stay   = models.PositiveSmallIntegerField(default=1)
    maximum_stay   = models.PositiveSmallIntegerField(default=365)
    price_modifier = models.DecimalField(
                         max_digits=5, decimal_places=2, default=1.00,
                         help_text="Multiplier on base price (e.g. 1.20 = +20%).")

    class Meta:
        db_table = 'house_availability'
        indexes = [
            models.Index(fields=['house', 'start_date', 'end_date']),
        ]
        constraints = [
            models.CheckConstraint(
                condition=models.Q(end_date__gt=models.F('start_date')),
                name='availability_end_after_start',
            )
        ]

    def __str__(self):
        status = "✅" if self.is_available else "🚫"
        return f"{status} {self.house_id} | {self.start_date} → {self.end_date}"

    def clean(self):
        if self.start_date and self.end_date:
            if self.start_date >= self.end_date:
                raise ValidationError("end_date must be after start_date.")
        if self.minimum_stay and self.maximum_stay:
            if self.minimum_stay > self.maximum_stay:
                raise ValidationError("minimum_stay cannot exceed maximum_stay.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)


#each house has multiple features and each feature can be in multiple houses (M2M) → SQL table: "feature" + "house_features"

class Feature(models.Model):
    """
    SQL columns: id (SERIAL), feature_name.
    Extra: category, icon (useful for front-end display).
    """
    id           = models.AutoField(primary_key=True)
    feature_name = models.CharField(max_length=255, unique=True)   # SQL name kept
    category     = models.CharField(max_length=100, blank=True)
    icon         = models.CharField(max_length=50,  blank=True)

    class Meta:
        db_table = 'feature'
        ordering = ['category', 'feature_name']

    def __str__(self):
        return self.feature_name


class HouseFeature(models.Model):
    """
    SQL note says: 'use the many-to-many features in Django instead of
    the middle table'. We keep an explicit through-table for flexibility
    (e.g. ordering, extra metadata later), but Django's M2M machinery
    can still be used via House.feature_set.
    """
    id      = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    house   = models.ForeignKey(House,   on_delete=models.CASCADE, related_name='features')
    feature = models.ForeignKey(Feature, on_delete=models.CASCADE, related_name='houses')

    class Meta:
        db_table      = 'house_features'
        unique_together = [['house', 'feature']]   # unique_together creates the index automatically

    def __str__(self):
        return f"{self.feature.feature_name} @ {self.house_id}"


# HOUSE IMAGES   →  SQL table: "house_images"
#every house has multiple image (foreinkey ) and there is one primary 
class HouseImage(models.Model):
    """
    SQL columns: id, house_id, image_url, created_at.
    Extra: is_primary, sort_order (needed for gallery ordering).
    """
    id         = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    house      = models.ForeignKey(House, on_delete=models.CASCADE, related_name='images')
    image_url  = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    # extra fields is primary is used to indicate if this image is the main image for the house (e.g. shown in listings, search results, etc.). sort_order is used to specify the order of images in a gallery (lower numbers appear first).
    is_primary = models.BooleanField(default=False)
    sort_order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        db_table = 'house_images'
        ordering = ['-is_primary', 'sort_order', 'created_at']
        indexes  = [models.Index(fields=['house', 'is_primary'])]

    def __str__(self):
        tag = " [primary]" if self.is_primary else ""
        return f"Image{tag} for house {self.house_id}" 
         
    def save(self, *args, **kwargs):
        # Ensure only one primary image per house
        if self.is_primary:
            HouseImage.objects.filter(
                house=self.house, is_primary=True
            ).exclude(pk=self.pk).update(is_primary=False)
        super().save(*args, **kwargs)


# HOUSE RULES   (no SQL table yet — used by Houses/api.py)

class HouseRule(models.Model):
    """
    House rules attached to a listing (e.g. "No smoking", "No parties").
    """
    id            = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    house         = models.ForeignKey(House, on_delete=models.CASCADE, related_name='rules')
    rule          = models.CharField(max_length=500)
    created_at    = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'house_rules'
        ordering = [ 'rule']
        unique_together = [['house', 'rule']]
        indexes  = [models.Index(fields=['house', 'rule'])]

    def __str__(self):
        return f"{self.id}: {self.rule}"