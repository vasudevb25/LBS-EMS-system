from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, SAFE_METHODS

from apps.examinations.permissions import ExaminationPermission
from .models import Examination
from .serializers import ExaminationSerializer
from django.utils import timezone

class ExaminationViewSet(viewsets.ModelViewSet):
    queryset = Examination.objects.all().order_by('-created_at')
    serializer_class = ExaminationSerializer
    permission_classes = [ExaminationPermission]

class ExamStatsAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            today = timezone.now()
            start_of_month = today.replace(day=1)

            scheduled_exams = Examination.objects.filter(
                created_at__gte=start_of_month
            ).count()

            total_regular = Examination.objects.filter(exam_type='Regular').count()
            total_supply = Examination.objects.filter(exam_type='Supplementary').count()
            total_available = Examination.objects.count()

            data = {
                "scheduled_exams_this_month": scheduled_exams,
                "total_regular": total_regular,
                "total_supply": total_supply,
                "total_available": total_available
            }

            return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
