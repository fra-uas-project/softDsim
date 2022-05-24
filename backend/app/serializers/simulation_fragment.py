from rest_framework import serializers

from app.models.action import Action
from app.models.simulation_fragment import SimulationFragment
from app.serializers.SimulationEndSerializer import SimulationEndSerializer
from app.serializers.action import ActionSerializer


class SimulationFragmentSerializer(serializers.ModelSerializer):
    actions = ActionSerializer(many=True)
    simulation_end = SimulationEndSerializer()

    class Meta:
        model = SimulationFragment
        fields = ("points", "text", "actions", "index", "simulation_end")

    # todo philip: rework create method
    def create(self, validated_data):
        """
        This method is not finished.
        The application works for now, since the simulation object is never created on its own,
        the simulation object is only created by the template_scenario_serializer (which handles creation of all nested models)
        If the simulation model has to be created on its own, this create method has to be adjusted for nested serialization.
        """
        actions_data = validated_data.pop("actions")

        simulation = SimulationFragment.objects.create(**validated_data)

        for data in actions_data:
            Action.objects.create(simulation=simulation, **data)

        return simulation
