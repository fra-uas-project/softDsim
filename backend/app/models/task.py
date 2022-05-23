from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

from app.models.user_scenario import UserScenario


class Task(models.Model):
    difficulty = models.PositiveIntegerField()
    done = models.BooleanField(default=False)
    bug = models.BooleanField(default=False)
    correct_specification = models.BooleanField(default=True)
    unit_tested = models.BooleanField(default=False)
    integration_tested = models.BooleanField(default=False)
    predecessor = models.ForeignKey(
        "self", on_delete=models.SET_NULL, blank=True, null=True
    )

    user_scenario = models.ForeignKey(
        UserScenario, on_delete=models.CASCADE, related_name="tasks"
    )
