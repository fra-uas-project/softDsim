from rest_framework import serializers

from app.serializers.user_scenario import UserScenarioSerializer

from history.models.history import History
from history.serializers.member import (
    HistoryMemberChangesSerializer,
    HistoryMemberStatusSerializer,
)

from history.serializers.question import HistoryQuestionSerializer


class HistorySerializer(serializers.ModelSerializer):
    # user_scenario = UserScenarioSerializer(read_only=True)
    questions = HistoryQuestionSerializer(many=True)
    members = HistoryMemberStatusSerializer(many=True)
    member_changes = HistoryMemberChangesSerializer(many=True)

    class Meta:
        model = History
        fields = [
            "user_scenario",
            "type",
            "counter",
            "day",
            "cost",
            "tasks_todo",
            "question_collection",
            "questions",
            "bugfix",
            "meetings",
            "members",
            "member_changes",
        ]
