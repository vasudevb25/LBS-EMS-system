from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.db.models import Q

from .models import Notification
from .serializers import NotificationSerializer
from management.models import Centre


class NotificationCreateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request):
        recipient = request.data.get("recipient")
        subject = request.data.get("subject")
        message = request.data.get("message")
        target_centre_id = request.data.get("target_centre")

        if not subject or not message:
            return Response(
                {"error": "Subject and message are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if recipient == "all_centres":
            Notification.objects.create(
                recipient="all_centres",
                subject=subject,
                message=message,
                sent_by=request.user,
            )
            return Response({"status": "Sent to all centres"}, status=201)

        if recipient == "centre_specific":
            try:
                centre = Centre.objects.get(pk=int(target_centre_id))
            except Exception:
                return Response(
                    {"error": "Invalid centre"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            Notification.objects.create(
                recipient="centre_specific",
                subject=subject,
                message=message,
                target_centre=centre,
                sent_by=request.user,
            )
            return Response(
                {"status": f"Sent to {centre.centre_name}"},
                status=201,
            )

        return Response(
            {"error": "Invalid recipient"},
            status=status.HTTP_400_BAD_REQUEST,
        )


class NotificationListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationSerializer

    def get_queryset(self):
        centre_id = self.request.query_params.get("centre_id")

        if centre_id:
            return Notification.objects.filter(
                Q(recipient="all_centres") | Q(target_centre_id=centre_id)
            ).order_by("-sent_date")

        return Notification.objects.filter(
            recipient="all_centres"
        ).order_by("-sent_date")


class NotificationDeleteAllView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def delete(self, request):
        count, _ = Notification.objects.all().delete()
        return Response(
            {"status": f"{count} notifications deleted"},
            status=status.HTTP_200_OK,
        )
