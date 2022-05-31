from rest_framework import serializers

from app.models.question_collection import QuestionCollection
from app.serializers.question import QuestionSerializer


class QuestionCollectionSerializer(serializers.ModelSerializer):

    questions = QuestionSerializer(many=True)

    class Meta:
        model = QuestionCollection
        fields = ("id", "index", "questions")

    # todo philip: add create method
