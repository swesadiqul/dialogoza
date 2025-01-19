from django.contrib import admin
from chat.models import *


# Register your models here.
class ChatAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'timestamp')
    search_fields = ('title', 'user__name')
    list_filter = ('timestamp', 'user')

admin.site.register(Chat, ChatAdmin)

# Register ChatContent
class ChatContentAdmin(admin.ModelAdmin):
    list_display = ('chat', 'role', 'timestamp')
    search_fields = ('chat__user__name', 'role', 'content')
    list_filter = ('timestamp', 'role')

admin.site.register(ChatContent, ChatContentAdmin)