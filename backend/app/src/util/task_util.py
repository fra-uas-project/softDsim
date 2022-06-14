from typing import Dict
from app.models.task import Task, TaskStatus
from app.dto.response import TasksStatusDTO


def get_tasks_status(scenario_id: int) -> TasksStatusDTO:
    """Returns a TaskStatusDTO for a current scenario with all data allowed to be seen
    by team/user."""
    return TasksStatusDTO(
        tasks_todo=TaskStatus.todo(scenario_id).count(),
        tasks_done=TaskStatus.done(scenario_id).count(),
        tasks_unit_tested=TaskStatus.unit_tested(scenario_id).count(),
        tasks_integration_tested=TaskStatus.integration_tested(scenario_id).count(),
        tasks_bug=TaskStatus.bug(scenario_id).count(),
    )


def get_tasks_status_detailed(scenario_id: int) -> Dict[str, int]:
    """Returns json representation of a scenarios tasks status, including data that is
    not allowed to be viewed by team/user."""
    return {
        "tasks_todo": TaskStatus.todo(scenario_id).count(),
        "tasks_done": TaskStatus.done(scenario_id).count(),
        "tasks_unit_tested": TaskStatus.unit_tested(scenario_id).count(),
        "tasks_integration_tested": TaskStatus.integration_tested(scenario_id).count(),
        "tasks_bug_discovered": TaskStatus.bug(scenario_id).count(),
        "tasks_bug_undiscovered": TaskStatus.bug_undiscovered(scenario_id).count(),
        "tasks_done_wrong_specification": TaskStatus.done_wrong_specification(
            scenario_id
        ).count(),
    }


def get_tasks_customer_view(scenario_id: int) -> Dict[str, int]:
    """Returns json representation of a scenarios tasks status, as seen from customer"""
    return {
        "tasks_accepted": TaskStatus.accepted(scenario_id).count(),
        "tasks_rejected": TaskStatus.rejected(scenario_id).count(),
    }
