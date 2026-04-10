from rest_framework import generics, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.db.models import Count, Q
from django.utils import timezone
from datetime import datetime
from .models import User
from leaves.models import Leave, LeaveBalance
from leaves.serializers import LeaveSerializer, LeaveBalanceSerializer
from .serializers import UserSerializer, AdminUserCreateSerializer


class IsAdminOrSuperuser(IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and (request.user.is_staff or request.user.is_superuser or request.user.role == 'admin')


class AdminUserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAdminOrSuperuser]
    search_fields = ['username', 'email', 'first_name', 'last_name']

    def get_queryset(self):
        return User.objects.all().order_by('username')

    def get_serializer_class(self):
        if self.action == 'create':
            return AdminUserCreateSerializer
        return UserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AdminStatsView(generics.GenericAPIView):
    permission_classes = [IsAdminOrSuperuser]

    def get(self, request):
        now = timezone.now()
        current_year = now.year

        total_users = User.objects.count()
        total_leaves = Leave.objects.count()
        pending_leaves = Leave.objects.filter(status='pending').count()
        approved_leaves = Leave.objects.filter(status='approved').count()
        rejected_leaves = Leave.objects.filter(status='rejected').count()

        recent_leaves = Leave.objects.order_by('-created_at')[:10]
        recent_leaves_data = []
        for leave in recent_leaves:
            recent_leaves_data.append({
                'id': str(leave.id),
                'user_name': leave.user.get_full_name() or leave.user.username,
                'leave_type': leave.get_leave_type_display(),
                'start_date': str(leave.start_date),
                'end_date': str(leave.end_date),
                'status': leave.status,
                'created_at': leave.created_at.isoformat(),
            })

        return Response({
            'total_users': total_users,
            'total_leaves': total_leaves,
            'pending_leaves': pending_leaves,
            'approved_leaves': approved_leaves,
            'rejected_leaves': rejected_leaves,
            'recent_leaves': recent_leaves_data,
        })


class AdminLeaveViewSet(viewsets.ModelViewSet):
    serializer_class = LeaveSerializer
    permission_classes = [IsAdminOrSuperuser]

    def get_queryset(self):
        return Leave.objects.select_related('user').order_by('-created_at')

    def get_serializer_class(self):
        return LeaveSerializer


class AdminLeaveViewSet(viewsets.ModelViewSet):
    serializer_class = LeaveSerializer
    permission_classes = [IsAdminOrSuperuser]

    def get_queryset(self):
        return Leave.objects.select_related('user', 'approver').order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save()

    def perform_update(self, serializer):
        serializer.save()


class AdminBalanceViewSet(viewsets.ModelViewSet):
    serializer_class = LeaveBalanceSerializer
    permission_classes = [IsAdminOrSuperuser]

    def get_queryset(self):
        return LeaveBalance.objects.select_related('user').order_by('user__username')