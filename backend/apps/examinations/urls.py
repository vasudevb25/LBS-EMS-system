from django.urls import path, include
from rest_framework import routers
from .views import ExaminationViewSet, ExamStatsAPIView

router = routers.DefaultRouter()
router.register(r'examinations', ExaminationViewSet, basename='examinations')


urlpatterns = [
    path('', include(router.urls)),
    path('stats/', ExamStatsAPIView.as_view(), name='exam-stats'),
]


