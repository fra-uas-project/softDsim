from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db.models import QuerySet

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

    # Methods to get tasks by their state


class TaskStatus:
    def todo(scenario_id) -> QuerySet:
        """Returns all tasks that are not yet done."""
        return Task.objects.filter(user_scenario_id=scenario_id, done=False)

    def done(scenario_id) -> QuerySet:
        """Returns all tasks that are done, but not yet tested. Includes tasks with and
        without bug"""
        return Task.objects.filter(
            user_scenario_id=scenario_id,
            done=True,
            unit_tested=False,
            integration_tested=False,
        )

    def unit_tested(scenario_id) -> QuerySet:
        """Returns all tasks that are successfully unit tested (no bug found)"""
        return Task.objects.filter(
            user_scenario_id=scenario_id,
            done=True,
            bug=False,
            unit_tested=True,
            integration_tested=False,
        )

    def integration_tested(scenario_id) -> QuerySet:
        """Returns all tasks that are successfully integration tested."""
        return Task.objects.filter(
            user_scenario_id=scenario_id,
            integration_tested=True,
        )

    def bug(scenario_id) -> QuerySet:
        """Returns all tasks that are done, but a bug was found by a unit test."""
        return Task.objects.filter(
            user_scenario_id=scenario_id, done=True, unit_tested=True, bug=True
        )

    def bug_undiscovered(scenario_id) -> QuerySet:
        """Returns all tasks that have a bug that is unknown to the team/user"""
        return Task.objects.filter(
            user_scenario_id=scenario_id, done=True, unit_tested=False, bug=True
        )

    def done_wrong_specification(scenario_id) -> QuerySet:
        """Returns all tasks that were done with a wrong specification unknown to the team/user"""
        return Task.objects.filter(
            user_scenario_id=scenario_id, done=True, correct_specification=False
        )

    def solved(scenario_id) -> QuerySet:
        """Returns all tasks that are done."""
        return Task.objects.filter(done=True)

    def accepted(scenario_id) -> QuerySet:
        """Returns all tasks that are accepted by customer."""
        return Task.objects.filter(
            user_scenario_id=scenario_id,
            done=True,
            bug=False,
            correct_specification=True,
        )

    def rejected(scenario_id) -> QuerySet:
        """Returns all tasks that are rejected by customer."""
        all = Task.objects.filter(user_scenario_id=scenario_id)
        acc = TaskStatus.accepted(scenario_id)
        rej = all.exclude(id__in=acc)
        return rej
