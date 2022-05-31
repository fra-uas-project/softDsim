from rest_framework import serializers

from app.models.action import Action
from app.models.decision import Decision
from app.models.text_block import TextBlock

from app.serializers.action import ActionSerializer
from app.serializers.text_block import TextBlockSerializer


class DecisionSerializer(serializers.ModelSerializer):

    text_block = TextBlockSerializer(many=True)
    actions = ActionSerializer(many=True)

    class Meta:
        model = Decision
        fields = ("index", "continue_text", "points", "text_block", "actions")

    def create(self, validated_data):
        text_block_data = validated_data.pop("text_block")
        actions_data = validated_data.pop("actions")
        decision = Decision.objects.create(**validated_data)

        for data in text_block_data:
            TextBlock.objects.create(decision=decision, **data)

        for data in actions_data:
            Action.objects.create(decision=decision, **data)

        return decision
