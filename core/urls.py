from django.urls import path

from . import views

app_name = "core"

urlpatterns = [
    path("test_room/", views.room, name="room"),
]
