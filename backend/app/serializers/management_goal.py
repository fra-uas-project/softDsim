from rest_framework import serializers

from app.models.management_goal import ManagementGoal

#
# class TaskGoalSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = TaskGoal
#         fields = "__all__"


class ManagementGoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManagementGoal
        fields = (
            "budget",
            "duration",
            "easy_tasks",
            "medium_tasks",
            "hard_tasks",
            "tasks_predecessor_p",
        )

    # https://www.django-rest-framework.org/api-guide/relations/#nested-relationships
    # https://www.django-rest-framework.org/api-guide/serializers/#dealing-with-nested-objects
