import logging

from django.core.exceptions import ObjectDoesNotExist
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
        try:
            template_id = int(id)
            if template_id < 1:
                raise ObjectDoesNotExist()

            # check if scenario exists
            TemplateScenario.objects.get(id=template_id)

            results = Result.objects.filter(template_scenario_id=template_id)

            data = ResultSerializer(results, many=True).data

            return Response(
                data={"status": "success", "data": data}, status=status.HTTP_200_OK,
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
