from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from management.models import Centre  # Make sure this import path matches your app name

class User(AbstractBaseUser):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=255, db_column='password_hash')
    email = models.EmailField(unique=True, null=True, blank=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    user_role = models.CharField(max_length=50, choices=[('Admin', 'Admin'), ('Centre', 'Centre')])
    
    # ✅ Corrected: ForeignKey to Centre
    centre = models.ForeignKey(
        Centre,
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
        managed = False  # keep False if the table already exists

    def __str__(self):
        return self.username
