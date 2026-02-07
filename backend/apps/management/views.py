from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from datetime import date, timedelta

from .models import Centre, Course
from .serializers import CentreSerializer, CourseSerializer
from .permissions import CentreCoursePermission


class CentreViewSet(viewsets.ModelViewSet):
    queryset = Centre.objects.all().order_by("centre_name")
    serializer_class = CentreSerializer
    permission_classes = [CentreCoursePermission]

    @action(detail=False, methods=["get"])
    def active(self, request):
        serializer = self.get_serializer(
            self.queryset.filter(is_active=True),
            many=True
        )
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
    permission_classes = [CentreCoursePermission]


class CentreStatsAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = date.today()
        one_month = timedelta(days=30)

        return Response({
            "total_centres": Centre.objects.count(),
            "active_centres": Centre.objects.filter(
                validity_end_date__gte=today,
                is_active=True
            ).count(),
            "expiring_soon": Centre.objects.filter(
                validity_end_date__gte=today,
                validity_end_date__lte=today + one_month,
                is_active=True
            ).count(),
            "expired_centres": Centre.objects.filter(
                validity_end_date__lt=today
            ).count(),
        })
