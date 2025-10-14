from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('management.urls')),
    path('api/', include('examinations.urls')),
    path('api/', include('students.urls')),
]
