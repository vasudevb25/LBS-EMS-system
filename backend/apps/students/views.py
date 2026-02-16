from datetime import date, timedelta

from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action

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
    lookup_field = "student_id"

    def get_queryset(self):
        user = self.request.user

        if user.is_superuser:
            return self.queryset

        if hasattr(user, "centre") and user.centre:
            return self.queryset.filter(centre=user.centre)

        return Student.objects.none()

    def perform_create(self, serializer):
        user = self.request.user

        if not user.is_superuser:
            serializer.save(
                centre=user.centre,
                status="Pending"
            )
        else:
            serializer.save(status="Approved")

    def perform_update(self, serializer):
        user = self.request.user

        if not user.is_superuser:
            serializer.save(status="Pending")
        else:
            serializer.save()

    @action(detail=True, methods=["post"])
    def approve(self, request, student_id=None):
        if not request.user.is_superuser:
            return Response(
                {"detail": "Only admin can approve."},
                status=status.HTTP_403_FORBIDDEN,
            )

        student = self.get_object()
        student.status = "Approved"
        student.save()

        return Response({"detail": "Student approved."})

    @action(detail=True, methods=["post"])
    def reject(self, request, student_id=None):
        if not request.user.is_superuser:
            return Response(
                {"detail": "Only admin can reject."},
                status=status.HTTP_403_FORBIDDEN,
            )

        student = self.get_object()
        student.status = "Rejected"
        student.save()

        return Response({"detail": "Student rejected."})


# ---------------- STATS API ---------------- #

class StudentStatsAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        one_month_ago = date.today() - timedelta(days=30)

        return Response({
            "students_joined_last_month": Student.objects.filter(
                created_at__gte=one_month_ago
            ).count()
        })
