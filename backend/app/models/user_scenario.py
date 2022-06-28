import logging
from django.db import models
from app.dto.response import ManagementGoalDTO
from app.models.management_goal import ManagementGoal

from app.models.scenario import ScenarioConfig
from app.models.template_scenario import TemplateScenario

from custom_user.models import User


class UserScenario(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    config = models.ForeignKey(
        ScenarioConfig, on_delete=models.SET_NULL, null=True, blank=True
    )
    model = models.CharField(max_length=16, null=True, blank=True)
    template = models.ForeignKey(TemplateScenario, on_delete=models.SET_NULL, null=True)
    question_points = models.PositiveIntegerField(default=0, blank=True, null=True)
    ended = models.BooleanField(default=False)
    # team = app.models.team.Team
    # state = State

    def get_management_goal_dto(self) -> ManagementGoalDTO:
        try:
            mgoal: ManagementGoal = self.template.management_goal
            return ManagementGoalDTO(
                budget=mgoal.budget,
                duration=mgoal.duration,
                tasks=sum((mgoal.easy_tasks, mgoal.medium_tasks, mgoal.hard_tasks)),
            )
        except Exception as e:
            logging.error(e)
        return ManagementGoalDTO(budget=-1, duration=-1)


class ScenarioState(models.Model):

    # counter for the components of the scenario
    component_counter = models.IntegerField(default=0)

    # counter for each step of the scenario simulation
    step_counter = models.IntegerField(default=0)

    cost = models.FloatField(default=0)
    day = models.IntegerField(default=0)

    budget = models.IntegerField(default=0)
    total_tasks = models.IntegerField(default=0)

    user_scenario = models.OneToOneField(
        UserScenario,
        on_delete=models.CASCADE,
        related_name="state",
        null=True,
        blank=True,
    )

    # events_happened = List[EventsHappened]


class EventStatus(models.Model):

    event_id = models.IntegerField()
    has_happened = models.BooleanField(default=False)

    state = models.ForeignKey(
        ScenarioState,
        on_delete=models.CASCADE,
        related_name="event_status",
        null=True,
        blank=True,
    )
