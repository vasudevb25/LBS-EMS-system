from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone

from .models import Examination
from .serializers import ExaminationSerializer
from .permissions import ExaminationPermission


class ExaminationViewSet(viewsets.ModelViewSet):
    queryset = Examination.objects.all().order_by("-created_at")
    serializer_class = ExaminationSerializer
    permission_classes = [ExaminationPermission]


class ExamStatsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = timezone.now()
        start_of_month = today.replace(day=1)

        return Response({
            "scheduled_exams_this_month": Examination.objects.filter(
                created_at__gte=start_of_month
            ).count(),
            "total_regular": Examination.objects.filter(exam_type="Regular").count(),
            "total_supply": Examination.objects.filter(exam_type="Supplementary").count(),
            "total_available": Examination.objects.count(),
        })
