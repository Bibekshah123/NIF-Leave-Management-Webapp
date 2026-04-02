from rest_framework import serializers
from .models import Memo, MemoWorkflowLog

class MemoWorkflowLogSerializer(serializers.ModelSerializer):
    performed_by_name = serializers.CharField(source='performed_by.get_full_name', read_only=True)
    
    class Meta:
        model = MemoWorkflowLog
        fields = ['id', 'action', 'performed_by', 'performed_by_name', 'remarks', 'timestamp']


class MemoSerializer(serializers.ModelSerializer):
    maker_name = serializers.CharField(source='maker.get_full_name', read_only=True)
    checker_name = serializers.CharField(source='checker.get_full_name', read_only=True)
    approver_name = serializers.CharField(source='approver.get_full_name', read_only=True)
    workflow_logs = MemoWorkflowLogSerializer(many=True, read_only=True)

    class Meta:
        model = Memo
        fields = [
            'id', 'ref_no', 'subject', 'background', 'purpose', 'details', 'action_expected',
            'status', 'maker', 'maker_name', 'checker', 'checker_name', 'approver', 'approver_name',
            'created_at', 'updated_at', 'workflow_logs'
        ]
        read_only_fields = ['maker', 'ref_no', 'workflow_logs']
