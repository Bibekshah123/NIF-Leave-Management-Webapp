from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Memo, MemoWorkflowLog
from .serializers import MemoSerializer
from users.permissions import IsCheckerOrApprover, IsApproverOrAdmin, IsMaker, IsMemoOwnerOrAdmin

class MemoViewSet(viewsets.ModelViewSet):
    queryset = Memo.objects.all().order_by('-created_at')
    serializer_class = MemoSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'ref_no'
    lookup_value_regex = '[^/]+'

    def get_permissions(self):
        if self.action == 'submit':
            return [IsMaker()]
        if self.action == 'check':
            return [IsCheckerOrApprover()]
        if self.action == 'approve':
            return [IsApproverOrAdmin()]
        if self.action == 'reject':
            return [IsCheckerOrApprover()]
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsMemoOwnerOrAdmin()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        from users.models import User
        if user.role == User.Roles.MAKER:
            return Memo.objects.filter(maker=user)
        if user.role == User.Roles.CHECKER:
            return Memo.objects.filter(status__in=[Memo.Status.SUBMITTED, Memo.Status.CHECKED])
        if user.role == User.Roles.APPROVER:
            return Memo.objects.filter(status__in=[Memo.Status.CHECKED, Memo.Status.APPROVED])
        return Memo.objects.all()

    def perform_create(self, serializer):
        serializer.save(maker=self.request.user, status=Memo.Status.DRAFT)

    def _log_action(self, memo, action, remarks=""):
        MemoWorkflowLog.objects.create(
            memo=memo,
            action=action,
            performed_by=self.request.user,
            remarks=remarks
        )

    @action(detail=True, methods=['post'], permission_classes=[IsMaker])
    def submit(self, request, pk=None):
        memo = self.get_object()
        if memo.maker != request.user and request.user.role != 'admin':
            return Response({"error": "You may only submit your own memos."}, status=status.HTTP_403_FORBIDDEN)
        if memo.status != Memo.Status.DRAFT:
            return Response({"error": "Only draft memos can be submitted."}, status=status.HTTP_400_BAD_REQUEST)

        memo.status = Memo.Status.SUBMITTED
        memo.save()
        self._log_action(memo, "submitted", request.data.get("remarks", ""))
        return Response(self.get_serializer(memo).data)

    @action(detail=True, methods=['post'], permission_classes=[IsCheckerOrApprover])
    def check(self, request, pk=None):
        memo = self.get_object()
        if memo.status != Memo.Status.SUBMITTED:
            return Response({"error": "Invalid state."}, status=status.HTTP_400_BAD_REQUEST)

        memo.status = Memo.Status.CHECKED
        memo.save()
        self._log_action(memo, "checked", request.data.get("remarks", ""))
        return Response(self.get_serializer(memo).data)

    @action(detail=True, methods=['post'], permission_classes=[IsApproverOrAdmin])
    def approve(self, request, pk=None):
        memo = self.get_object()
        memo.status = Memo.Status.APPROVED
        memo.save()
        self._log_action(memo, "approved", request.data.get("remarks", ""))
        return Response(self.get_serializer(memo).data)

    @action(detail=True, methods=['post'], permission_classes=[IsCheckerOrApprover])
    def reject(self, request, pk=None):
        memo = self.get_object()
        memo.status = Memo.Status.REJECTED
        memo.save()
        self._log_action(memo, "rejected", request.data.get("remarks", ""))
        return Response(self.get_serializer(memo).data)
