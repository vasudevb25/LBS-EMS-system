from rest_framework import serializers
from .models import Centre, Course

# centres/serializers.py
class CentreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Centre
        fields = '__all__'
        extra_kwargs = {
            'created_at': {'read_only': True},
            'is_active': {'default': True},
        }

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'



# centres/serializers.py
from rest_framework import serializers
from .models import Centre

