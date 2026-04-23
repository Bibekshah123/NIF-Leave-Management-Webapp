import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """
    Custom user model for the NIF Portal.
    Uses UUID as the primary key.
    """
    class Roles(models.TextChoices):
        MAKER = "maker", "Maker"
        APPROVER = "approver", "Approver"
        ADMIN = "admin", "Admin"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.CharField(max_length=20, choices=Roles.choices, default=Roles.MAKER)
    department = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.get_full_name()} ({self.role})"
