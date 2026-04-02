import uuid
import datetime
from django.db import models
from django.conf import settings

class Memo(models.Model):
    """
    Core Memo model representing the document to be approved.
    Designed for high traceability and enterprise standard RBAC compliance.
    """
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        SUBMITTED = "submitted", "Submitted"
        CHECKED = "checked", "Checked"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"
        RETURNED = "returned", "Returned"

    class Priority(models.TextChoices):
        URGENT = "urgent", "Urgent"
        HIGH = "high", "High"
        NORMAL = "normal", "Normal"
        LOW = "low", "Low"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ref_no = models.CharField(max_length=50, unique=True, editable=False, help_text="Auto-generated Standard Memo Reference Number")
    
    # Memo Details
    subject = models.CharField(max_length=255)
    department = models.CharField(max_length=100, blank=True, null=True)
    priority = models.CharField(max_length=20, choices=Priority.choices, default=Priority.NORMAL)
    
    background = models.TextField()
    purpose = models.TextField()
    details = models.TextField()
    action_expected = models.TextField(blank=True, null=True)

    # Workflow & State Machine Tracking
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT, db_index=True)
    
    # Relational Chains (Using PROTECT to prevent massive data loss if a user is deleted)
    maker = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="memos_created")
    checker = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="memos_to_check")
    approver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="memos_to_approve")

    # Timestamps & Soft Deletes
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True, help_text="Used for soft-deleting memos to safely maintain audit trails.")

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'created_at']),
        ]

    def save(self, *args, **kwargs):
        # Auto-generate a beautiful standard reference number if none exists: e.g., NIF-20241014-A2F4
        if not self.ref_no:
            date_str = datetime.datetime.now().strftime("%Y%m%d")
            # We take the first 4 characters of the unique UUID for tracking
            short_uuid = str(self.id).split('-')[0].upper()
            self.ref_no = f"NIF-{date_str}-{short_uuid}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"[{self.ref_no}] {self.subject}"


class MemoWorkflowLog(models.Model):
    """
    Immutable Audit Trail recording every state transition. 
    Strictly forbidden from being updated after creation.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    memo = models.ForeignKey(Memo, on_delete=models.CASCADE, related_name="workflow_logs")
    action = models.CharField(max_length=50) # e.g. 'submitted', 'checked', 'approved', 'rejected'
    performed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    remarks = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['memo', 'action']),
        ]

    def __str__(self):
        return f"{self.memo.ref_no} -> {self.action} by {self.performed_by}"
