from django.db import models

from app.models.template_scenario import TemplateScenario


class Event(models.Model):
    # class Meta:
    #     abstract = True

    text = models.TextField()
    trigger_type = (models.TextField(max_length=64, null=True, blank=True),)
    trigger_value = models.FloatField(null=True, blank=True)
    effect_type = models.TextField(max_length=64, null=True, blank=True)
    effect_value = models.FloatField(null=True, blank=True)
    has_occured = models.BooleanField(default=False)

    template_scenario = models.ForeignKey(
        TemplateScenario,
        on_delete=models.CASCADE,
        related_name="events",
        blank=True,
        null=True,
    )
