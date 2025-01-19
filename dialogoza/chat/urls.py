from django.urls import path
from chat.views import *


urlpatterns = [
    path('chat/', ChatWithAI.as_view(), name='chat_create'),
    path('chat-history/', ChatHistoryView.as_view(), name="chat_histoy"),
    path('chat/<str:chat_id>/', ChatWithAIContinue.as_view(), name='chat_continue'),
    path('chat-live-search/', ChatLiveSearchView.as_view(), name='chat_live_search'),
]