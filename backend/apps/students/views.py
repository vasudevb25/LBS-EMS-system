from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import date, timedelta
from .models import Student
from .serializers import StudentSerializer


class StudentViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = StudentSerializer

    def get_queryset(self):
        queryset = Student.objects.select_related('centre_id', 'course_id').all()

        centre_id = self.request.query_params.get('centre_id')
        course_id = self.request.query_params.get('course_id')

        if centre_id:
            queryset = queryset.filter(centre_id=centre_id)
        if course_id:
            queryset = queryset.filter(course_id=course_id)

        return queryset

class StudentStatsAPI(APIView):
    """
    Returns statistics about students, such as those who joined in the last month.
    """
    def get(self, request):
        today = date.today()
        one_month_ago = today - timedelta(days=30)

        # Count students created in the last 30 days
        recent_students_count = Student.objects.filter(created_at__gte=one_month_ago).count()

        data = {
            "students_joined_last_month": recent_students_count
        }
        return Response(data)
