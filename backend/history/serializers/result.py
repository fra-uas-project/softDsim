from rest_framework import serializers
from history.models.result import Result


class ResultSerializer(serializers.ModelSerializer):
    # I think we dont need to resolve the user_scenario here
    # user_scenario = UserScenarioSerializer(read_only=True)

    class Meta:
        model = Result
        fields = [
            "user_scenario",
            "total_score",
            "timestamp",
            "total_steps",
            "total_days",
            "total_cost",
            "tasks_accepted",
            "tasks_rejected",
            "tasks_todo",
            "tasks_done",
            "tasks_unit_tested",
            "tasks_integration_tested",
            "tasks_bug_discovered",
            "tasks_bug_undiscovered",
            "tasks_done_wrong_specification",
            "quality_score",
            "time_score",
            "budget_score",
            "question_score",
            "model",
        ]
