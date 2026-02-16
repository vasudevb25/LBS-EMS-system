from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail
import uuid
from users.models import User
from django.conf import settings


class LoginView(APIView):
    permission_classes = [AllowAny]  

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)

        if not user:
            return Response(
                {"error": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        refresh = RefreshToken.for_user(user)

        is_admin = user.is_superuser
        role = "Admin" if is_admin else "Centre"

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "username": user.username,
            "user_role": role,
            "centre_id": user.centre.centre_id if user.centre else None,
        },
            status=status.HTTP_200_OK,
        )



class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")

        if not email:
            return Response(
                {"error": "Email is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"error": "No account found with this email"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Generate new random password
        new_password = uuid.uuid4().hex[:8]

        user.password = make_password(new_password)
        user.save()

        # Send email
        send_mail(
            subject="LBS EMS - Password Reset",
            message=f"""
                Hello {user.username},

                Your password has been reset.

                New Password: {new_password}

                Please login and change it immediately.

                Regards,
                LBS Education System
                """,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )

        return Response(
            {"message": "New password sent to your email"},
            status=status.HTTP_200_OK,
        )
class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        return Response({"message": "Logged out"})
