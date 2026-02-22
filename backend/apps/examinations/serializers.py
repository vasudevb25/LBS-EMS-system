from rest_framework import serializers
from .models import ExamStudentReg, Examination, Course, Centre


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


class ExamStudentRegSerializer(serializers.ModelSerializer):
    candidate_name = serializers.CharField(source="student.first_name", read_only=True)
    centre_code = serializers.CharField(source="student.centre.centre_code", read_only=True)
    course_code = serializers.CharField(source="student.course.course_code", read_only=True)
    exam_centre = serializers.CharField(source="exam.exam_centre", read_only=True)
    exam_fees = serializers.DecimalField(source="exam.fees", max_digits=10, decimal_places=2, read_only=True)
    course_code = serializers.CharField(source="student.course.course_code", read_only=True)
    exam_centre = serializers.CharField(source="exam.exam_centre", read_only=True)
    exam_fees = serializers.DecimalField(source="exam.fees", max_digits=10, decimal_places=2, read_only=True)
    class Meta:
        model = ExamStudentReg
        fields = "__all__"

class ExamStatsSerializer(serializers.Serializer):
    scheduled_exams = serializers.IntegerField()
    hall_tickets = serializers.IntegerField()
    results_published = serializers.IntegerField()
