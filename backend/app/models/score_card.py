from django.db import models

from app.models.template_scenario import TemplateScenario
from django.core.validators import MaxValueValidator, MinValueValidator, MaxLengthValidator


class ScoreCard(models.Model):
    id = models.AutoField(primary_key=True)
    budget_limit = models.PositiveIntegerField(default=100)
    time_limit = models.PositiveIntegerField(default=100)
    quality_limit = models.PositiveIntegerField(default=100)
    budget_p = models.FloatField(default=1.0, validators=[MinValueValidator(0), MaxValueValidator(2)])
    time_p = models.FloatField(default=1.0, validators=[MinValueValidator(0), MaxValueValidator(2)])
    quality_k = models.FloatField(default=1.0, validators=[MinValueValidator(0), MaxValueValidator(8)])

    template_scenario = models.OneToOneField(
        TemplateScenario, on_delete=models.CASCADE, related_name="score_card", null=True
    )
