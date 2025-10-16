# notifications/models.py
from django.db import models

class Notification(models.Model):
    title = models.CharField(max_length=255)
    message = models.TextField()
    recipients_type = models.CharField(max_length=50)  # all_students, all_centres, centre_specific
    centre_id = models.IntegerField(null=True, blank=True)  # optional
    sent_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
