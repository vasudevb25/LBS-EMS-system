# examinations/views.py
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Examination
from .serializers import ExaminationSerializer
from django.utils import timezone
from django.db.models import Count, Q

class ExaminationViewSet(viewsets.ModelViewSet):
    queryset = Examination.objects.all().order_by('-created_at')
    serializer_class = ExaminationSerializer


class ExamStatsAPIView(APIView):
    """
    API to return examination statistics:
    - Scheduled exams this month
    - Number of Regular exams
    - Number of Supply exams
    - Total available exams
    """
    def get(self, request):
        try:
            today = timezone.now()
            start_of_month = today.replace(day=1)

            # Total exams scheduled this month
            scheduled_exams = Examination.objects.filter(
                created_at__gte=start_of_month
            ).count()

            # Count exams by type
            total_regular = Examination.objects.filter(exam_type='Regular').count()
            total_supply = Examination.objects.filter(exam_type='Supply').count()

            # Total available exams (all exams that are active/available)
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
