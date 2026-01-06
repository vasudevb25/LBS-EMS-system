from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import date, timedelta
from .models import Student
from .serializers import StudentSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated, SAFE_METHODS
from apps.students.permissions import StudentPermission 


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.select_related("centre", "course").all().order_by("-created_at")
    serializer_class = StudentSerializer
    parser_classes = (MultiPartParser, FormParser)  # <-- important
    permission_classes = [StudentPermission]


class StudentStatsAPI(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        today = date.today()
        one_month_ago = today - timedelta(days=30)

        # Count students created in the last 30 days
        recent_students_count = Student.objects.filter(created_at__gte=one_month_ago).count()

        data = {
            "students_joined_last_month": recent_students_count
        }
        return Response(data)
