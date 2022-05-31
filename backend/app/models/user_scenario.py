from django.db import models

from app.models.scenario import ScenarioConfig
from app.models.template_scenario import TemplateScenario

from app.models.team import Team
from custom_user.models import User


class ScenarioState(models.Model):
    counter = models.IntegerField(default=0)
    cost = models.FloatField(default=0)
    day = models.IntegerField(default=0)


class UserScenario(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    config = models.ForeignKey(
        ScenarioConfig, on_delete=models.SET_NULL, null=True, blank=True
    )
    team = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, blank=True)
    state = models.OneToOneField(
        ScenarioState, on_delete=models.SET_NULL, null=True, blank=True
    )
    model = models.CharField(max_length=8, null=True, blank=True)
    template = models.ForeignKey(TemplateScenario, on_delete=models.SET_NULL, null=True)
