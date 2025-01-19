from django.urls import path
from core.views import *


urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
]
