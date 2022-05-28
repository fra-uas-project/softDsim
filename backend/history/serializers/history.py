from rest_framework import serializers

from app.serializers.user_scenario import UserScenarioSerializer

from history.models.history import History
from history.serializers.member import (
    HistoryMemberChangesSerializer,
    HistoryMemberStatusSerializer,
)

from history.serializers.question import HistoryQuestionSerializer


class HistorySerializer(serializers.ModelSerializer):
    user_scenario = UserScenarioSerializer(read_only=True)
    questions = HistoryQuestionSerializer(many=True)
    members = HistoryMemberStatusSerializer(many=True)
    member_changes = HistoryMemberChangesSerializer(many=True)

    class Meta:
        model = History
        fields = [
            "user_scenario",
            "type",
            "timestamp",
            "model",
            # state
            "counter",
            "day",
            "cost",
            # Task stuff
            "tasks_todo",
            "task_done",
            "tasks_unit_tested",
            "tasks_integration_tested",
            "tasks_bug_discovered",
            "tasks_bug_undiscovered",
            "tasks_done_wrong_specification",
            # Question stuff
            "question_collection",
            "questions",
            # Actions
            "bugfix",
            "unittest",
            "integrationtest",
            "meetings",
            "salary",
            "salary",
            "overtime",
            # Member Stuff
            "members",
            "member_changes",
        ]
