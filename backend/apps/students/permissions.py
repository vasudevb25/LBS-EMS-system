from rest_framework.permissions import BasePermission, SAFE_METHODS

class StudentPermission(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user.is_authenticated
        # Centre can create/update/delete students
        return request.user.is_authenticated and not request.user.is_superuser
