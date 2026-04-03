from rest_framework import serializers
from .models import Student


class StudentSerializer(serializers.ModelSerializer):
    centre_name = serializers.CharField(
        source="centre.centre_name", read_only=True
    )
    course_name = serializers.CharField(
        source="course.course_name", read_only=True
    )

    def validate(self, data):
        request = self.context.get("request")
        user = request.user if request else None

        temp_id = data.get("temporary_student_id")

        # 🔥 get centre safely
        if self.instance:
            centre = self.instance.centre
        else:
            if user and hasattr(user, "centre"):
                centre = user.centre
            else:
                raise serializers.ValidationError("Centre not found for user.")

        if not temp_id:
            return data

        temp_id = str(temp_id).strip()

        # 🔥 build final ID (NO leading zero nonsense assumption)
        if temp_id.isdigit():
            formatted = f"{int(temp_id):03d}"
        else:
            formatted = temp_id

        final_id = f"{centre.centre_code}{formatted}"

        # 🔥 uniqueness check
        qs = Student.objects.filter(temporary_student_id=final_id)

        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)

        if qs.exists():
            raise serializers.ValidationError({
                "temporary_student_id": "Student ID already exists for this centre."
            })

        return data

    class Meta:
        model = Student
        fields = "__all__"
        read_only_fields = ["centre", "status"]

        extra_kwargs = {
            "photo_path": {"required": False, "allow_null": True},
            "payment_proof": {"required": False, "allow_null": True},
            "email": {"required": False},
            "phone_number": {"required": False},
        }