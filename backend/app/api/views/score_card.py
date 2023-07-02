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

            budget_p: float = float(request.data.get('budget_p'))
            time_p: float = float(request.data.get('time_p'))
            quality_k: float = float(request.data.get('quality_k'))

            if budget_p > 1 or budget_p < 0:
                raise ValueError(
                    f"budget_p value {budget_p} is not valid. budget_p should be >= 0 and <= 1")

            if time_p > 1 or time_p < 0:
                raise ValueError(
                    f"time_p value {time_p} is not valid. time_p should be >= 0 and <= 1")

            if quality_k > 1 or quality_k < 0:
                raise ValueError(
                    f"quality_k value {quality_k} is not valid. quality_k should be >= 0 and <= 1")

            sc.budget_p = budget_p
            sc.time_p = time_p
            sc.quality_k = quality_k

            sc.save()

            return Response({"data": ScoreCardSerializer(sc).data}, status=status.HTTP_200_OK)
        except ScoreCard.DoesNotExist:
            return Response(
                {
                    "error": f"Template scenario {scenario_id} has no Score Card.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        except ValueError as e:
            return Response(
                {
                    "error": f"{str(e)}",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        except:
            return Response(
                {
                    "error": "Somthing went wrong",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
