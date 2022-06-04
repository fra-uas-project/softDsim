from django.db import models

from app.models.simulation_fragment import SimulationFragment


class SimulationEnd(models.Model):
    limit = models.FloatField()
    type = models.TextField(max_length=16)
    limit_type = models.TextField(max_length=2)  # ge or le

    simulation_fragment = models.OneToOneField(
        SimulationFragment,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="simulation_end",
    )
