# students/views.py
from rest_framework import viewsets
from .models import Student
from .serializers import StudentSerializer

from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from datetime import date, timedelta


class StudentViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Fetch all students including centre_name and course_name.
    No authentication required.
    """
    queryset = Student.objects.select_related('centre', 'course').all()
    serializer_class = StudentSerializer


class StudentStatsAPI(APIView):
    def get(self, request):
        today = date.today()
        one_month_ago = today - timedelta(days=30)
        # Count students who joined in the last month
        recent_students_count = Student.objects.filter(created_at__gte=one_month_ago).count()
        data = {
            "students_joined_last_month": recent_students_count
        }
        return Response(data)
