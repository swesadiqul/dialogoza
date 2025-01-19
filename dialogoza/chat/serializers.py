from rest_framework import serializers
from chat.models import *
from django.conf import settings



class ChatContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatContent
        fields = ['id', 'role', 'content', 'timestamp']


class ChatSerializer(serializers.ModelSerializer):
    content = ChatContentSerializer(many=True, read_only=True)

    class Meta:
        model = Chat
        fields = ['id', 'title', 'user', 'timestamp', 'content']


class ChatRequestSerializer(serializers.Serializer):
    content = serializers.CharField(required=True)