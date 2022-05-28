from asyncio import tasks
import logging
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response

from app.decorators.decorators import allowed_roles
from app.dto.request import Workpack, QuestionRequest, ModelRequest
from app.exceptions import (
    SimulationException,
    RequestTypeException,
    RequestActionException,
    RequestMembersException,
)
from app.models.scenario import ScenarioConfig
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.decorators import api_view
from app.models.team import Member, SkillType, Team
from app.models.template_scenario import TemplateScenario

from django.core.exceptions import ObjectDoesNotExist
from rest_framework.decorators import api_view

from app.models.scenario import ScenarioConfig
from app.models.team import Team
from app.models.template_scenario import TemplateScenario

from app.models.user_scenario import ScenarioState, UserScenario
from app.models.task import Task
from app.serializers.user_scenario import UserScenarioSerializer
from app.serializers.team import MemberSerializer
from app.serializers.question import QuestionSerializer
from app.src.simulation import continue_simulation
from app.dto.request import SimulationRequest

from rest_framework.views import APIView

from app.src.util.scenario_util import create_correct_request_model
from history.serializers.history import HistorySerializer
from history.models.history import History


@method_decorator(csrf_protect, name="dispatch")
class HistoryView(APIView):
    permission_classes = (IsAuthenticated,)

    @allowed_roles(["student"])
    def post(self, request):
        scenario: UserScenario = UserScenario.objects.get(id=12)
        h = History(
            type="SIMULATION",
            user_scenario=scenario,
            counter=scenario.state.counter,
            day=scenario.state.day,
            cost=scenario.state.cost,
            tasks_todo=0,
            task_done=0,
            tasks_unit_tested=0,
            tasks_integration_tested=0,
            tasks_bug_discovered=0,
            tasks_bug_undiscovered=0,
            tasks_done_wrong_specification=0,
            model="scrum",
        )
        h.save()

        return Response(data={"id": h.id}, status=status.HTTP_201_CREATED)

    @allowed_roles(["student"])
    def get(self, request, id=None):
        try:
            h = History.objects.get(id=id)
            s = HistorySerializer(h)
            return Response(data=s.data, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            msg = f"History entry with id {id} does not exist"
            logging.warn(msg)
            return Response(
                data={"status": "error", "data": msg},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            msg = f"{e.__class__.__name__} occurred when trying to access history entry {id}"
            logging.warn(msg)
            return Response(
                data={"status": "error", "data": msg},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
