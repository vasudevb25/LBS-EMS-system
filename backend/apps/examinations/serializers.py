from rest_framework import serializers
from .models import Examination, Course, Centre

class ExaminationSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(write_only=True)
    centre_name = serializers.CharField(write_only=True)
    course = serializers.PrimaryKeyRelatedField(read_only=True)
    centre = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Examination
        fields = "__all__"
    def create(self, validated_data):
        # Extract names
        course_name = validated_data.pop("course_name")
        centre_name = validated_data.pop("centre_name")

        # Lookup actual objects
        course = Course.objects.get(course_name=course_name)
        centre = Centre.objects.get(centre_name=centre_name)

        # Assign IDs
        validated_data["course"] = course
        validated_data["centre"] = centre

        # Create exam
        return Examination.objects.create(**validated_data)


class ExamStatsSerializer(serializers.Serializer):
    scheduled_exams = serializers.IntegerField()
    hall_tickets = serializers.IntegerField()
    results_published = serializers.IntegerField()
