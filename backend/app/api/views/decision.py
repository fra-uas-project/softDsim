from deprecated.classic import deprecated
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from app.decorators.decorators import allowed_roles
from app.models.template_scenario import TemplateScenario
from app.serializers.decision import DecisionSerializer
from app.serializers.template_scenario import TemplateScenarioSerializer


class DecisionView(APIView):

    permission_classes = (IsAuthenticated,)

    @allowed_roles(["student", "creator", "staff"])
    def get(self, request, scenario_id=None, format=None):

        # try:
        if scenario_id:

            template_scenario = TemplateScenario.objects.get(id=scenario_id)
            serializer = TemplateScenarioSerializer(template_scenario, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)

        template_scenarios = TemplateScenario.objects.all()
        serializer = TemplateScenarioSerializer(template_scenarios, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    # except:
    #     return Response(
    #         {"error": "something went wrong on server side (except clause)"},
    #         status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    #     )

    @allowed_roles(["creator", "staff"])
    def post(self, request):

        # try:
        serializer = DecisionSerializer(data=request.data, many=False)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"status": "Decision saved", "data": serializer.data},
                status=status.HTTP_200_OK,
            )
        else:
            print(serializer.errors)
            return Response(
                {"status": "Data is not valid", "error": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
        # except:
        #     return Response(
        #         {"status": "something went wrong internally"},
        #         status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        #     )

    @allowed_roles(["creator", "staff"])
    def delete(self, request, scenario_id=None):
        template_scenario = get_object_or_404(TemplateScenario, id=scenario_id)
        template_scenario_save = template_scenario
        template_scenario.delete()

        return Response({"status": "delete successful", "data": template_scenario_save})

    # todo philip: implement patch
    # def patch(self, request, scenario_id=None):
    #     template_scenario = TemplateScenario.objects.get(id=scenario_id)
