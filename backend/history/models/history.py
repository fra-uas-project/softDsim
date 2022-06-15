from django.db import models
from app.models.question_collection import QuestionCollection
from app.models.user_scenario import UserScenario


class History(models.Model):
    user_scenario = models.ForeignKey(
        UserScenario, on_delete=models.CASCADE, related_name="history"
    )

    request_type = models.TextField(max_length=32, default="", null=True)
    response_type = models.TextField(max_length=32, default="", null=True)

    timestamp = models.DateTimeField(auto_now=True)

    # State
    component_counter = models.PositiveIntegerField(null=True)
    step_counter = models.PositiveIntegerField(null=True)
    day = models.PositiveIntegerField(null=True)
    cost = models.FloatField(null=True)

    # Tasks
    tasks_todo = models.PositiveIntegerField(null=True)
    tasks_done = models.PositiveIntegerField(null=True)
    tasks_unit_tested = models.PositiveIntegerField(null=True)
    tasks_integration_tested = models.PositiveIntegerField(null=True)
    tasks_bug_discovered = models.PositiveIntegerField(null=True)
    tasks_bug_undiscovered = models.PositiveIntegerField(null=True)
    tasks_done_wrong_specification = models.PositiveIntegerField(null=True)

    # Question
    question_collection = models.ForeignKey(
        QuestionCollection, on_delete=models.SET_NULL, blank=True, null=True
    )
    # questions = List[HistoryQuestion]

    # Simulation Fragment
    bugfix = models.BooleanField(blank=True, null=True)
    unittest = models.BooleanField(blank=True, null=True)
    integrationtest = models.BooleanField(blank=True, null=True)
    meetings = models.PositiveSmallIntegerField(blank=True, null=True)
    teamevent = models.PositiveSmallIntegerField(blank=True, null=True)
    salary = models.PositiveSmallIntegerField(blank=True, null=True)
    overtime = models.PositiveSmallIntegerField(blank=True, null=True)
    days = models.PositiveSmallIntegerField(blank=True, null=True)

    # Members
    # members = List[HistoryMemberStatus]
    # memberChanges = List[HistoryMembersChange]

    # Model Selection
    model = models.TextField(max_length=64, null=True, blank=True)

    # Event (ToDo)
