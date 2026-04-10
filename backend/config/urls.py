from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from leaves.views import LeaveViewSet, LeaveBalanceView, LeaveCalendarView
from users.views import CurrentUserView, RegisterView, UserListView
from users.token_serializers import EmailLoginView

# Automated routing for ViewSets
router = DefaultRouter()
router.register(r'leaves', LeaveViewSet, basename='leave')

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Auth APIs (JWT Authentication)
    path('api/v1/auth/login/', EmailLoginView.as_view(), name='token_obtain_pair'),
    path('api/v1/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/v1/auth/register/', RegisterView.as_view(), name='token_register'),
    path('api/v1/auth/user/', CurrentUserView.as_view(), name='token_user'),
    
    # User list API
    path('api/v1/users/', UserListView.as_view(), name='user-list'),
    
    # Workflow & Leaves APIs
    path('api/v1/', include(router.urls)),
    
    # Custom Leave Read API routes
    path('api/v1/leaves/balance', LeaveBalanceView.as_view(), name='leave-balance'),
    path('api/v1/leaves/calendar', LeaveCalendarView.as_view(), name='leave-calendar'),
]
