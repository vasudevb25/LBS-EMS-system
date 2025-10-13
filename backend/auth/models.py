from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError("The Username must be set")
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault('user_role', 'Admin')
        return self.create_user(username, password, **extra_fields)

class User(AbstractBaseUser):
    ROLE_CHOICES = [
        ('Admin', 'Admin'),
        ('Centre', 'Centre'),
    ]
    username = models.CharField(max_length=100, unique=True)
    password_hash = models.CharField(max_length=255)
    email = models.EmailField(unique=True, null=True, blank=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    user_role = models.CharField(max_length=50, choices=ROLE_CHOICES)
    centre_id = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = UserManager()
    USERNAME_FIELD = 'username'
