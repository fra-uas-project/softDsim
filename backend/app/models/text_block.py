from django.db import models

from app.models.decision import Decision
from app.models.simulation import Simulation


class TextBlock(models.Model):

    id = models.AutoField(primary_key=True)
    header = models.TextField()
    content = models.TextField()

    decision = models.ForeignKey(
        Decision,
        on_delete=models.CASCADE,
        related_name="text_block",
        blank=True,
        null=True,
    )

    simulation = models.ForeignKey(
        Simulation,
        on_delete=models.CASCADE,
        related_name="text_block",
        blank=True,
        null=True,
    )
