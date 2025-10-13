from rest_framework import viewsets
from .models import Centre, Course
from .serializers import CentreSerializer, CourseSerializer
from rest_framework.decorators import action
from rest_framework.response import Response

class CentreViewSet(viewsets.ModelViewSet):
    # Defines which data set to use
    queryset = Centre.objects.all().filter(is_active=True).order_by('centre_name')
    # Defines which serializer to use for data formatting
    serializer_class = CentreSerializer

    # Example of a custom action (like getting active centers only)
    @action(detail=False, methods=['get'])
    def active(self):
        active_centres = self.queryset.filter(is_active=True)
        serializer = self.get_serializer(active_centres, many=True)
        return Response(serializer.data)


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all().order_by('course_name')
    serializer_class = CourseSerializer
    # You'll implement the upload/syllabus logic here later