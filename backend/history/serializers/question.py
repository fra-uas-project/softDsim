from rest_framework import serializers

from history.models.question import HistoryQuestion, HistoryAnswer


class HistoryAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoryAnswer
        fields = "__all__"


class HistoryQuestionSerializer(serializers.ModelSerializer):
    answers = HistoryAnswerSerializer(many=True)

    class Meta:
        model = HistoryQuestion
        fields = ["question", "answers"]
