from app.models.team import SkillType, Team, Member
from rest_framework import serializers
from app.models.team import SkillTypeInfo


class SkillTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillType
        fields = "__all__"


class MemberSerializer(serializers.ModelSerializer):
    skill_type = SkillTypeSerializer(read_only=True)

    class Meta:
        model = Member
        fields = [
            "id",
            "xp",
            "motivation",
            "familiar_tasks",
            "familiarity",
            "stress",
            "skill_type",
            "team",
        ]


class TeamSerializer(serializers.ModelSerializer):
    members = MemberSerializer(many=True, read_only=True)

    class Meta:
        model = Team
        fields = ("id", "name", "members")


class SkillTypeInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillTypeInfo
        fields = "__all__"
