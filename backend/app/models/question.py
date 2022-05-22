from django.db import models

from app.models.question_collection import QuestionCollection


class Question(models.Model):
    id = models.AutoField(primary_key=True)
    text = models.TextField()
    index = models.PositiveIntegerField()
    multi = models.BooleanField()

    question_collection = models.ForeignKey(
        QuestionCollection,
        on_delete=models.CASCADE,
        related_name="questions",
        blank=True,
        null=True,
    )
