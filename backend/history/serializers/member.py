from rest_framework import serializers

from app.serializers.team import SkillTypeSerializer

from history.models.member import HistoryMemberChanges, HistoryMemberStatus


class HistoryMemberStatusSerializer(serializers.Serializer):
    skill_type = SkillTypeSerializer()

    class Meta:
        model = HistoryMemberStatus
        fields = (
            "history",
            "member_id",
            "motivation",
            "stress",
            "xp",
            "skill_type",
            "skill_type_name",
        )


class HistoryMemberChangesSerializer(serializers.Serializer):
    class Meta:
        model = HistoryMemberChanges
        fields = "__all__"
