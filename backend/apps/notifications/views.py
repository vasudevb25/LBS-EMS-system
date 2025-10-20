from rest_framework import generics,status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from .models import Notification
from .serializers import NotificationSerializer

# Admin sending notifications
class NotificationCreateView(APIView):
    def post(self, request):
        serializer = NotificationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "Notification sent successfully"})
        return Response(serializer.errors, status=400)

# Centre fetching notifications
class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer

    def get_queryset(self):
        centre_id = self.request.query_params.get("centre_id")
        if centre_id:
            return Notification.objects.filter(
                Q(recipient="all_centres") | Q(target_centre_id=centre_id)
            ).order_by("-sent_date")
        return Notification.objects.filter(recipient="all_centres").order_by("-sent_date")

class NotificationDeleteAllView(APIView):
    """
    Deletes all notifications for a centre or all notifications if centre_id is None.
    """
    def delete(self, request):
        centre_id = request.query_params.get("centre_id")
        if centre_id:
            # Delete only notifications for this centre + all-centres if needed
            deleted_count, _ = Notification.objects.filter(
                target_centre_id=centre_id
            ).delete()
        else:
            deleted_count, _ = Notification.objects.all().delete()

        return Response({"status": f"{deleted_count} notifications deleted"}, status=status.HTTP_200_OK)
