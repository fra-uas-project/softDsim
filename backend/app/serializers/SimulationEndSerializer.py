from rest_framework import serializers

from app.models.simulation_end import SimulationEnd


class SimulationEndSerializer(serializers.ModelSerializer):
    class Meta:
        model = SimulationEnd
        fields = "__all__"
