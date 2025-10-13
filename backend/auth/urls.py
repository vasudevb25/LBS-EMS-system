from django.urls import path
from .views import LoginView, AdminView, CentreView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('admin-page/', AdminView.as_view(), name='admin_page'),
    path('centre-page/', CentreView.as_view(), name='centre_page'),
]
