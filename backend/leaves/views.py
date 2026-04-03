from rest_framework import viewsets, views, status
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsApproverOrAdmin
from .models import Leave, LeaveBalance
from .serializers import LeaveSerializer, LeaveBalanceSerializer

class LeaveViewSet(viewsets.ModelViewSet):
    serializer_class = LeaveSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        from users.models import User

        if user.role == User.Roles.MAKER:
            return Leave.objects.filter(user=user)

        if user.role == User.Roles.CHECKER:
            return Leave.objects.filter(status=Leave.Status.PENDING)

        if user.role in [User.Roles.APPROVER, User.Roles.ADMIN]:
            return Leave.objects.all()

        return Leave.objects.none()

    def perform_create(self, serializer):
        from users.models import User
        if self.request.user.role not in [User.Roles.MAKER, User.Roles.ADMIN]:
            raise PermissionDenied("Only makers can apply for leave.")
        serializer.save(user=self.request.user, status=Leave.Status.PENDING)

    @action(detail=True, methods=['post'], permission_classes=[IsApproverOrAdmin])
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
        leaves = Leave.objects.filter(status=Leave.Status.APPROVED)
        serializer = LeaveSerializer(leaves, many=True)
        return Response(serializer.data)
