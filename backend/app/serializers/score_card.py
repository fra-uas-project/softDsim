from rest_framework import serializers

from app.models.score_card import ScoreCard


class ScoreCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScoreCard
        fields = ("easy", "medium", "hard")
