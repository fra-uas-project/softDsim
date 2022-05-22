from rest_framework import serializers

from app.models.answer import Answer
from app.models.question import Question

from app.serializers.answer import AnswerSerializer


class QuestionSerializer(serializers.ModelSerializer):

    answer = AnswerSerializer(many=True)

    class Meta:
        model = Question
        fields = ("id", "index", "text", "multi", "answer")

    def create(self, validated_data):
        answer_data = validated_data.pop("answer")
        question = Question.objects.create(**validated_data)

        for data in answer_data:
            Answer.objects.create(question=question, **data)

        return question
