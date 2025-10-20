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
        centre.delete()  # permanently remove from DB
        return Response(
            {"status": "Centre deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )

# ----------------------------
# Course API
# ----------------------------
class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all().order_by('course_name')
    serializer_class = CourseSerializer

    # Create new course
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Course added successfully", "data": serializer.data},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Edit course
    def update(self, request, pk=None, *args, **kwargs):
        course = get_object_or_404(Course, pk=pk)
        serializer = self.get_serializer(course, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Course updated successfully", "data": serializer.data},
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Delete course
    def destroy(self, request, pk=None, *args, **kwargs):
        course = get_object_or_404(Course, pk=pk)
        course.delete()
        return Response(
            {"message": "Course deleted successfully"},
            status=status.HTTP_204_NO_CONTENT,
        )


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
