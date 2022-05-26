from rest_framework import serializers

from app.models.action import Action
from app.models.model_selection import ModelSelection


class ModelSelectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModelSelection
        fields = "__all__"
