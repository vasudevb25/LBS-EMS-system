# students/serializers.py
from rest_framework import serializers
from .models import Student

class StudentSerializer(serializers.ModelSerializer):
    centre_name = serializers.CharField(source="centre.centre_name", read_only=True)
    course_name = serializers.CharField(source="course.course_name", read_only=True)

    class Meta:
        model = Student
        fields = "__all__"
