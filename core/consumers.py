import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.core.checks import messages
from datetime import datetime
from core.models import Message


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = "test_room"
        self.room_group_name = "chat_%s" % self.room_name

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )

    def receive(self, text_data):
        username = self.scope["user"].username
        text_data_json = json.loads(text_data)
        if text_data_json.get("message"):
            message = text_data_json["message"]
            message = (
                username
                + " "
                + datetime.now().strftime("%Y-%m-%d %H:%M")
                + ":\n"
                + message
            )

            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name, {"type": "chat_message", "message": message}
            )
            Message.objects.create(
                text=text_data_json["message"], author=self.scope["user"]
            )
        elif text_data_json.get("command"):
            command = text_data_json["command"]
            if command == "old_messages":
                messages = []
                for i in Message.objects.all():
                    messages.append(str(i.author.username + ":\n" + i.text))

                async_to_sync(self.channel_layer.group_send)(
                    self.room_group_name, {"type": "old_messages", "message": messages}
                )

    def chat_message(self, event):
        message = event["message"]

        # Send message to WebSocket
        self.send(text_data=json.dumps({"message": message}))

    def old_messages(self, event):
        message = event["message"]
        self.send(text_data=json.dumps({"message": message}))
