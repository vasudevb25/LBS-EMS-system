# notifications/views.py
from django.core.mail import send_mail
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Notification
from students.models import Student
from management.models import Centre
from django.conf import settings

class SendNotificationView(APIView):
    def post(self, request):
        title = request.data.get("title")
        message = request.data.get("message")
        recipients_type = request.data.get("recipients_type")
        centre_id = request.data.get("centre_id")  # optional

        # Validate input
        if not title or not message or not recipients_type:
            return Response(
                {"error": "Missing required fields: title, message, recipients_type"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Determine recipients
        emails = []

        if recipients_type == "all_students":
            emails = list(Student.objects.values_list("email", flat=True))
        elif recipients_type == "all_centres":
            emails = list(Centre.objects.values_list("email", flat=True))
        elif recipients_type == "centre_specific":
            if not centre_id:
                return Response({"error": "centre_id is required for centre_specific"}, status=status.HTTP_400_BAD_REQUEST)
            emails = list(Student.objects.filter(centre_id=centre_id).values_list("email", flat=True))
        else:
            return Response({"error": "Invalid recipients_type"}, status=status.HTTP_400_BAD_REQUEST)

        if not emails:
            return Response({"error": "No recipients found"}, status=status.HTTP_400_BAD_REQUEST)

        # Send emails in batches (optional)
        try:
            send_mail(
                subject=title,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=emails,
                fail_silently=False,
            )

            # Save notification record
            Notification.objects.create(
                title=title,
                message=message,
                recipients_type=recipients_type,
                centre_id=centre_id if centre_id else None,
                recipients_count=len(emails)
            )

            return Response({"status": f"Notification sent to {len(emails)} recipients"}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
