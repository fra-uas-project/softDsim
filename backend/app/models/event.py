from django.db import models

from app.models.template_scenario import TemplateScenario


class Event(models.Model):

    text = models.TextField()

    trigger_type = models.TextField(max_length=64, null=True, blank=True)
    trigger_value = models.FloatField(null=True, blank=True)
    trigger_comparator = models.TextField(max_length=2, null=True, blank=True)

    template_scenario = models.ForeignKey(
        TemplateScenario,
        on_delete=models.CASCADE,
        related_name="events",
        blank=True,
        null=True,
    )


class EventEffect(models.Model):
    type = models.TextField(max_length=64, null=True, blank=True)
    value = models.FloatField(null=True, blank=True)
    easy_tasks = models.PositiveIntegerField(default=0, null=True, blank=True)
    medium_tasks = models.PositiveIntegerField(default=0, null=True, blank=True)
    hard_tasks = models.PositiveIntegerField(default=0, null=True, blank=True)

    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name="effects",
        blank=True,
        null=True,
    )
