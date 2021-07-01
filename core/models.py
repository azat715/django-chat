from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Author(User):
    class Meta:
        proxy = True


class Message(models.Model):
    author = models.ForeignKey(
        Author, on_delete=models.CASCADE, related_name="messages"
    )
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
