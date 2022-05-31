from rest_framework import serializers

from app.models.text_block import TextBlock


class TextBlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = TextBlock
        fields = ("header", "content")
