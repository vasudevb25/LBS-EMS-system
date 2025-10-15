from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

# --- Custom User Manager ---
class UserManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError("Username is required")
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault("user_role", "Admin")
        user = self.create_user(username, password, **extra_fields)
        return user


# --- Custom User Model ---
class User(AbstractBaseUser):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=255, db_column='password_hash')  # 👈 FIX HERE
    email = models.EmailField(unique=True, null=True, blank=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    user_role = models.CharField(max_length=50, choices=[('Admin', 'Admin'), ('Centre', 'Centre')])
    centre_id = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    objects = UserManager()

    class Meta:
        db_table = 'users'
        managed = False  # because your table already exists

    def __str__(self):
        return self.username
