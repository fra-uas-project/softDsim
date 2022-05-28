from rest_framework import serializers

from history.models.member import HistoryMemberChanges, HistoryMemberStatus


class HistoryMemberStatusSerializer(serializers.Serializer):
    class Meta:
        model = HistoryMemberStatus
        fields = "__all__"


class HistoryMemberChangesSerializer(serializers.Serializer):
    class Meta:
        model = HistoryMemberChanges
        fields = "__all__"
