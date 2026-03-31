from django.contrib.auth.models import AbstractUser, BaseUserManager, Group, Permission
from django.db import models


class AccountManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")

        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


# Create your models here.
# status of a user aka banned and such
class Account_status(models.TextChoices):
    Banned = "BN", "Account banned"


class UserType(models.TextChoices):
    GUEST = "GUEST", "Guest"
    RENTER = "RENTER", "Renter"


class Account(AbstractUser):
    class GenderType(models.TextChoices):
      MALE = 'M', 'Male'
      FEMALE = 'F', 'Female'
  
    default_profile_picture = (
        "https://i.pinimg.com/1200x/83/bc/8b/83bc8b88cf6bc4b4e04d153a418cde62.jpg"
    )
    username = None  # Remove username field
    email = models.EmailField(unique=True)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []  # No additional required fields

    objects = AccountManager()

    first_name = None
    last_name = None
    full_name = models.TextField(max_length=150)
    gender = models.CharField(
        max_length=1,
        choices=GenderType.choices,
        default=GenderType.MALE
    )
    date_of_birth = models.DateField(default="2000-01-01", null=True, blank=True)
    profile_picture = models.ImageField(upload_to="Account/PFP", default="", blank=True)
    rating = models.FloatField(default=5, blank=True)
    verified = models.BooleanField(default=False)

    # fields added to match supabase
    num_review = models.IntegerField(default=0, blank=True)
    num_posts = models.IntegerField(default=0, blank=True)
    type_of_user = models.CharField(
        max_length=20,
        choices=UserType.choices,
        default=UserType.GUEST,
    )

    def __str__(self):
        return f"{self.full_name} ,id={self.id}" or self.email

    def set_name(self, new_name: str):
        name = new_name.split(" ")
        self.first_name = name[0]
        self.last_name = name[1]

    groups = models.ManyToManyField(
        Group,
        related_name="account_set",
        blank=True,
        help_text="The groups this user belongs to.",
        verbose_name="groups",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="account_permissions",
        blank=True,
        help_text="Specific permissions for this user.",
        verbose_name="user permissions",
    )


class Contact(models.Model):
    Account = models.OneToOneField(
        Account, on_delete=models.CASCADE, related_name="contact"
    )
    Phone_Number = models.CharField(max_length=20, unique=True)
    WhatsApp = models.SmallIntegerField(default=0, blank=True)
    Facebook = models.URLField(blank=True)


class location(models.Model):
    Account = models.OneToOneField(Account, on_delete=models.CASCADE)
    # BALADIA
    County = models.TextField(max_length=100, blank=True)
    # Wilaya
    State = models.TextField(max_length=100, blank=True)
    # Country
    Country = models.TextField(max_length=100)
    # coords
    Longitude = models.FloatField(default=0, blank=True)
    Latitude = models.FloatField(default=0, blank=True)
