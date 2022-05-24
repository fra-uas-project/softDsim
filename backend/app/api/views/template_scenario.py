import logging
from deprecated.classic import deprecated
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from app.decorators.decorators import allowed_roles
from app.models.template_scenario import TemplateScenario
from app.serializers.template_scenario import TemplateScenarioSerializer


class TemplateScenarioView(APIView):

    permission_classes = (IsAuthenticated,)

    @allowed_roles(["student", "creator", "staff"])
    def get(self, request, scenario_id=None, format=None):

        try:
            if scenario_id:
                template_scenario = TemplateScenario.objects.get(id=scenario_id)
                serializer = TemplateScenarioSerializer(template_scenario, many=False)
                return Response(serializer.data, status=status.HTTP_200_OK)

            template_scenarios = TemplateScenario.objects.all()
            serializer = TemplateScenarioSerializer(template_scenarios, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logging.error(f"{e.__class__.__name__} occurred in GET template-scenario")
            logging.error(f"{str(e)} occurred in GET template-scenario")
            return Response(
                {
                    "error": "something went wrong on server side (except clause)",
                    "data": str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @allowed_roles(["creator", "staff"])
    def post(self, request):

        try:
            serializer = TemplateScenarioSerializer(data=request.data, many=False)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {"status": "Template Scenario saved", "data": serializer.data},
                    status=status.HTTP_200_OK,
                )
            else:
                logging.error("Data for template scenario is not valid")
                logging.debug(serializer.errors)
                return Response(
                    {"status": "Data is not valid", "error": serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except Exception as e:
            logging.error(f"{e.__class__.__name__} occurred in POST template-scenario")
            logging.error(f"{str(e)} occurred in POST template-scenario")
            return Response(
                {"status": "something went wrong internally", "data": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @allowed_roles(["creator", "staff"])
    def delete(self, request, scenario_id=None):

        try:
            template_scenario = get_object_or_404(TemplateScenario, id=scenario_id)
            serializer = TemplateScenarioSerializer(template_scenario)
            template_scenario.delete()

            return Response(
                {
                    "status": "delete successful",
                    "data": {"name": serializer.data.get("name")},
                }
            )

        except Exception as e:
            logging.error(
                f"{e.__class__.__name__} occurred in DELETE template-scenario with id {id}"
            )
            return Response(
                {"status": "something went wrong internally"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @allowed_roles(["creator", "staff"])
    def patch(self, request, scenario_id=None):

        try:
            template_scenario = TemplateScenario.objects.get(id=scenario_id)
            serializer = TemplateScenarioSerializer(
                template_scenario, data=request.data, partial=True
            )
            if serializer.is_valid():
                serializer.save()
                return Response({"status": "success", "data": serializer.data})
            else:
                logging.error("Could not patch template scenario")
                logging.debug(serializer.errors)
                return Response({"status": "error", "data": serializer.errors})

        except Exception as e:
            logging.error(
                f"{e.__class__.__name__} occurred in PATCH template-scenario with id {id}"
            )
            return Response(
                {"status": "something went wrong internally"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
