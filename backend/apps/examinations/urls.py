from django.urls import path, include
from rest_framework import routers
from .views import ExamStudentRegViewSet, ExaminationViewSet, ExamStatsAPIView

router = routers.DefaultRouter()
router.register("examinations", ExaminationViewSet, basename='examinations')
router.register("exam-registrations", ExamStudentRegViewSet)



urlpatterns = [
    path('', include(router.urls)),
    path('exam-stats/', ExamStatsAPIView.as_view(), name='exam-stats'),
]


