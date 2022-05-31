from rest_framework import serializers

from app.models.action import Action
from app.models.answer import Answer
from app.serializers.answer import AnswerSerializer


class ActionSerializer(serializers.ModelSerializer):

    answers = AnswerSerializer(many=True)

    class Meta:
        model = Action
        fields = ("title", "typ", "active", "required", "answers")

    def create(self, validated_data):
        answer_data = validated_data.pop("text")
        action = Action.objects.create(**validated_data)
        for answer_data in answer_data:
            Answer.objects.create(action=action, **answer_data)

        return action
