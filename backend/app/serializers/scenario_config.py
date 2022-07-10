from app.models.scenario import ScenarioConfig
from rest_framework import serializers


class ScenarioConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScenarioConfig
        fields = "__all__"
