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
        course_name = validated_data.pop("course_name")
        centre_name = validated_data.pop("centre_name")

        try:
            course = Course.objects.get(course_name=course_name)
        except Course.DoesNotExist:
            raise serializers.ValidationError({"course_name": "Invalid course name"})

        try:
            centre = Centre.objects.get(centre_name=centre_name)
        except Centre.DoesNotExist:
            raise serializers.ValidationError({"centre_name": "Invalid centre name"})

        validated_data["course"] = course
        validated_data["centre"] = centre

        return Examination.objects.create(**validated_data)


class ExamStatsSerializer(serializers.Serializer):
    scheduled_exams = serializers.IntegerField()
    hall_tickets = serializers.IntegerField()
    results_published = serializers.IntegerField()
