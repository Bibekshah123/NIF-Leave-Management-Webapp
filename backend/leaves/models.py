import uuid
from django.db import models
from django.conf import settings

class LeaveBalance(models.Model):
    """
    Tracks the total and used leave balances per user per year.
    """
    class LeaveType(models.TextChoices):
        ANNUAL = "annual", "Annual Leave"
        SICK = "sick", "Sick Leave"
        CASUAL = "casual", "Casual Leave"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="leave_balances")
    leave_type = models.CharField(max_length=20, choices=LeaveType.choices)
    year = models.IntegerField()
    total_allocated = models.IntegerField()
    used_so_far = models.FloatField(default=0)

    class Meta:
        unique_together = ('user', 'leave_type', 'year')

    @property
    def remaining(self):
        return self.total_allocated - self.used_so_far

    def __str__(self):
        return f"{self.user} - {self.leave_type} ({self.year})"


class Leave(models.Model):
    """
    Leave Application tracking model.
    """
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="leaves_applied")
    leave_type = models.CharField(max_length=20, choices=LeaveBalance.LeaveType.choices)
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()
    handover_notes = models.TextField(blank=True, default='')
    
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    approver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="leaves_to_approve")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user} - {self.leave_type} ({self.status})"
