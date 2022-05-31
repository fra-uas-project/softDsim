from django.db import models

from app.models.question import Question


class Answer(models.Model):

    id = models.AutoField(primary_key=True)
    label = models.TextField(default="answer")
    points = models.PositiveIntegerField(default=0)

    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name="answers",
        blank=True,
        null=True,
    )
