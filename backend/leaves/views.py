from rest_framework import viewsets, views, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Leave, LeaveBalance
from .serializers import LeaveSerializer, LeaveBalanceSerializer


def get_default_user():
    from users.models import User
    user = User.objects.first()
    if user is None:
        user = User.objects.create_user(
            username='testuser',
            password='testpass',
            first_name='Test',
            last_name='User',
            role=User.Roles.MAKER,
        )
    return user

class LeaveViewSet(viewsets.ModelViewSet):
    serializer_class = LeaveSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Leave.objects.all()

        from users.models import User
        if user.role in [User.Roles.APPROVER, User.Roles.ADMIN]:
            return Leave.objects.all()
        return Leave.objects.filter(user=user)

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else get_default_user()
        serializer.save(user=user, status=Leave.Status.PENDING)

    @action(detail=True, methods=['post'])
    def set_status(self, request, pk=None):
        leave = self.get_object()
        status_value = request.data.get('status')
        valid_statuses = [choice[0] for choice in Leave.Status.choices]
        if status_value not in valid_statuses:
            return Response({"error": "Invalid leave status."}, status=status.HTTP_400_BAD_REQUEST)

        leave.status = status_value
        leave.save()
        return Response(self.get_serializer(leave).data)

class LeaveBalanceView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        balances = LeaveBalance.objects.filter(user=request.user)
        serializer = LeaveBalanceSerializer(balances, many=True)
        return Response(serializer.data)

class LeaveCalendarView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Fetch approved team leaves to populate the Team Calendar UI
        leaves = Leave.objects.filter(status=Leave.Status.APPROVED)
        serializer = LeaveSerializer(leaves, many=True)
        return Response(serializer.data)
