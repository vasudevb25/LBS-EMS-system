from django.db import models
from management.models import Centre  # Your Centre model

class Notification(models.Model):
    RECIPIENT_CHOICES = [
        ("all_centres", "All Centres"),
        ("centre_specific", "Centre Specific"),
    ]

    recipient = models.CharField(max_length=50, choices=RECIPIENT_CHOICES)
    subject = models.CharField(max_length=255)
    message = models.TextField()
    target_centre = models.ForeignKey(
        Centre,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    sent_date = models.DateTimeField(auto_now_add=True)
    sent_by = models.IntegerField(null=True, blank=True)  # Optional admin ID

    def __str__(self):
        return self.subject
