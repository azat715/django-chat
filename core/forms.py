from django import forms
from django.contrib.auth.forms import UserCreationForm
from core.models import Author


# Create your forms here.


class NewUserForm(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta:
        model = Author
        fields = ("username", "email", "password1", "password2")

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data["email"]  # добавляю email
        if commit:
            user.save()
        return user
