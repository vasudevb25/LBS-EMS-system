from django.urls import path, include
from rest_framework import routers
from .views import CentreViewSet, CourseViewSet, CentreStatsAPI

router = routers.DefaultRouter()
router.register(r'centres', CentreViewSet)
router.register(r'courses', CourseViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('centre-stats/', CentreStatsAPI.as_view(), name='centre-stats'),
]
