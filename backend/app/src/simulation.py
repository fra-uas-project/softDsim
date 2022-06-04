import logging

from rest_framework import status
from rest_framework.response import Response

from app.dto.response import (
    ModelSelectionResponse,
    SimulationResponse,
    QuestionResponse,
    ScenarioResponse,
    ResultResponse,
)
from app.exceptions import (
    SimulationException,
    RequestTypeException,
    RequestActionException,
    RequestMembersException,
    RequestTypeMismatchException,
)
from app.models.question_collection import QuestionCollection
from app.models.simulation_fragment import SimulationFragment
from app.models.user_scenario import UserScenario
from app.models.task import Task
from app.models.model_selection import ModelSelection
from app.src.util.question_util import get_question_collection, handle_question_answers
from app.src.util.scenario_util import (
    handle_model_request,
    handle_start_request,
    request_type_matches_previous_response_type,
)
from app.src.util.task_util import get_tasks_status
from app.src.util.member_util import get_member_report
from app.src.util.user_scenario_util import (
    get_scenario_state_dto,
    find_next_scenario_component,
    end_of_fragment,
    increase_scenario_component_counter,
    increase_scenario_step_counter,
)
from app.models.team import SkillType
from app.models.team import Member


from django.core.exceptions import ObjectDoesNotExist
from app.src.util.scenario_util import get_actions_from_fragment

from history.write import write_history


def simulate(req, scenario):
    """This function does the actual simulation of a scenario fragment."""
    if req.actions is None:
        raise RequestActionException()

    if not req.members:
        raise RequestMembersException()

    wp = req.actions
    # Gather information of what to do
    days = wp.days

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


def continue_simulation(scenario: UserScenario, req) -> ScenarioResponse:
    """ATTENTION: THIS FUNCTION IS NOT READY TO USE IN PRODUCTION
    The function currently can only be used as a dummy.

    :param scenario: The UserScenario object played
    :type scenario: UserScenario

    :param req: Object with request data

    """
    # response that gets returned at the end
    scenario_response = None

    # 1. Process the request information
    # 1.1 check if request type is specified. might not be needed here anymore,
    # since it is already checked in simulation view.
    if req.type is None:
        raise RequestTypeException()

    # 1.2 check if request type matches previous response type
    if not request_type_matches_previous_response_type(scenario, req):
        raise RequestTypeMismatchException(req.type)

    # 1.3 handle the request data
    request_handling_mapper = {
        "SIMULATION": simulate,
        "QUESTION": handle_question_answers,
        "MODEL": handle_model_request,
        "START": handle_start_request,
    }
    request_handling_mapper[req.type](req, scenario)

    # 2. Check if Simulation Fragment ended
    # if fragment ended -> increase counter -> next component will be loaded in next step
    if end_of_fragment(scenario):
        logging.info(
            f"Fragment with index {scenario.state.component_counter} has ended."
        )
        increase_scenario_component_counter(scenario)

    # 3. Find next component
    # find next component depending on current index of the scenario
    # this also checks if scenario is finished (will return response instead of component object)
    next_component = find_next_scenario_component(scenario)

    # 4. Check if entire Scenario is finished
    # if next_component is a ResultResponse -> means: no next index could be found -> means: Scenario is finished
    if isinstance(next_component, ResultResponse):
        scenario_response = next_component
    # 5. Check with which component the simulation continues
    # 5.1 Check if next component is a Simulation Component
    elif isinstance(next_component, SimulationFragment):
        scenario_response = SimulationResponse(
            actions=get_actions_from_fragment(next_component),
            tasks=get_tasks_status(scenario.id),
            state=get_scenario_state_dto(scenario),
            members=get_member_report(scenario.team.id),
        )
    # 5.2 Check if next component is a Question Component
    elif isinstance(next_component, QuestionCollection):
        scenario_response = QuestionResponse(
            question_collection=get_question_collection(scenario),
            state=get_scenario_state_dto(scenario),
            tasks=get_tasks_status(scenario.id),
            members=get_member_report(scenario.team.id),
        )
    # 5.3 Check if next component is a Model Selection
    elif isinstance(next_component, ModelSelection):
        scenario_response = ModelSelectionResponse(
            tasks=get_tasks_status(scenario.id),
            state=get_scenario_state_dto(scenario),
            members=get_member_report(scenario.team.id),
            models=next_component.models(),
        )

    write_history(scenario, req, scenario_response.type)

    # increase counter
    increase_scenario_step_counter(scenario)
    if scenario_response.type != "SIMULATION":
        increase_scenario_component_counter(scenario)

    return scenario_response
