import logging
from app.dto.request import Workpack
from app.dto.response import SimulationResponse
from app.models.user_scenario import UserScenario
from app.models.task import Task
from app.src.task_util import get_tasks_status
from app.src.member_util import get_member_report
from app.src.user_scenario_util import get_scenario_state_dto
from app.dto.request import SimulationRequest
from app.models.team import SkillType
from app.models.team import Member


from django.core.exceptions import ObjectDoesNotExist


class SimulationException(BaseException):
    """Raised when simulation cannot be executed because of wrong data in request."""


def continue_simulation(
    scenario: UserScenario, req: SimulationRequest
) -> SimulationResponse:
    """ATTENTION: THIS FUNCTION IS NOT READY TO USE IN PRODUCTION
    The function currently can only be used as a dummy.

    :param scenario: The UserScenario object played
    :type scenario: UserScenario

    """
    wp = req.actions
    # Gather information of what to do
    days = wp.days

    member_change = req.members
    for m in member_change:
        m.skill_type
        try:
            s = SkillType.objects.get(name=m.skill_type)
        except ObjectDoesNotExist:
            msg = f"SkillType {m.skill_type} does not exist."
            logging.error(msg)
            raise SimulationException(msg)
        if m.change > 0:
            for _ in range(m.change):
                new_member = Member(skill_type=s, team=scenario.team)
                new_member.save()
        else:
            list_of_members = Member.objects.filter(team=scenario.team, skill_type=s)
            try:
                for i in range(abs(m.change)):
                    m_to_delete: Member = list_of_members[0]
                    m_to_delete.delete()
            except IndexError:
                msg = f"Cannot remove {m.change} members of type {s.name}."
                logging.error(msg)
                raise SimulationException(msg)

    # Simulate what happens
    tasks = Task.objects.filter(user_scenario=scenario, done=False)
    done_tasks = []
    for i in range(min(days, len(tasks))):
        t = tasks[i]
        t.done = True
        done_tasks.append(t)

    # write updates to database
    Task.objects.bulk_update(done_tasks, fields=["done"])

    # Check if scenario is completed

    # Check if any events has occurred

    # Check if simulation fragment ended

    # Build response
    return SimulationResponse(
        tasks=get_tasks_status(scenario.id),
        state=get_scenario_state_dto(scenario),
        members=get_member_report(scenario.team.id),
    )
