from rest_framework.routers import DefaultRouter
from .views import CentreViewSet, CourseViewSet

# A router automatically creates URL patterns for ViewSets
router = DefaultRouter()
router.register(r'centres', CentreViewSet) # URL: /api/centres/
router.register(r'courses', CourseViewSet) # URL: /api/courses/

urlpatterns = router.urls