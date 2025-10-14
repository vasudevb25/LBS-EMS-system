# students/models.py
from django.db import models

class Centre(models.Model):
    centre_id = models.AutoField(primary_key=True)
    centre_code = models.CharField(max_length=10, unique=True)
    centre_name = models.CharField(max_length=255)
    location = models.CharField(max_length=255, null=True, blank=True)
    district = models.CharField(max_length=100, null=True, blank=True)
    validity_start_date = models.DateField()
    validity_end_date = models.DateField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'centres'

    def __str__(self):
        return self.centre_name


class Course(models.Model):
    course_id = models.AutoField(primary_key=True)
    course_code = models.CharField(max_length=20, unique=True)
    course_name = models.CharField(max_length=255)
    stream = models.CharField(max_length=50)
    duration = models.CharField(max_length=50)
    eligibility = models.TextField(null=True, blank=True)
    mou_required = models.BooleanField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'courses'

    def __str__(self):
        return self.course_name


class Student(models.Model):
    student_id = models.AutoField(primary_key=True)
    temporary_student_id = models.CharField(max_length=50, unique=True, blank=True, null=True)
    centre = models.ForeignKey(Centre, on_delete=models.DO_NOTHING, db_column='centre_id')
    course = models.ForeignKey(Course, on_delete=models.DO_NOTHING, db_column='course_id')
    registration_date = models.DateTimeField(blank=True, null=True)
    first_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=10, blank=True, null=True)
    email = models.EmailField(max_length=255, blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    pincode = models.CharField(max_length=10, blank=True, null=True)
    aadhar_number = models.CharField(max_length=12, unique=True, blank=True, null=True)
    guardian_name = models.CharField(max_length=255, blank=True, null=True)
    guardian_relation = models.CharField(max_length=50, blank=True, null=True)
    guardian_phone_number = models.CharField(max_length=20, blank=True, null=True)
    educational_qualification = models.TextField(blank=True, null=True)
    created_by = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'students'
        managed = False  # ❌ Do NOT try to create/migrate this table
