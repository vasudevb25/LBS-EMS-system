from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from examinations.models import Certificate
from .models import Examination
from .serializers import ExaminationSerializer


class ExaminationViewSet(viewsets.ModelViewSet):
    queryset = Examination.objects.all().order_by('-created_at')
    serializer_class = ExaminationSerializer

class ExamStatsAPIView(APIView):
    def get(self, request):
        try:
            scheduled_exams = Examination.objects.count()
            hall_tickets = sum(exam.registered_students.count() for exam in Examination.objects.all())
            
            # Results published = exams which have results uploaded
            results_published = Examination.objects.filter(result__isnull=False).count()
            
            # Certificates generated = sum of all generated certificates
            certificates_generated = Certificate.objects.count()
            
            data = {
                "scheduled_exams": scheduled_exams,
                "hall_tickets": hall_tickets,
                "results_published": results_published,
                "certificates_generated": certificates_generated
            }
            
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
