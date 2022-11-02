# import logging
# import os
# import numpy as np

# from rest_framework import status
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.response import Response

# from app.decorators.decorators import allowed_roles
# from app.dto.request import SimulationRequest
# from app.exceptions import (
#     SimulationException,
#     RequestTypeException,
#     RequestActionException,
#     RequestMembersException,
#     RequestTypeMismatchException,
#     TooManyMeetingsException,
# )
# from app.models.scenario import ScenarioConfig
# from django.core.exceptions import ObjectDoesNotExist
# from rest_framework.decorators import api_view
# from app.models.team import Member, SkillType, Team
# from app.models.template_scenario import TemplateScenario

# from django.core.exceptions import ObjectDoesNotExist
# from rest_framework.decorators import api_view

# from app.models.scenario import ScenarioConfig
# from app.models.team import Team
# from app.models.template_scenario import TemplateScenario

# from app.models.user_scenario import ScenarioState, UserScenario, EventStatus
# from app.models.task import Task
# from app.serializers.user_scenario import UserScenarioSerializer
# from app.serializers.team import MemberSerializer
# from app.src.simulation import continue_simulation, simulate

# from rest_framework.views import APIView

# from app.src.util.scenario_util import create_correct_request_model

# from app.cache.scenario import CachedScenario
# from main import DATAPATH
# from simulation_framework.django_factory_dep import get
# from simulation_framework.record import NpParameterRecord
# from userparameter.factory import UserParameter
# from userparameter.set1 import UP1


# class ParameterSimulation(APIView):
#     permission_classes = (IsAuthenticated,)

#     @allowed_roles(["student", "creator", "staff"])
#     def post(self, request):
#         config = request.data.get("config")
#         parameter = request.data.get("parameter")
#         max = request.data.get("max")
#         min = request.data.get("min")
#         step = request.data.get("step")

#         def test(s, UP: UserParameter):
#             r = SimulationRequest(scenario_id=0, type="SIMULATION", actions=UP.next(s))

#             simulate(r, s)

#         os.environ["SIMULATION_CONFIG_NAME"] = "c3"
#         record = NpParameterRecord()
#         for i in np.arange(float(min), float(max), float(step)):
#             print(f"{i}/{max}")
#             for _ in range(20):
#                 s = get()
#                 s.scenario.config.__setattr__(parameter, i)
#                 for _ in range(10):
#                     test(s, UP1)
#                 record.add(s, i)
#         record.df().to_csv(f"{DATAPATH}/simulation_{parameter}.csv")

#         return Response({"status": "success"}, status=status.HTTP_200_OK)

