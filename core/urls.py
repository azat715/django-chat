from django.urls import path
from django.contrib.auth.views import LoginView, LogoutView

from . import views

app_name = "core"

urlpatterns = [
    path("login/", LoginView.as_view(template_name="login.html"), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("register", views.register_request, name="register"),
    path("", views.room, name="room"),
]
