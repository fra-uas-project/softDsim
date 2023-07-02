import logging

from django.core.exceptions import ObjectDoesNotExist
from custom_user.models import User
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from app.cache.scenario import CachedScenario
from app.decorators.decorators import allowed_roles, has_access_to_scenario

from app.models.template_scenario import TemplateScenario
from app.models.score_card import ScoreCard
from app.serializers.score_card import ScoreCardSerializer


class ScoreCardView(APIView):
    permission_classes = (IsAuthenticated,)

    @allowed_roles(["creator"])
    def get(self, request, scenario_id=None):
        if scenario_id is None:
            return Response(
                {
                    "error": "Template Scenario Id is not provided",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            TemplateScenario.objects.get(pk=scenario_id)
        except TemplateScenario.DoesNotExist:
            return Response(
                {
                    "error": f"Template {scenario_id} not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            sc: ScoreCard = ScoreCard.objects.get(
                template_scenario__id=scenario_id
            )

            return Response(ScoreCardSerializer(sc).data)
        except ScoreCard.DoesNotExist:
            return Response(
                {
                    "error": f"Template scenario {scenario_id} has no Score Card.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        except:
            return Response(
                {
                    "error": "Somthing went wrong",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @allowed_roles(["creator"])
    def put(self, request, scenario_id=None):
        pass
