from app.models.task import Task
from app.dto.response import TasksStatusDTO


def get_tasks_status(scenario_id: int) -> TasksStatusDTO:
    """NOT FINAL"""
    tasks_todo = Task.objects.filter(user_scenario_id=scenario_id, done=False).count()
    tasks_done = Task.objects.filter(
        user_scenario_id=scenario_id,
        done=True,
        unit_tested=False,
        integration_tested=False,
    ).count()
    tasks_unit_tested = Task.objects.filter(
        user_scenario_id=scenario_id,
        done=True,
        unit_tested=True,
        integration_tested=False,
    ).count()
    tasks_integration_tested = Task.objects.filter(
        user_scenario_id=scenario_id,
        done=True,
        unit_tested=True,
        integration_tested=True,
    ).count()
    tasks_bug = Task.objects.filter(
        user_scenario_id=scenario_id, done=True, unit_tested=True, bug=True
    ).count()

    return TasksStatusDTO(
        tasks_todo=tasks_todo,
        task_done=tasks_done,
        tasks_unit_tested=tasks_unit_tested,
        tasks_integration_tested=tasks_integration_tested,
        tasks_bug=tasks_bug,
    )


def get_tasks_status_detailed(scenario_id: int):
    # Todo remove dummy values with actual values
    return {
        "tasks_todo": Task.objects.filter(
            user_scenario_id=scenario_id, done=False
        ).count(),
        "task_done": 0,
        "tasks_unit_tested": 0,
        "tasks_integration_tested": 0,
        "tasks_bug_discovered": 0,
        "tasks_bug_undiscovered": 0,
        "tasks_done_wrong_specification": 0,
    }
