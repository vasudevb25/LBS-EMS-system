from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from datetime import date, timedelta
from .models import Centre, Course
from .serializers import CentreSerializer, CourseSerializer
from django.db.models import Count

# ----------------------------
# Centre API
# ----------------------------
class CentreViewSet(viewsets.ModelViewSet):
    queryset = Centre.objects.all().order_by('centre_name')
    serializer_class = CentreSerializer

    # Filter active centres only
    @action(detail=False, methods=['get'])
    def active(self, request):
        active_centres = self.queryset.filter(is_active=True)
        serializer = self.get_serializer(active_centres, many=True)
        return Response(serializer.data)

    # Optionally, override destroy to soft delete (optional)
    def destroy(self, request, pk=None):
        centre = get_object_or_404(Centre, pk=pk)
        centre.is_active = False
        centre.save()
        return Response({"status": "Centre deactivated"}, status=status.HTTP_200_OK)


# ----------------------------
# Course API
# ----------------------------
class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all().order_by('course_name')
    serializer_class = CourseSerializer


# ----------------------------
# Centre Stats API
# ----------------------------
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
            # Uncomment if you have Student model linked to centres
            # "total_students": Student.objects.count()
        }
        return Response(data)
