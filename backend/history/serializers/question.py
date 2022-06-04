from rest_framework import serializers

from app.serializers.question import QuestionSerializer, AnswerSerializer

from history.models.question import HistoryQuestion, HistoryAnswer


class HistoryAnswerSerializer(serializers.ModelSerializer):
    answer = AnswerSerializer()

    class Meta:
        model = HistoryAnswer
        fields = ["answer", "answer_selection"]


class HistoryQuestionSerializer(serializers.ModelSerializer):
    answers = HistoryAnswerSerializer(many=True)
    question = QuestionSerializer()

    class Meta:
        model = HistoryQuestion
        fields = ["question", "answers"]
