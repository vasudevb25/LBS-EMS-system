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
    created_at = models.DateTimeField(auto_now_add=True, db_column='created_at')

    class Meta:
        managed = False  # Tells Django to use the existing table
        db_table = 'centres' # Explicitly links to your PostgreSQL table name

    def __str__(self):
        return self.centre_name

class Course(models.Model):
    course_id = models.AutoField(primary_key=True)
    course_code = models.CharField(max_length=20, unique=True)
    course_name = models.CharField(max_length=255)
    stream = models.CharField(max_length=50) # Assuming validation handled in DB/Serializer
    duration = models.CharField(max_length=50)
    eligibility = models.TextField(null=True, blank=True)
    mou_required = models.BooleanField()
    # syllabus_file_path = models.CharField(max_length=500, null=True, blank=True)
    # content_file_path = models.CharField(max_length=500, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_column='created_at')

    class Meta:
        managed = False
        db_table = 'courses'

    def __str__(self):
        return self.course_name
    


    