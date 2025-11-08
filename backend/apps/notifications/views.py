from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from .models import Notification
from .serializers import NotificationSerializer
from management.models import Centre
from users.models import User  


class NotificationCreateView(APIView):
    """
    Admin: send notifications to either all centres or one specific centre.
    """
    def post(self, request):
        recipient = request.data.get("recipient")
        subject = request.data.get("subject")
        message = request.data.get("message")
        target_centre_id = request.data.get("target_centre")

        if not subject or not message:
            return Response({"error": "Subject and message are required."}, status=400)

        if recipient == "all_centres":
            # Single record shared by all centres
            Notification.objects.create(
                recipient="all_centres",
                subject=subject,
                message=message,
                target_centre=None,
                sent_by=request.user.id if request.user.is_authenticated else None,
            )
            return Response({"status": "Notification sent to all centres"}, status=201)

        elif recipient == "centre_specific":
            try:
                centre = Centre.objects.get(pk=int(target_centre_id))
            except (Centre.DoesNotExist, ValueError, TypeError):
                return Response({"error": "Invalid or missing centre ID."}, status=400)

            Notification.objects.create(
                recipient="centre_specific",
                subject=subject,
                message=message,
                target_centre=centre,
                sent_by=request.user.id if request.user.is_authenticated else None,
            )
            return Response({"status": f"Notification sent to {centre.centre_name}"}, status=201)

        else:
            return Response({"error": "Invalid recipient type."}, status=400)


class NotificationListView(generics.ListAPIView):
    """
    Centres fetch their notifications.
    Includes both 'all_centres' and messages specific to that centre.
    """
    serializer_class = NotificationSerializer

    def get_queryset(self):
        centre_id = self.request.query_params.get("centre_id")

        if not centre_id:
            # If no centre ID, return global notifications only
            return Notification.objects.filter(recipient="all_centres").order_by("-sent_date")

        try:
            centre_id = int(centre_id)
        except ValueError:
            return Notification.objects.none()

        # Return all-centres + this centre’s notifications
        return Notification.objects.filter(
            Q(recipient="all_centres") | Q(target_centre_id=centre_id)
        ).order_by("-sent_date")




class NotificationDeleteAllView(APIView):
    def delete(self, request):
        username = request.data.get("username")
        if not username:
            return Response({"error": "Username is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        deleted_count, _ = Notification.objects.all().delete()

        return Response(
            {"status": f"{deleted_count} notifications deleted successfully."},
            status=status.HTTP_200_OK,
        )