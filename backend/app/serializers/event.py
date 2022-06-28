from rest_framework import serializers

from app.models.event import Event, EventEffect


# class EventTriggerSerializer(serializers.Serializer):
#     type = serializers.CharField(max_length=64)
#     value = serializers.FloatField()
#     comparator = serializers.CharField(max_length=2)


class EventEffectSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventEffect
        fields = "__all__"


class EventSerializer(serializers.ModelSerializer):

    effects = EventEffectSerializer(many=True)

    class Meta:
        model = Event
        fields = "__all__"
