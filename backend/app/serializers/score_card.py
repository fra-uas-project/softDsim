from rest_framework import serializers

from app.models.score_card import ScoreCard


class ScoreCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScoreCard
        fields = (
            "id",
            "budget_limit",
            "time_limit",
            "quality_limit",
            "budget_p",
            "time_p",
            "quality_k",
        )
