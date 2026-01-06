from rest_framework.authentication import SessionAuthentication

class CsrfExemptSessionAuthentication(SessionAuthentication):
    """
    Session authentication without CSRF enforcement.
    Safe for trusted admin dashboards.
    """
    def enforce_csrf(self, request):
        return
