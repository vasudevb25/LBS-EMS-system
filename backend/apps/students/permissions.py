from rest_framework.permissions import BasePermission


class StudentPermission(BasePermission):

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):

        # Admin full access
        if request.user.is_superuser:
            return True

        # Centre users
        if hasattr(request.user, "centre") and request.user.centre:

            # Only their own students
            if obj.centre == request.user.centre:
                return True

        return False
