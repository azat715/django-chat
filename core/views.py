from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login
from core.forms import NewUserForm


def register_request(request):
    if request.method == "POST":
        form = NewUserForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect("core:room")
        else:
            print(form.errors)
    else:
        form = NewUserForm()
    return render(
        request=request, template_name="register.html", context={"form": form}
    )


@login_required
def room(request):
    return render(request, "room.html", {"room_name": "test_room"})
