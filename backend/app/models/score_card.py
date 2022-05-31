from django.db import models

from app.models.simulation import Simulation


class ScoreCard(models.Model):
    id = models.AutoField(primary_key=True)
    easy = models.PositiveIntegerField()
    medium = models.PositiveIntegerField()
    hard = models.PositiveIntegerField()

    simulation = models.OneToOneField(
        Simulation, on_delete=models.CASCADE, related_name="score_card"
    )
