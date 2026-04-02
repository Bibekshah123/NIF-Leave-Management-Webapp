from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Memo, MemoWorkflowLog
from .serializers import MemoSerializer


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

class MemoViewSet(viewsets.ModelViewSet):
    queryset = Memo.objects.all().order_by('-created_at')
    serializer_class = MemoSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else get_default_user()
        serializer.save(maker=user, status=Memo.Status.DRAFT)

    def _log_action(self, memo, action, remarks=""):
        MemoWorkflowLog.objects.create(
            memo=memo,
            action=action,
            performed_by=self.request.user,
            remarks=remarks
        )

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        memo = self.get_object()
        if memo.status != Memo.Status.DRAFT:
            return Response({"error": "Only draft memos can be submitted."}, status=status.HTTP_400_BAD_REQUEST)
        
        memo.status = Memo.Status.SUBMITTED
        memo.save()
        self._log_action(memo, "submitted", request.data.get("remarks", ""))
        
        # Tip: Add celery task here -> send_email_task.delay(memo.checker.email)
        return Response({"status": "submitted", "message": "Memo legally submitted to Checker."})

    @action(detail=True, methods=['post'], permission_classes=[IsCheckerOrApprover])
    def check(self, request, pk=None):
        memo = self.get_object()
        if memo.status != Memo.Status.SUBMITTED:
            return Response({"error": "Invalid state."}, status=status.HTTP_400_BAD_REQUEST)
        
        memo.status = Memo.Status.CHECKED
        memo.save()
        self._log_action(memo, "checked", request.data.get("remarks", ""))
        return Response({"status": "checked", "message": "Memo reviewed and forwarded to Approver."})

    @action(detail=True, methods=['post'], permission_classes=[IsApprover])
    def approve(self, request, pk=None):
        memo = self.get_object()
        memo.status = Memo.Status.APPROVED
        memo.save()
        self._log_action(memo, "approved", request.data.get("remarks", ""))
        return Response({"status": "approved", "message": "Memo finally approved."})

    @action(detail=True, methods=['post'], permission_classes=[IsCheckerOrApprover])
    def reject(self, request, pk=None):
        memo = self.get_object()
        memo.status = Memo.Status.REJECTED
        memo.save()
        self._log_action(memo, "rejected", request.data.get("remarks", ""))
        return Response({"status": "rejected", "message": "Memo rejected."})
