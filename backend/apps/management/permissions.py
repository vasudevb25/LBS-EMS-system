from rest_framework.permissions import BasePermission, SAFE_METHODS


class CentreCoursePermission(BasePermission):
    """
    Admin (is_superuser):
        - Full access (GET, POST, PUT, DELETE)

    Centre (not superuser):
        - Read-only (GET, HEAD, OPTIONS)
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        if request.method in SAFE_METHODS:
            return True

        return request.user.is_superuser
