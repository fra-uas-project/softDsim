from django.db import models

from app.models.template_scenario import TemplateScenario


class Simulation(models.Model):
    id = models.AutoField(primary_key=True)
    continue_text = models.TextField()
    points = models.PositiveIntegerField()
    # text: List[TextBlock]
    # actions: List[Action]
    # score_card: ScoreCard

    template_scenario = models.OneToOneField(
        TemplateScenario, on_delete=models.CASCADE, related_name="simulation"
    )

    # template_scenario = models.ForeignKey(
    #     TemplateScenario,
    #     on_delete=models.CASCADE,
    #     related_name="simulation",
    #     blank=True,
    #     null=True,
    # )
