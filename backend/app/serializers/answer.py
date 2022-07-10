from rest_framework import serializers

from app.models.answer import Answer


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ("id", "label", "points")
