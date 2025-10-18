from rest_framework import serializers
from .models import Examination


class ExaminationSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(source='course.course_name', read_only=True)
    centre_name = serializers.CharField(source='centre.centre_name', read_only=True)

    class Meta:
        model = Examination
        fields = [
            'exam_id', 'exam_name', 'subject_code', 'exam_type', 
            'exam_date', 'exam_start_time', 'exam_end_time',
            'course', 'centre', 'course_name', 'centre_name', 'created_at'
        ]


class ExamStatsSerializer(serializers.Serializer):
    scheduled_exams = serializers.IntegerField()
    hall_tickets = serializers.IntegerField()
    results_published = serializers.IntegerField()
    certificates_generated = serializers.IntegerField()
