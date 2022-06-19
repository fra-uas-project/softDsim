import logging

from django.core.exceptions import ObjectDoesNotExist
from rest_framework.response import Response

from app.dto.response import ResultResponse, TasksStatusDTO
from app.models.task import CachedTasks, Task, TaskStatus
from app.models.team import Member, Team
from app.models.user_scenario import UserScenario
from app.src.util.member_util import get_member_report
from app.src.util.score_util import calc_scores
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
            result = handle_scenario_ending(scenario)

        return ResultResponse(
            management=scenario.get_management_goal_dto(),
            state=get_scenario_state_dto(scenario),
            tasks=TasksStatusDTO(
                tasks_todo=result.tasks_todo,
                tasks_done=result.tasks_done,
                tasks_unit_tested=result.tasks_unit_tested,
                tasks_integration_tested=result.tasks_integration_tested,
                tasks_bug=result.tasks_bug_discovered,
            ),
            team=scenario.team.stats(),
            members=get_member_report(scenario.team.id),
            total_score=result.total_score,
            quality_score=result.quality_score,
            question_score=result.question_score,
            budget_score=result.budget_score,
            time_score=result.time_score,
            tasks_accepted=result.tasks_accepted,
            tasks_rejected=result.tasks_rejected,
            total_days=result.total_days,
            total_cost=result.total_cost,
            max_question_score=0,
            max_quality_score=scenario.scorecard.quality_limit,
            max_budget_score=scenario.scorecard.budget_limit,
            max_time_score=scenario.scorecard.time_limit,
            max_total_score=0,
        )
    except Exception as e:
        msg = f"{e.__class__.__name__} occurred while getting result response for scenario {scenario.id}"
        logging.error(msg)
        return Response(dict(status="error", data=msg), status=500)


def handle_scenario_ending(scenario):
    result = write_result_entry(scenario)
    delete_sceanrio_objects(scenario)
    return result


def write_result_entry(scenario):
    final_tasks = CachedTasks(scenario_id=scenario.id)
    result: Result = Result.objects.create(
        user_scenario=scenario,
        total_steps=scenario.state.step_counter,
        total_days=scenario.state.day,
        total_cost=scenario.state.cost,
        **get_tasks_status_detailed(scenario_id=scenario.id),
        **get_tasks_customer_view(scenario_id=scenario.id),
        **calc_scores(scenario=scenario, tasks=final_tasks),
        model=scenario.model or "",
    )
    logging.info(f"Created result entry for scenario {scenario.id}")
    return result


def delete_sceanrio_objects(scenario):
    # Delete all objects that wont be used any longer
    n_tasks, _ = Task.objects.filter(user_scenario=scenario).delete()
    logging.info(f"Deleted {n_tasks} tasks for scenario {scenario.id}")
