# students/models.py
from django.db import models
from management.models import Centre
from management.models import Course
from django.conf import settings


class Student(models.Model):
    student_id = models.AutoField(primary_key=True)
    temporary_student_id = models.CharField(max_length=50)
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

    photo_path = models.ImageField(upload_to="students/photos/", null=True, blank=True)
    payment_proof = models.FileField(upload_to="students/payments/", null=True, blank=True)
    eligibility_proof = models.FileField(upload_to="students/eligibility/", null=True, blank=True)
    aadhar_path = models.FileField(upload_to="students/aadhar/", null=True, blank=True)

    created_by = models.ForeignKey(settings.AUTH_USER_MODEL,db_column='created_by', on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    centre = models.ForeignKey(Centre, on_delete=models.PROTECT, related_name="students")
    course = models.ForeignKey(Course, on_delete=models.PROTECT, related_name="students")

    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Approved", "Approved"),
        ("Rejected", "Rejected"),
    ]

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Pending"
    )
    def save(self, *args, **kwargs):
        if self.temporary_student_id:
            centre_code = self.centre.centre_code
            if not self.temporary_student_id.startswith(centre_code):
                raw_id = str(self.temporary_student_id).strip()
                if raw_id.isdigit():
                    raw_id = f"{int(raw_id):03d}"
                self.temporary_student_id = f"{centre_code}{raw_id}"
        super().save(*args, **kwargs)

    class Meta:
        db_table = "students"
    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    