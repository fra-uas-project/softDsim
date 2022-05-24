import logging


from app.dto.response import (
    SimulationResponse,
    QuestionResponse,
    ScenarioResponse,
    ResultResponse,
)
from app.exceptions import SimulationException
from app.models.question_collection import QuestionCollection
from app.models.simulation_fragment import SimulationFragment
from app.models.user_scenario import UserScenario
from app.models.task import Task
from app.src.util.question_util import get_question_collection
from app.src.util.task_util import get_tasks_status
from app.src.util.member_util import get_member_report
from app.src.util.user_scenario_util import (
    get_scenario_state_dto,
    find_next_scenario_component,
    end_of_fragment,
    increase_scenario_counter,
)
from app.dto.request import SimulationRequest
from app.models.team import SkillType
from app.models.team import Member


from django.core.exceptions import ObjectDoesNotExist


def continue_simulation(
    scenario: UserScenario, req: SimulationRequest
) -> ScenarioResponse:
    """ATTENTION: THIS FUNCTION IS NOT READY TO USE IN PRODUCTION
    The function currently can only be used as a dummy.

    :param scenario: The UserScenario object played
    :type scenario: UserScenario

    """
    wp = req.actions
    # Gather information of what to do
    days = wp.days

    # find next component depending on current index of the scenario
    # this also checks if scenario is finished (will return response instead of component object)
    next_component = find_next_scenario_component(scenario)

    # Check if Scenario is finished
    # if next_component is a ResultResponse -> means: no next index could be found -> means: Scenario is finished
    if isinstance(next_component, ResultResponse):
        return next_component

    # Check if next component is a Question Component
    # if next component is a Question:
    if isinstance(next_component, QuestionCollection):

        question_response = QuestionResponse(
            question_collection=get_question_collection(scenario),
            state=get_scenario_state_dto(scenario),
            tasks=get_tasks_status(scenario.id),
            members=get_member_report(scenario.team.id),
        )
        increase_scenario_counter(scenario)

        return question_response

    # Check if next component is a Simulation Component
    if isinstance(next_component, SimulationFragment):
        member_change = req.members
        for m in member_change:
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
                list_of_members = Member.objects.filter(
                    team=scenario.team, skill_type=s
                )
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

        # Check if any events has occurred

        # Check if Simulation Fragment ended
        if end_of_fragment(scenario):
            logging.info(f"Fragment with index {scenario.state.counter} has ended.")
            increase_scenario_counter(scenario)

            # return next component
            # don't know yet if recursive is the best solution
            return continue_simulation(scenario, req)

        # Build response
        return SimulationResponse(
            tasks=get_tasks_status(scenario.id),
            state=get_scenario_state_dto(scenario),
            members=get_member_report(scenario.team.id),
        )
