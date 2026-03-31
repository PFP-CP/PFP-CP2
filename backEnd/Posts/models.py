from django.utils import timezone

from django.db import models
from Accounts.models import Account
from django.db.models import F, Avg
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid
from Houses.models import Pictures


class PostStatus(models.TextChoices):
    Available = 'available', 'Available'
    ARCHIVED = 'archived', 'Archived'
    REJECTED = 'rejected', 'Rejected'
    PENDING  = 'pending',  'Pending'
    RENTED   = 'rented',   'Rented'


class Post(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # post.house -> House.id    
    house= models.OneToOneField(
        'Houses.House',
        on_delete=models.CASCADE,
        related_name='post',
        db_column='house_id',
    )
    # post.seller_id -> User.id
    # seller = a User whose type_of_user = 'SELLER'  
    seller = models.ForeignKey(
        'Accounts.Account',
        on_delete=models.CASCADE,
        related_name='posts',
        db_column='seller_id',
    )
    title       = models.CharField(max_length=400)
    status      = models.CharField(
        max_length=10,
        choices=PostStatus.choices,
        default=PostStatus.PENDING,
        db_index=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    #counters for tracking views, saves and comments 
    views_count    = models.PositiveIntegerField(default=0,editable=False)
    saves_count    = models.PositiveIntegerField(default=0,editable=False)
    comments_count = models.PositiveIntegerField(default=0,editable=False)
    Likes = models.IntegerField(default=0,editable=False)
    rating = models.FloatField(default=0.0,editable=False)
     
    @property
    def State(self):
        location=self.house.location.first()
        return location.State if location else None
    @property
    def primary_image(self):
     img = self.house.pictures.first()

     if  not img or not img.picture:
        return Pictures.blank_house_image
     return img.picture.url
    
    def current_tenant(self):
        """Finds the reservation happening right now."""
        today = timezone.localdate()
        res= self.reservations.filter(
            arrival_date__lte=today,
            departure_date__gte=today
        ).select_related('renter', 'renter__contact').first()
        return res.renter if res else None

    
    class Meta:
        db_table = 'post'
        ordering = ['-created_at']
        #we use indexes on status and created_at for fast search for available posts and on seller_id and status 
        #search fast for all posts of a seller with a specific status (e.g. available, archived, etc.)
        indexes  = [
            models.Index(fields=['status', '-created_at']),
            models.Index(fields=['seller', 'status']),  
        ]

    def __str__(self):
        return f"{self.title} [{self.status}]"

    #bellow functions are for changing the status of the post and for incrementing the counters for views, saves and comments
    def publish(self):
        """PENDING → avilable. ."""
        if self.status not in PostStatus.PENDING:
            raise ValidationError(
                f"Cannot publish a post with status '{self.status}'."
            )
        self.status = PostStatus.AVAILABLE
        self.save(update_fields=['status', 'updated_at'])

    def archive(self):
        self.status = PostStatus.ARCHIVED
        self.save(update_fields=['status', 'updated_at'])

    def mark_rented(self):
        """Marks post RENTED and syncs the house status."""
        self.status = PostStatus.RENTED
        self.save(update_fields=['status', 'updated_at'])
        

    def reject(self):
        self.status = PostStatus.REJECTED
        self.save(update_fields=['status', 'updated_at'])

     
    def increment_views(self):
        Post.objects.filter(pk=self.pk).update(views_count=F('views_count') + 1)
        self.refresh_from_db(fields=['views_count'])

    def increment_saves(self):
        Post.objects.filter(pk=self.pk).update(saves_count=F('saves_count') + 1)
        self.refresh_from_db(fields=['saves_count'])

    def decrement_saves(self):
        Post.objects.filter(pk=self.pk).update(saves_count=F('saves_count') - 1)
        self.refresh_from_db(fields=['saves_count'])

    def increment_comments(self):
        Post.objects.filter(pk=self.pk).update(comments_count=F('comments_count') + 1)
        self.refresh_from_db(fields=['comments_count'])


#is used by users to save posts they are interested in for later viewing. A user can save a post only once, but can save multiple different posts.
class SavedPost(models.Model):
    user = models.ForeignKey(
        'Accounts.Account',
        on_delete=models.CASCADE,
        related_name='saved_posts',
        db_column='user_id',
    )
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name='saves',
        db_column='post_id',
    )
    saved_at = models.DateTimeField(auto_now_add=True)
    @property
    def title(self):
        return self.post.title
    @property
    def Price(self):
            return self.post.house.Price
    @property
    def State(self):    
            return self.post.house.location.first().State

    @property
    def primary_image(self):
        img = self.post.house.pictures.first()
        return img.URL if img else None
    class Meta:
        db_table        = 'saved_post'
        unique_together = ['user', 'post']
        ordering        = ['-saved_at']

    def __str__(self):
        return f"{self.user} saved {self.post.house}"


class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    comment = models.TextField(blank=True)
    rating  = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
    )
    created_at  = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    # user may comment on a post only once, but can edit their comment and rating later
    user= models.ForeignKey(
        'Accounts.Account',
        on_delete=models.CASCADE,
        related_name='comments',
        db_column='user_id',
    )
    
    post= models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name='comments',
        db_column='post_id',
    )

    class Meta:
        db_table = 'Comment'
        ordering = ['-created_at']
        indexes  = [
            models.Index(fields=['post', '-created_at']),
            models.Index(fields=['user']),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=['post', 'user'],
                name='one_comment_per_user_per_post',
            )
        ]

    def __str__(self):
        return f"{self.user} -> '{self.post.title}' ({self.rating})"

    def save(self, *args, **kwargs):
        is_new = self._state.adding
        super().save(*args, **kwargs)
        self._update_seller_rating()
        self._update_post_rating()
        if is_new:
            self.post.increment_comments()
            Account.objects.filter(pk=self.user.pk).update(
                num_review=F('num_review') + 1
            )

    def _update_seller_rating(self):
        seller = self.post.seller
        avg = Comment.objects.filter( 
            post__seller=seller
        ).aggregate(avg=Avg('rating'))['avg']
        if avg is not None:
            Account.objects.filter(pk=seller.pk).update(rating=round(avg, 2))

    def _update_post_rating(self):

        avg = Comment.objects.filter(
            post=self.post
        ).aggregate(avg=Avg('rating'))['avg']

        self.post.rating = float(round(avg, 2)) if avg else 0.0
        self.post.save(update_fields=['rating'])