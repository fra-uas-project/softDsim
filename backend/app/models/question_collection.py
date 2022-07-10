from django.db import models

from app.models.template_scenario import TemplateScenario


class QuestionCollection(models.Model):

    id = models.AutoField(primary_key=True)
    index = models.PositiveIntegerField()
    text = models.TextField(default="", blank=True, null=True)
    # questions: List[Question]

    template_scenario = models.ForeignKey(
        TemplateScenario,
        on_delete=models.CASCADE,
        related_name="question_collections",
        blank=True,
        null=True,
    )
