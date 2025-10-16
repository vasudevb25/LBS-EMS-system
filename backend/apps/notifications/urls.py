from django.urls import path
from .views import NotificationCreateView, NotificationListView, NotificationDeleteAllView

urlpatterns = [
    path("send/", NotificationCreateView.as_view(), name="send-notification"),
    path("history/", NotificationListView.as_view(), name="notification-history"),
    path("clear/", NotificationDeleteAllView.as_view(), name="clear-notifications"),
]
