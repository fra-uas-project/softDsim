from rest_framework import serializers

from app.models.action import Action
from app.models.score_card import ScoreCard
from app.models.simulation import Simulation
from app.models.text_block import TextBlock
from app.serializers.action import ActionSerializer
from app.serializers.score_card import ScoreCardSerializer
from app.serializers.text_block import TextBlockSerializer


class SimulationSerializer(serializers.ModelSerializer):
    text_block = TextBlockSerializer(many=True)
    actions = ActionSerializer(many=True)
    score_card = ScoreCardSerializer()

    class Meta:
        model = Simulation
        fields = ("points", "continue_text", "text_block", "actions", "score_card")

    def create(self, validated_data):
        """
        This method is not finished.
        The application works for now, since the simulation object is never created on its own,
        the simulation object is only created by the template_scenario_serializer (which handles creation of all nested models)
        If the simulation model has to be created on its own, this create method has to be adjusted for nested serialization.
        """
        text_block_data = validated_data.pop("text_block")
        actions_data = validated_data.pop("actions")
        score_card_data = validated_data.pop("score_card")

        simulation = Simulation.objects.create(**validated_data)

        for data in text_block_data:
            TextBlock.objects.create(simulation=simulation, **data)

        for data in actions_data:
            Action.objects.create(simulation=simulation, **data)

        ScoreCard.objects.create(simulation=simulation, **score_card_data)

        return Simulation
