from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from app.models.question_collection import QuestionCollection
from app.serializers.question_collection import QuestionCollectionSerializer


class QuestionCollectionView(APIView):
    def get(self, request):
        question_collections = QuestionCollection.objects.all()
        serializer = QuestionCollectionSerializer(question_collections, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
