# students/views.py
from rest_framework import viewsets
from .models import Student
from .serializers import StudentSerializer

class StudentViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Fetch all students including centre_name and course_name.
    No authentication required.
    """
    queryset = Student.objects.select_related('centre', 'course').all()
    serializer_class = StudentSerializer

