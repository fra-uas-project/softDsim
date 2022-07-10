from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated

from app.decorators.decorators import allowed_roles
from app.models.management_goal import ManagementGoal

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from app.serializers.management_goal import ManagementGoalSerializer


class ManagementGoalView(APIView):
    permission_classes = (IsAuthenticated,)

    @allowed_roles(["creator", "staff"])
    def post(self, request):
        serializer = ManagementGoalSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"status": "success", "data": serializer.data},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"status": "error", "data": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

    @allowed_roles(["student", "creator", "staff"])
    def get(self, request, id=None):
        if id:
            item = ManagementGoal.objects.get(id=id)
            serializer = ManagementGoalSerializer(item)
            return Response(
                {"status": "success", "data": serializer.data},
                status=status.HTTP_200_OK,
            )

        items = ManagementGoal.objects.all()
        serializer = ManagementGoalSerializer(items, many=True)
        return Response(
            {"status": "success", "data": serializer.data}, status=status.HTTP_200_OK
        )

    @allowed_roles(["creator", "staff"])
    def patch(self, request, id=None):
        item = ManagementGoal.objects.get(id=id)
        serializer = ManagementGoalSerializer(item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", "data": serializer.data})
        else:
            return Response({"status": "error", "data": serializer.errors})

    @allowed_roles(["creator", "staff"])
    def delete(self, request, id=None):
        item = get_object_or_404(ManagementGoal, id=id)
        item.delete()
        return Response({"status": "success", "data": "Item Deleted"})
