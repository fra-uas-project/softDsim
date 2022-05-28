from django.db import models
from app.models.question_collection import QuestionCollection
from app.models.user_scenario import UserScenario


class History(models.Model):
    user_scenario = models.ForeignKey(
        UserScenario, on_delete=models.CASCADE, related_name="history"
    )

    type = models.TextField(max_length=32)

    # timestamp = models.DateTimeField(auto_now=True)

    # State
    counter = models.PositiveIntegerField()
    day = models.PositiveIntegerField()
    cost = models.FloatField()

    # Tasks
    tasks_todo = models.PositiveIntegerField()
    task_done = models.PositiveIntegerField()
    tasks_unit_tested = models.PositiveIntegerField()
    tasks_integration_tested = models.PositiveIntegerField()
    tasks_bug_discovered = models.PositiveIntegerField()
    tasks_bug_undiscovered = models.PositiveIntegerField()
    tasks_done_wrong_specification = models.PositiveIntegerField()

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
    # Maybe more actions soon

    # Members
    # members = List[HistoryMemberStatus]
    # memberChanges = List[HistoryMembersChange]

    # Model Selection
    model = models.TextField(max_length=64)

    # Event (ToDo)
