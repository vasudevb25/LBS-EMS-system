from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from .permissions import  CentrePermission, CoursePermission 
from django.shortcuts import get_object_or_404
from datetime import date, timedelta
from .models import Centre, Course
from .serializers import CentreSerializer, CourseSerializer

class CentreViewSet(viewsets.ModelViewSet):
    queryset = Centre.objects.all().order_by("centre_name")
    serializer_class = CentreSerializer
    permission_classes = [CentrePermission]

    @action(detail=False, methods=["get"])
    def active(self, request):
        active_centres = self.queryset.filter(is_active=True)
        serializer = self.get_serializer(active_centres, many=True)
        return Response(serializer.data)

    def destroy(self, request, pk=None):
        centre = get_object_or_404(Centre, pk=pk)
        centre.delete()
        return Response(
            {"status": "Centre deleted successfully"},
            status=status.HTTP_204_NO_CONTENT,
        )


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [CoursePermission]


class CentreStatsAPI(APIView):
    permission_classes = [IsAuthenticated]
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
