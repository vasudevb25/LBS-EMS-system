# students/serializers.py
from rest_framework import serializers
from .models import Student
from management.models import Centre,Course


class StudentSerializer(serializers.ModelSerializer):
    centre_name = serializers.CharField(source="centre.centre_name", read_only=True)
    course_name = serializers.CharField(source="course.course_name", read_only=True)
    class Meta:
        model = Student
        fields = "__all__"
        extra_kwargs = {
            "photo_path": {"required": False},
            "payment_proof": {"required": False},
            "email": {"required": False},
            "phone_number": {"required": False},
            # add other optional fields
        }
        