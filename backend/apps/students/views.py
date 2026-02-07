from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import date, timedelta
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated

from .models import Student
from .serializers import StudentSerializer
from .permissions import StudentPermission


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.select_related(
        "centre", "course"
    ).all().order_by("-created_at")

    serializer_class = StudentSerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [StudentPermission]


class StudentStatsAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        one_month_ago = date.today() - timedelta(days=30)

        return Response({
            "students_joined_last_month": Student.objects.filter(
                created_at__gte=one_month_ago
            ).count()
        })
