from rest_framework import serializers

from app.serializers.team import SkillTypeSerializer

from history.models.member import HistoryMemberChanges, HistoryMemberStatus


class HistoryMemberStatusSerializer(serializers.ModelSerializer):
    skill_type = SkillTypeSerializer()

    class Meta:
        model = HistoryMemberStatus
        fields = (
            "member_id",
            "motivation",
            "stress",
            "xp",
            "skill_type",
            "skill_type_name",
        )


class HistoryMemberChangesSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoryMemberChanges
        fields = (
            "skill_type_name",
            "change",
        )
