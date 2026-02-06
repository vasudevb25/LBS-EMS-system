from rest_framework.permissions import BasePermission


class IsSuperUserOnly(BasePermission):
    """
    Admin access based on is_superuser (NOT is_staff)
    """

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_superuser
        )
