# notifications/urls.py
from django.urls import path
from .views import SendNotificationView

urlpatterns = [
    path("send/", SendNotificationView.as_view(), name="send-notification"),
]
