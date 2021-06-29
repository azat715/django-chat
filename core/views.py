from django.shortcuts import render


def room(request):
    return render(request, "room.html", {"room_name": "test_room"})
