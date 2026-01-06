from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    USER_ROLES = (
        ("Admin", "Admin"),
        ("Centre", "Centre"),
    )
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    user_role = models.CharField(
        max_length=50,
        choices=USER_ROLES,
    )
    centre = models.ForeignKey(
        "management.Centre",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="users",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "users"

    def __str__(self):
        return self.username
