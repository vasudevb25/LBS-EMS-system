from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # All API endpoints will start with /api/
    path('api/', include('management.urls')), 
]