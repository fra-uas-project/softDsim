from django.db import models

from app.models.template_scenario import TemplateScenario


class ScoreCard(models.Model):
    id = models.AutoField(primary_key=True)
    budget_limit = models.PositiveIntegerField(default=100)
    time_limit = models.PositiveIntegerField(default=100)
    quality_limit = models.PositiveIntegerField(default=100)
    budget_p = models.FloatField(default=1.0)
    time_p = models.FloatField(default=1.0)
    quality_k = models.FloatField(default=1.0)

    template_scenario = models.OneToOneField(
        TemplateScenario, on_delete=models.CASCADE, related_name="score_card", null=True
    )
