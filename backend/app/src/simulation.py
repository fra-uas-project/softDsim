from app.dto.request import Workpack
from app.dto.response import SimulationResponse
from app.models.user_scenario import UserScenario
from app.models.task import Task
from app.src.task_util import get_tasks_status
from app.src.member_util import get_member_report
from app.src.user_scenario_util import get_scenario_state_dto


def continue_simulation(scenario: UserScenario, wp: Workpack) -> SimulationResponse:
    """ATTENTION: THIS FUNCTION IS NOT READY TO USE IN PRODUCTION
    The function currently can only be used as a dummy.

    :param scenario: The UserScenario object played
    :type scenario: UserScenario
    :param wp: Settings object with the options chosen by user
    :type wp: Workpack
    """
    # Gather information of what to do
    days = wp.days

    # Simulate what happens
    tasks = Task.objects.filter(user_scenario=scenario, done=False)
    done_tasks = []
    for i in range(min(days, len(tasks))):
        t = tasks[i]
        t.done = True
        done_tasks.append(t)

    # write updates to database
    Task.objects.bulk_update(done_tasks, fields=["done"])

    # Build response

    return SimulationResponse(
        tasks=get_tasks_status(scenario.id),
        state=get_scenario_state_dto(scenario),
        members=get_member_report(scenario.team.id),
    )
