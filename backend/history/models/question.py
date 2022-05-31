from django.db import models

from app.models.answer import Answer
from app.models.question import Question

from history.models.history import History


class HistoryQuestion(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    history = models.ForeignKey(
        History, on_delete=models.CASCADE, related_name="questions"
    )
    # answers = List[HistoryAnswer]


class HistoryAnswer(models.Model):
    answer = models.ForeignKey(Answer, on_delete=models.CASCADE)
    question = models.ForeignKey(
        HistoryQuestion, on_delete=models.CASCADE, related_name="answers"
    )
    answer_selection = models.BooleanField()
