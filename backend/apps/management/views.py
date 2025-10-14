from rest_framework import viewsets,status
from .models import Centre, Course
from .serializers import CentreSerializer, CourseSerializer
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from datetime import date, timedelta




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


class CentreStatsAPI(APIView):
    def get(self, request):
        today = date.today()
        three_months_later = today + timedelta(days=90)

        data = {
            "total_centres": Centre.objects.count(),
            "active_centres": Centre.objects.filter(is_active=True).count(),
            "expiring_soon": Centre.objects.filter(
                validity_end_date__lte=three_months_later,
                validity_end_date__gte=today
            ).count(),
            # "total_students": Student.objects.count() if 'Student' in globals() else 0,
        }

        return Response(data)