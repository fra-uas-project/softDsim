from django.db import models

from app.models.template_scenario import TemplateScenario


class Decision(models.Model):
    id = models.AutoField(primary_key=True)
    continue_text = models.TextField()
    points = models.PositiveIntegerField()
    index = models.PositiveIntegerField()
    # text: List[TextBlock] -> ForeignKey Reference is in TextBlock Model
    # actions: List[Action] -> ForeignKey Reference is in Action Model

    template_scenario = models.ForeignKey(
        TemplateScenario,
        on_delete=models.CASCADE,
        related_name="decisions",
        blank=True,
        null=True,
    )
