import logging

from django.core.exceptions import ObjectDoesNotExist
from rest_framework.response import Response

from app.dto.response import ResultResponse
from app.models.task import TaskStatus
from app.models.user_scenario import UserScenario
from app.src.util.member_util import get_member_report
from app.src.util.task_util import (
    get_tasks_customer_view,
    get_tasks_status,
    get_tasks_status_detailed,
)
from app.src.util.user_scenario_util import get_scenario_state_dto
from history.models.result import Result


def get_result_response(scenario: UserScenario) -> ResultResponse:
    try:
        try:
            result: Result = Result.objects.get(user_scenario=scenario)
        except ObjectDoesNotExist:
            result: Result = Result.objects.create(
                user_scenario=scenario,
                total_score=200,  # todo: get total score
                total_steps=scenario.state.step_counter,
                total_days=scenario.state.day,
                total_cost=scenario.state.cost,
                **get_tasks_status_detailed(scenario_id=scenario.id),
                **get_tasks_customer_view(scenario_id=scenario.id),
                quality_score=100,  # todo: get quality score
                time_score=50,  # todo: get time score
                budget_score=25,  # todo: get budget score
                question_score=25,  # todo: get question score
                model=scenario.model or "",
            )

        return ResultResponse(
            state=get_scenario_state_dto(scenario),
            tasks=get_tasks_status(scenario.id),
            members=get_member_report(scenario.team.id),
            total_score=result.total_score,
            quality_score=result.quality_score,
            question_score=result.question_score,
            budget_score=result.budget_score,
            time_score=result.time_score,
            tasks_accepted=TaskStatus.accepted(scenario_id=scenario.id).count(),
            tasks_rejected=TaskStatus.rejected(scenario_id=scenario.id).count(),
            total_days=result.total_days,
            total_cost=result.total_cost,
        )
    except Exception as e:
        msg = f"{e.__class__.__name__} occurred while getting result response for scenario {scenario.id}"
        logging.error(msg)
        return Response(dict(status="error", data=msg), status=500)
