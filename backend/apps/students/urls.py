# students/urls.py
from django.urls import path, include

from rest_framework import routers
from .views import StudentViewSet, StudentStatsAPI

router = routers.DefaultRouter()
router.register(r'students', StudentViewSet, basename='student')

urlpatterns = [
    path('', include(router.urls)),
    path('std-stats/', StudentStatsAPI.as_view(), name='std-stats'),
]
