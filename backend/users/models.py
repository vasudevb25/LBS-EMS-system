from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class User(AbstractBaseUser):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=255, db_column='password_hash')
    email = models.EmailField(unique=True, null=True, blank=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    user_role = models.CharField(max_length=50, choices=[('Admin', 'Admin'), ('Centre', 'Centre')])
    centre = models.ForeignKey(
        'management.Centre',
        on_delete=models.CASCADE,
        db_column='centre_id',
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    objects = BaseUserManager()

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.username