from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.permissions import AllowAny
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework.authtoken.views import obtain_auth_token




# swagger ui
schema_view = get_schema_view(
    openapi.Info(
        title='Dialogoza API',
        default_version='v1',
        description='API for Dialogoza',
        terms_of_service='https://www.google.com/policies/terms/',
        contact=openapi.Contact(name='API Support', url='https://example.com/support', email='mdsadiqulislam446@gmail.com'),
        license=openapi.License(name='BSD License', url='https://opensource.org/licenses/BSD-3-Clause'),
    ),
    public=True,
    permission_classes=[AllowAny],
)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include('core.urls')),
    path('api/v1/', include('chat.urls')),
    path('api-auth/', include('rest_framework.urls')),
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)