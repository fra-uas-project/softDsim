import logging

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from app.decorators.decorators import allowed_roles
from app.exceptions import (
    SimulationException,
    RequestTypeException,
    RequestActionException,
    RequestMembersException,
    RequestTypeMismatchException,
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


class StartUserScenarioView(APIView):
    permission_classes = (IsAuthenticated,)

    @allowed_roles(["student"])
    def post(self, request):
        template_id = request.data.get("template-id")
        config_id = request.data.get("config-id")

        try:
            template = TemplateScenario.objects.get(id=template_id)
        except ObjectDoesNotExist:
            msg = f"'{template_id}' is not a valid template-scenario id. Must provide attribute 'template-id'."
            logging.error(msg)
            return Response(
                {"status": "error", "data": msg}, status=status.HTTP_404_NOT_FOUND
            )
        try:
            config = ScenarioConfig.objects.get(id=config_id)
        except ObjectDoesNotExist:
            msg = f"'{config_id}' is not a valid scenario-config id. Must provide attribute 'config-id'."
            logging.error(msg)
            return Response(
                {"status": "error", "data": msg}, status=status.HTTP_404_NOT_FOUND
            )

        try:
            # Craete UserScenario
            user_scenario = UserScenario(
                user=request.user, template=template, config=config,
            )
            user_scenario.save()

            # Create ScenarioState
            state = ScenarioState(user_scenario=user_scenario)
            state.save()

            # Create Team
            team = Team(user_scenario=user_scenario)
            team.save()

            serializer = UserScenarioSerializer(user_scenario)
            # Create Tasks
            tasks = [  # easy
                Task(difficulty=1, user_scenario=user_scenario)
                for _ in range(template.management_goal.easy_tasks)
            ]
            tasks += [  # medium
                Task(difficulty=2, user_scenario=user_scenario)
                for _ in range(template.management_goal.medium_tasks)
            ]
            tasks += [  # hard
                Task(difficulty=3, user_scenario=user_scenario)
                for _ in range(template.management_goal.hard_tasks)
            ]
            # Add all tasks to database in a single insert
            Task.objects.bulk_create(tasks)
        except Exception as e:
            msg = f"'{e.__class__.__name__}' occurred when creating user scenario"
            logging.error(msg)
            logging.debug(e)
            return Response(
                {"status": "error", "data": msg},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(
            {"status": "success", "data": serializer.data},
            status=status.HTTP_201_CREATED,
        )


class NextStepView(APIView):
    permission_classes = (IsAuthenticated,)

    @allowed_roles(["all"])
    def post(self, request):
        scenario = auth_user_scenario(request)
        if isinstance(scenario, Response):
            return scenario

        # Check if request type is specified
        if request.data.get("type") is None:
            return Response(
                {
                    "status": "error",
                    "error-message": "Type of request was not specified. Type has to be one of the following: QUESTION, SIMULATION, MODEL",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        req = create_correct_request_model(request)
        try:
            response = continue_simulation(scenario, req)
            return Response(response.dict(), status=status.HTTP_200_OK)
        except (
            SimulationException,
            RequestTypeException,
            RequestActionException,
            RequestMembersException,
            RequestTypeMismatchException,
        ) as e:
            return Response(
                {"status": "error", "error-message": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            logging.error(str(e))
            return Response(
                {"status": "error", "data": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class AdjustMemberView(APIView):
    permission_classes = (IsAuthenticated,)

    @allowed_roles(["student"])
    def post(self, request, id=None):
        scenario = auth_user_scenario(request)
        if isinstance(scenario, Response):
            return scenario
        member_data = request.data.get("member")
        if str(member_data).isnumeric():
            skill_type = SkillType.objects.get(id=int(member_data))
        else:
            skill_type = SkillType.objects.get(name=member_data)
        member_obj = Member(team=scenario.team, skill_type=skill_type)
        member_obj.save()
        serializer = MemberSerializer(member_obj)
        return Response(
            data={"status": "success", "data": serializer.data},
            status=status.HTTP_201_CREATED,
        )

    @allowed_roles(["student"])
    def get(self, request, id=None):
        scenario = auth_user_scenario(request)
        if isinstance(scenario, Response):
            return scenario
        member_objs = Member.objects.filter(team=scenario.team)
        serializer = MemberSerializer(member_objs, many=True)
        return Response(
            data={"status": "success", "data": serializer.data},
            status=status.HTTP_200_OK,
        )

    @allowed_roles(["student"])
    def delete(self, request, id=None):
        scenario = auth_user_scenario(request)
        if isinstance(scenario, Response):
            return scenario
        try:
            member_to_delete = Member.objects.get(id=id)
            if member_to_delete.team == scenario.team:
                member_to_delete.delete()
                msg = f"Member with id {id} deleted."
                logging.info(msg)
                return Response(
                    data={"status": "success", "data": msg}, status=status.HTTP_200_OK,
                )
            else:
                msg = f"Member {id} does not belong to a team in user-scenario {scenario.id}"
                logging.warn(msg)
                return Response(
                    data={"status": "error", "data": msg},
                    status=status.HTTP_403_FORBIDDEN,
                )
        except ObjectDoesNotExist:
            msg = f"Member with id {id} does not exist."
            logging.warn(msg)
            return Response(
                data={"status": "error", "data": msg}, status=status.HTTP_404_NOT_FOUND
            )


def auth_user_scenario(request):
    """This functions can be used for each endpoint that deals with UserScenarios during
    a simulation. If the the scenario exists and the user is authorized to use it, the
    function returns the UserScenario object. If something is wrong, the function
    returns a Response object with a fitting description."""
    user = request.user
    scenario_id = request.data.get("scenario_id")
    if scenario_id is None:
        msg = "Attribute scenario-id must be provided"
        logging.error(msg)
        return Response({"status": "error", "data": msg}, status.HTTP_404_NOT_FOUND)

    try:
        scenario = UserScenario.objects.get(id=scenario_id)
    except ObjectDoesNotExist:
        msg = f"No UserScenario with id {scenario_id} found"
        logging.error(msg)
        return Response(
            {"status": "error", "data": msg}, status=status.HTTP_404_NOT_FOUND
        )

    if user.username == scenario.user.username:
        pass
    else:
        logging.warn(
            f"User {user.username} tried to access scenario {scenario_id} without permission."
        )
        return Response(
            {
                "status": "error",
                "data:": f"User {user.username} is not authorized to access scenario {scenario_id}",
            },
            status=status.HTTP_401_UNAUTHORIZED,
        )

    return scenario
