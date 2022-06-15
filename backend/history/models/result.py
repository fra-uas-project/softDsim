from django.db import models
from app.models.user_scenario import UserScenario


class Result(models.Model):
    user_scenario = models.ForeignKey(
        UserScenario, on_delete=models.CASCADE, related_name="result"
    )
    # Total number of points reached
    total_score = models.PositiveSmallIntegerField(default=0)

    # Timestemp of Moment the sceanrio was finished
    timestamp = models.DateTimeField(auto_now=True)

    # State of the scenario when the result was created
    total_steps = models.PositiveIntegerField(default=0)
    total_days = models.PositiveIntegerField(default=0)
    total_cost = models.FloatField(default=0)

    # Tasks state of the scenario when the result was created
    tasks_todo = models.PositiveIntegerField(default=0)
    tasks_done = models.PositiveIntegerField(default=0)
    tasks_unit_tested = models.PositiveIntegerField(default=0)
    tasks_integration_tested = models.PositiveIntegerField(default=0)
    tasks_bug_discovered = models.PositiveIntegerField(default=0)
    tasks_bug_undiscovered = models.PositiveIntegerField(default=0)
    tasks_done_wrong_specification = models.PositiveIntegerField(default=0)

    # Tasks as seen by customer
    tasks_accepted = models.PositiveIntegerField(default=0)
    tasks_rejected = models.PositiveIntegerField(default=0)

    # Total Score for category tasks (simulation fragments)
    quality_score = models.PositiveSmallIntegerField(default=0)

    # Total Score for time (simulation fragments)
    time_score = models.PositiveSmallIntegerField(default=0)

    # Total Score for cost (simulation fragments)
    budget_score = models.PositiveSmallIntegerField(default=0)

    # Total Score for category questions (question collections)
    question_score = models.PositiveSmallIntegerField(default=0)

    # Members
    # Should we score the members status? Happy mambers are worth more points?

    # Model Selection
    model = models.TextField(max_length=64, default="none")
