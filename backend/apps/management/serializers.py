from rest_framework import serializers
from .models import Centre, Course

class CentreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Centre
        # Explicitly include all fields you want the API to expose
        fields = '__all__' 
        # Or list them: ('centre_id', 'centre_code', 'centre_name', ...)

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'