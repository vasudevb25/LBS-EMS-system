# students/models.py
from django.db import models
from management.models import Centre
from management.models import Course
from django.conf import settings


class Student(models.Model):
    student_id = models.AutoField(primary_key=True)
    temporary_student_id = models.CharField(max_length=50, unique=True)
    registration_date = models.DateTimeField(auto_now_add=True)

    first_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, null=True, blank=True)
    last_name = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=10)
    email = models.EmailField(null=True, blank=True)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=100, null=True, blank=True)
    pincode = models.CharField(max_length=10, null=True, blank=True)
    aadhar_number = models.CharField(max_length=12, null=True, blank=True)
    guardian_name = models.CharField(max_length=100, null=True, blank=True)
    guardian_relation = models.CharField(max_length=50, null=True, blank=True)
    guardian_phone_number = models.CharField(max_length=15, null=True, blank=True)
    educational_qualification = models.CharField(max_length=255, null=True, blank=True)

    created_by = models.ForeignKey(settings.AUTH_USER_MODEL,db_column='created_by', on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    # Foreign keys
    centre = models.ForeignKey(Centre, on_delete=models.PROTECT, related_name="students")
    course = models.ForeignKey(Course, on_delete=models.PROTECT, related_name="students")

    class Meta:
        db_table = "students"

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
