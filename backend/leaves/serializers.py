from rest_framework import serializers
from .models import Leave, LeaveBalance

class LeaveBalanceSerializer(serializers.ModelSerializer):
    remaining = serializers.ReadOnlyField()

    class Meta:
        model = LeaveBalance
        fields = ['id', 'leave_type', 'year', 'total_allocated', 'used_so_far', 'remaining']


class LeaveSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    approver_name = serializers.CharField(source='approver.get_full_name', read_only=True)

    class Meta:
        model = Leave
        fields = [
            'id', 'user', 'user_name', 'leave_type', 'start_date', 'end_date',
            'reason', 'handover_notes', 'status', 'approver', 'approver_name', 'created_at'
        ]
        read_only_fields = ['status', 'user']

    def validate(self, data):
        if data['start_date'] > data['end_date']:
            raise serializers.ValidationError("End date must be after start date.")
        return data
