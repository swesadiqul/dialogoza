from django.urls import path
from chat import views


urlpatterns = [
    path('chat/', views.ChatView.as_view(), name='chat-api'),
]