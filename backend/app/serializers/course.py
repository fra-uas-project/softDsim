from rest_framework import serializers
from app.models.course import Course

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'name', 'scenarios', 'users']


class CourseNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['name']