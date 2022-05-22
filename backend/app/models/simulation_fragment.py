from django.db import models

from app.models.template_scenario import TemplateScenario


class SimulationFragment(models.Model):
    id = models.AutoField(primary_key=True)
    index = models.PositiveIntegerField()
    text = models.TextField()
    points = models.PositiveIntegerField()
    # actions: List[Action]

    template_scenario = models.ForeignKey(
        TemplateScenario,
        on_delete=models.CASCADE,
        related_name="simulation_fragments",
        blank=True,
        null=True,
    )

    # template_scenario = models.OneToOneField(
    #     TemplateScenario, on_delete=models.CASCADE, related_name="simulation"
    # )
