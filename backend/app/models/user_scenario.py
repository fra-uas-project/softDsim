from django.db import models

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
    # team = app.models.team.Team
    # state = State


class ScenarioState(models.Model):

    # counter for the components of the scenario
    component_counter = models.IntegerField(default=0)

    # counter for each step of the scenario simulation
    step_counter = models.IntegerField(default=0)

    cost = models.FloatField(default=0)
    day = models.IntegerField(default=0)

    user_scenario = models.OneToOneField(
        UserScenario,
        on_delete=models.CASCADE,
        related_name="state",
        null=True,
        blank=True,
    )
