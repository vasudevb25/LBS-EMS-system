from django.db import models
from management.models import Course, Centre


class Examination(models.Model):
    EXAM_TYPE_CHOICES = [
        ('Regular', 'Regular'),
        ('Supplementary', 'Supplementary'),
    ]

    exam_id = models.AutoField(primary_key=True, db_column='exam_id')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='examinations', db_column='course_id')
    centre = models.ForeignKey(Centre, on_delete=models.SET_NULL, null=True, blank=True, related_name='examinations', db_column='centre_id')
    exam_name = models.CharField(max_length=255)
    exam_date = models.DateField()
    exam_start_time = models.TimeField()
    exam_end_time = models.TimeField()
    subject_code = models.CharField(max_length=50, null=True, blank=True)
    exam_type = models.CharField(max_length=50, choices=EXAM_TYPE_CHOICES)
    created_by = models.ForeignKey(Centre, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_examinations', db_column='created_by')
    created_at = models.DateTimeField(auto_now_add=True, db_column='created_at')

    class Meta:
        db_table = 'examinations'  # point Django to your existing table

    def __str__(self):
        return f"{self.exam_name} ({self.exam_date})"



class Certificate(models.Model):
    # student = models.ForeignKey(Student, on_delete=models.CASCADE)
    exam = models.ForeignKey(Examination, on_delete=models.CASCADE)
    generated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student} - {self.exam.exam_name}"
