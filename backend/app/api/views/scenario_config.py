from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from app.decorators.decorators import allowed_roles
from app.serializers.scenario_config import ScenarioConfig, ScenarioConfigSerializer

from app.models.scenario import ScenarioConfig


class ScenarioConfigView(APIView):
    permission_classes = (IsAuthenticated,)

    @allowed_roles(["creator", "staff"])
    def post(self, request):
        serializer = ScenarioConfigSerializer(data=request.data)
        if serializer.is_valid():
            serializer.validated_data['id'] = 1
            serializer.save()
            return Response(
                {"status": "success", "data": serializer.data},
                status=status.HTTP_200_OK,
            )
        else:
            print("ScenarioConfig is Invalid")
            return Response(
                {"status": "error", "data": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

    @allowed_roles(["student", "creator", "staff"])
    def get(self, request, id=None):
        if id:
            if str(id).isnumeric():
                item = ScenarioConfig.objects.get(id=id)
            else:
                item = ScenarioConfig.objects.get(name=id)
            serializer = ScenarioConfigSerializer(item)
            return Response(
                {"status": "success", "data": serializer.data},
                status=status.HTTP_200_OK,
            )

        items = ScenarioConfig.objects.all()
        serializer = ScenarioConfigSerializer(items, many=True)
        return Response(
            {"status": "success", "data": serializer.data}, status=status.HTTP_200_OK
        )

    @allowed_roles(["creator", "staff"])
    def patch(self, request, id=None):
        item = ScenarioConfig.objects.get(id=id)
        serializer = ScenarioConfigSerializer(item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", "data": serializer.data})
        else:
            return Response({"status": "error", "data": serializer.errors})

    @allowed_roles(["creator", "staff"])
    def delete(self, request, id=None):
        item = get_object_or_404(ScenarioConfig, id=id)
        item.delete()
        return Response({"status": "success", "data": "Item Deleted"})
