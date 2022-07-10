from django.db import models

from app.models.template_scenario import TemplateScenario


class ModelSelection(models.Model):
    index = models.PositiveIntegerField()
    text = models.TextField()
    waterfall = models.BooleanField(default=True)
    kanban = models.BooleanField(default=True)
    scrum = models.BooleanField(default=True)
    text = models.TextField(default="", blank=True, null=True)

    template_scenario = models.ForeignKey(
        TemplateScenario,
        on_delete=models.CASCADE,
        related_name="model_selections",
        blank=True,
        null=True,
    )

    def models(self):
        return [m for m in ["waterfall", "scrum", "kanban"] if self.__getattribute__(m)]
