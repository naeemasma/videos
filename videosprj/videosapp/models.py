from django.contrib.auth.models import AbstractUser
from django.db import models
# Create your models here.


class User(AbstractUser):
    VIDEO_ADMIN = 'VIDEO_ADMIN'
    VIEWER = 'VIEWER'
      
    ROLE_CHOICES = [
        (VIDEO_ADMIN, 'Video_Admin'),
        (VIEWER, 'Viewer'),
    ]
    role =models.CharField(
        max_length=11,
        choices=ROLE_CHOICES,
        default=VIEWER
    )


class Video(models.Model):
    title = models.TextField(blank=True, unique = True)
    desc = models.TextField(blank=True)
    cast = models.TextField(blank=True)
    director = models.TextField(blank=True)
    imag = models.TextField(blank=True)
    release_dt = models.DateField()
    timestamp = models.DateTimeField(auto_now_add=True)
    modified_ts = models.DateTimeField(auto_now=True)
    saved_by = models.ForeignKey("User", on_delete=models.PROTECT, related_name="video_saved")

    MOVIE = 'MOVIE'
    TV = 'TV'
    MEDIA_CHOICES = [
        (MOVIE, 'Movie'),
        (TV, 'TVshow')
    ]
    media_typ = models.CharField(
        max_length=5,
        choices=MEDIA_CHOICES,
        default=MOVIE
    )
    
    UNSPECIFIED = 'UNSPECIFIED'
    ACTION = 'ACTION'
    ANIMATION = 'ANIMATION'
    COMEDY = 'COMEDY'
    DRAMA = 'DRAMA'
    ROMANCE = 'ROMANCE'
    SCIFI = 'SCIFI'

    GENRE_CHOICES = [        
        (UNSPECIFIED, 'UnSpecified'),
        (ACTION, 'Action'),
        (ANIMATION, 'Animation'),
        (COMEDY, 'Comedy'),
        (DRAMA, 'Drama'),
        (ROMANCE, 'Romance'),
        (SCIFI, 'SciFi'),
    ]
    genre = models.CharField(
        max_length=11,
        choices=GENRE_CHOICES,
        default=UNSPECIFIED
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["title"], name='Unique title'),
    ]

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "desc": self.desc,
            "cast": self.cast,
            "director": self.director,
            "imag":self.imag,            
            "media_typ":self.media_typ,
            "genre":self.genre,
            "media_desc":self.get_media_typ_display(),
            "genre_desc":self.get_genre_display(),
            "release_dt": self.release_dt.strftime("%Y-%m-%d"),
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "modified_ts": self.modified_ts.strftime("%b %d %Y, %I:%M %p"),            
            "saved_by": self.saved_by.username
        }
    
class Like(models.Model):
    video = models.ForeignKey("Video", on_delete=models.PROTECT, related_name="like_created_for_video")
    reaction_by = models.ForeignKey("User", on_delete=models.PROTECT, related_name="like_created")
    timestamp = models.DateTimeField(auto_now_add=True)
    modified_ts = models.DateTimeField(auto_now=True)
    like = models.BooleanField(default=False)

    def serialize(self):
        return {
            "id": self.id,
            "video":self.video,
            "reaction_by":self.reaction_by.username,
            "like":self.like,
            "timestamp":self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "modified_ts":self.modified_ts.strftime("%b %d %Y, %I:%M %p")
        }    

class Mylist(models.Model):
    video = models.ForeignKey(Video, on_delete=models.PROTECT)
    viewer = models.ForeignKey(User, on_delete=models.PROTECT)
    timestamp = models.DateTimeField(auto_now_add=True)
    modified_ts = models.DateTimeField(auto_now=True)
    active = models.BooleanField(default=False)
    def serialize(self):
        return {
            "id": self.id,
            "video":self.video,
            "viewer":self.viewer.username,
            "active":self.active,
            "timestamp":self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "modified_ts":self.modified_ts.strftime("%b %d %Y, %I:%M %p")
        }    