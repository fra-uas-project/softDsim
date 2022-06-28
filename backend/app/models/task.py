import logging
import time
from typing import Set
from django.db import models
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


class TaskStatus:  # do not use this anylonger
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
            user_scenario_id=scenario_id, integration_tested=True,
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
        """Returns all tasks that are done for the current UserScenario."""
        return Task.objects.filter(done=True, user_scenario_id=scenario_id)

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


class CachedTasks:
    """This is a verison of the TasksStatus class that is somehow cached. You
    can use it by instantiating one object by passing the scenario_id. Then use 
    it to get and update tasks as long as you want and in the end call the save
    method to save the changes to the database.
    """

    def __init__(self, scenario_id):
        start = time.perf_counter()
        self.tasks: Set[Task] = set(Task.objects.filter(user_scenario_id=scenario_id))
        logging.info(f"Getting Tasks took {time.perf_counter() - start} seconds")
        # todo raise if no scenario exists

    def todo(self) -> QuerySet:
        """Returns all tasks that are not yet done."""
        return set(filter(lambda t: not t.done, self.tasks))

    def done(self) -> Set[Task]:
        """Returns all tasks that are done, but not yet tested. Includes tasks with and
        without bug"""
        return set(
            filter(
                lambda t: t.done and not t.unit_tested and not t.integration_tested,
                self.tasks,
            )
        )

    def unit_tested(self) -> Set[Task]:
        """Returns all tasks that are successfully unit tested (no bug found)"""
        return set(
            filter(
                lambda t: t.done
                and not t.bug
                and t.unit_tested
                and not t.integration_tested,
                self.tasks,
            )
        )

    def integration_tested(self) -> Set[Task]:
        """Returns all tasks that are successfully integration tested."""
        return set(filter(lambda t: t.integration_tested, self.tasks))

    def bug(self) -> Set[Task]:
        """Returns all tasks that are done, but a bug was found by a unit test."""
        return set(filter(lambda t: t.done and t.bug and t.unit_tested, self.tasks))

    def bug_undiscovered(self) -> Set[Task]:
        """Returns all tasks that have a bug that is unknown to the team/user"""
        return set(filter(lambda t: t.done and t.bug and not t.unit_tested, self.tasks))

    def done_wrong_specification(self) -> Set[Task]:
        """Returns all tasks that were done with a wrong specification unknown to the team/user"""
        return set(
            filter(lambda t: t.done and not t.correct_specification, self.tasks,)
        )

    def solved(self) -> Set[Task]:
        """Returns all tasks that are done for the current UserScenario."""
        return set(filter(lambda t: t.done, self.tasks,))

    def accepted(self) -> Set[Task]:
        """Returns all tasks that are accepted by customer."""
        return set(
            filter(
                lambda t: t.done and not t.bug and t.correct_specification, self.tasks,
            )
        )

    def rejected(self) -> Set[Task]:
        """Returns all tasks that are rejected by customer."""
        return {t for t in self.tasks if t not in self.accepted()}

    def save(self):
        """Bulk updates all tasks to database."""
        start = time.perf_counter()
        Task.objects.bulk_update(
            self.tasks,
            [
                "done",
                "bug",
                "unit_tested",
                "integration_tested",
                "correct_specification",
            ],
        )
        logging.warning(f"Saving tasks took {time.perf_counter() - start} seconds")
