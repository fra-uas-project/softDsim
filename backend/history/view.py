from http.client import BAD_REQUEST
import logging

from django.core.exceptions import ObjectDoesNotExist
from app.exceptions import RequestParamException
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from app.decorators.decorators import allowed_roles
from app.models.user_scenario import UserScenario

from history.models.result import Result
from history.serializers.history import HistorySerializer
from history.models.history import History
from history.serializers.result import ResultSerializer
from app.models.template_scenario import TemplateScenario

import datetime


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
            tasks_done=0,
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
                data={"status": "error", "data": msg}, status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            msg = f"{e.__class__.__name__} occurred when trying to access history entry {id}"
            logging.warn(msg)
            return Response(
                data={"status": "error", "data": msg},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class ResultView(APIView):
    permission_classes = (IsAuthenticated,)

    @allowed_roles(["student"])
    def get(self, request, id=None):
        try:
            r = Result.objects.get(id=id)
            s = ResultSerializer(r)
            if (
                request.user.admin
                or request.user.username == r.user_scenario.user.username
            ):
                return Response(data=s.data, status=status.HTTP_200_OK)
            msg = f"User {request.user.username} is not allowed to access result {id}"
            logging.info(msg)
            return Response(
                dict(status="error", data=msg), status=status.HTTP_401_UNAUTHORIZED
            )
        except ObjectDoesNotExist:
            msg = f"Result entry with id {id} does not exist"
            logging.warn(msg)
            return Response(
                data={"status": "error", "data": msg}, status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            msg = f"{e.__class__.__name__} occurred when trying to access result entry {id}"
            logging.warn(msg)
            return Response(
                data={"status": "error", "data": msg},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class ResultsView(APIView):
    permission_classes = (IsAuthenticated,)

    @allowed_roles(["admin"])
    def get(self, request, id=None):
        id = request.GET.get('template_scenario_id')
        date_str: str = request.GET.get('from', None)
        try:
            template_id = int(id)
            if template_id < 1:
                raise ObjectDoesNotExist()

            results: Result = []

            if date_str is None:
                results = fetch_results_by_scenario_id(template_id)
            else:
                is_date_valid(date_str)
                results = fetch_results_by_scenario_id_and_date(
                    template_id, date_str)

            data = ResultSerializer(results, many=True).data

            return Response(
                data={"status": "success", "data": data}, status=status.HTTP_200_OK,
            )
        except RequestParamException as e:
            msg = f"Date {date_str} is not valid. Only ISO date format is accepted, eg. {datetime.date.today().isoformat()}"
            return Response(
                data={"status": "error", "data": msg},
                status=BAD_REQUEST,
            )
        except ObjectDoesNotExist as e:
            msg = f"Template Scenario with id {id} is not found"
            return Response(
                data={"status": "error", "data": msg},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            msg = f"{e.__class__.__name__} occurred when trying to access result entry '{id}'"
            return Response(
                data={"status": "error", "data": msg},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


def is_date_valid(date_str: str):
    try:
        datetime.date.fromisoformat(date_str)
    except:
        raise RequestParamException('from')


def fetch_results_by_scenario_id_and_date(scenario_id: int, date_str: str):

    # cant make result in the future
    if datetime.date.fromisoformat(date_str) > datetime.date.today():
        return []

    return Result.objects.filter(
        template_scenario_id=scenario_id).filter(timestamp__gte=date_str)


def fetch_results_by_scenario_id(scenario_id: int):
    return Result.objects.filter(template_scenario_id=scenario_id)
