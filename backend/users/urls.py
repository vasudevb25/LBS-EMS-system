from django.urls import path
from .views import LoginView, LogoutView, ForgotPasswordView

urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("forgot-password/", ForgotPasswordView.as_view(), name="forgot-password"),
    path("logout/", LogoutView.as_view(), name="logout"),
]
