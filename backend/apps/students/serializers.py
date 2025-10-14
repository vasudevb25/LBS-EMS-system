# students/serializers.py
from rest_framework import serializers
from .models import Student

class StudentSerializer(serializers.ModelSerializer):
    centre_name = serializers.CharField(source='centre.centre_name', read_only=True)
    course_name = serializers.CharField(source='course.course_name', read_only=True)

    class Meta:
        model = Student
        fields = [
            'student_id',
            'temporary_student_id',
            'first_name',
            'middle_name',
            'last_name',
            'date_of_birth',
            'gender',
            'email',
            'phone_number',
            'centre_name',
            'course_name',
        ]