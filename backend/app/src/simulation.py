from __future__ import annotations

import logging
import time
from typing import List

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
    RequestTypeMismatchException,
    TooManyMeetingsException,
)
from app.models.question_collection import QuestionCollection
from app.models.simulation_fragment import SimulationFragment
from app.models.model_selection import ModelSelection
from app.src.util.question_util import get_question_collection, handle_question_answers
from app.src.util.scenario_util import (
    handle_end_request,
    handle_model_request,
    handle_start_request,
    request_type_matches_previous_response_type,
)
from app.src.util.task_util import get_tasks_status
from app.src.util.member_util import get_member_report
from app.src.util.user_scenario_util import (
    get_scenario_state_dto,
    increase_scenario_component_counter,
    increase_scenario_step_counter,
)

from app.src.util.simulation_util import (
    end_of_fragment,
    find_next_scenario_component,
    WorkpackStatus,
)
from app.models.team import SkillType
from app.models.team import Member


from django.core.exceptions import ObjectDoesNotExist
from app.src.util.scenario_util import get_actions_from_fragment

from history.write import write_history

# This prevents circular imports, but allows type hinting.
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.cache.scenario import CachedScenario


def simulate(req, session: CachedScenario) -> None:
    """This function does the actual simulation of a scenario fragment."""
    if req.actions is None:
        raise RequestActionException()

    normal_work_hour_day: int = 8

    workpack = req.actions
    days = workpack.days

    # you can not do more meetings than hours per day
    start = time.perf_counter()
    if (workpack.meetings / days) > (normal_work_hour_day + workpack.overtime):
        raise TooManyMeetingsException(
            (workpack.meetings / days), (normal_work_hour_day + workpack.overtime)
        )
    logging.warning(f"Meetings took {time.perf_counter() - start} seconds")

    start = time.perf_counter()
    if req.members and req.members != []:
        # Add or remove members from the team
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
                    new_member = Member(skill_type=s, team=session.scenario.team)
                    new_member.save()
            else:
                list_of_members = Member.objects.filter(
                    team=session.scenario.team, skill_type=s
                )
                try:
                    for i in range(abs(m.change)):
                        m_to_delete: Member = list_of_members[0]
                        m_to_delete.delete()
                except IndexError:
                    msg = f"Cannot remove {m.change} members of type {s.name}."
                    logging.error(msg)
                    raise SimulationException(msg)
    logging.info(f"Member change took {time.perf_counter() - start} seconds")

    # team event
    if req.actions.teamevent:
        days = days - 1
        # team event will be at the end of the week

    workpack_status = WorkpackStatus(days, workpack)

    # check if there are members to work
    if len(session.members) > 0:
        # for schleife für tage (kleinste simulation ist stunde, jeder tag ist 8 stunden) (falls team event muss ein tag abgezogen werden)
        ## scenario.team.work(workpack) (ein tag simuliert)
        for day in range(0, days):
            session.scenario.team.work(session, workpack, workpack_status, day)
            session.scenario.state.day += 1
        logging.warning(f"Team work took {time.perf_counter() - start} seconds")
    else:
        logging.info(
            "There are no members in the team, so there is nothing to simulate."
        )

    # team event
    if req.actions.teamevent:
        members: List[Member] = Member.objects.filter(team_id=session.scenario.team.id)
        cost = len(members) * session.scenario.config.cost_member_team_event
        session.scenario.state.cost += cost
        session.scenario.state.day += 1
        for member in members:
            # Stress is reduced by 50% ?
            member.stress = member.stress * 0.5
            # Motivation is increased by 20% ?
            member.motivation = min((member.motivation * 1.2, 1))


def continue_simulation(session: CachedScenario, req) -> ScenarioResponse:
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
    if not request_type_matches_previous_response_type(session.scenario, req):
        raise RequestTypeMismatchException(req.type)

    # 1.3 handle the request data
    request_handling_mapper = {
        "SIMULATION": simulate,
        "QUESTION": handle_question_answers,
        "MODEL": handle_model_request,
        "START": handle_start_request,
        "END": handle_end_request,
    }
    start = time.perf_counter()
    request_handling_mapper[req.type](req, session)
    logging.warning(f"Mapper func took {time.perf_counter() - start} seconds.")

    # 2. Check if Simulation Fragment ended
    # if fragment ended -> increase counter -> next component will be loaded in next step
    if end_of_fragment(session.scenario):
        logging.info(
            f"Fragment with index {session.scenario.state.component_counter} has ended."
        )
        increase_scenario_component_counter(session.scenario)

    # 3. Find next component
    # find next component depending on current index of the scenario
    # this also checks if scenario is finished (will return response instead of component object)
    next_component = find_next_scenario_component(session)

    # 4. Check if entire Scenario is finished
    # if next_component is a ResultResponse -> means: no next index could be found -> means: Scenario is finished
    if isinstance(next_component, ResultResponse):
        scenario_response = next_component
    # 5. Check with which component the simulation continues
    # 5.1 Check if next component is a Simulation Component
    elif isinstance(next_component, SimulationFragment):
        scenario_response = SimulationResponse(
            management=session.scenario.get_management_goal_dto(),
            actions=get_actions_from_fragment(next_component),
            tasks=get_tasks_status(session.scenario.id),
            state=get_scenario_state_dto(session.scenario),
            members=get_member_report(session.scenario.team.id),
            team=session.scenario.team.stats(session.members),
            text=next_component.text,
        )
    # 5.2 Check if next component is a Question Component
    elif isinstance(next_component, QuestionCollection):
        scenario_response = QuestionResponse(
            management=session.scenario.get_management_goal_dto(),
            question_collection=get_question_collection(session.scenario),
            state=get_scenario_state_dto(session.scenario),
            tasks=get_tasks_status(session.scenario.id),
            members=get_member_report(session.scenario.team.id),
            team=session.scenario.team.stats(session.members),
            text=next_component.text,
        )
    # 5.3 Check if next component is a Model Selection
    elif isinstance(next_component, ModelSelection):
        scenario_response = ModelSelectionResponse(
            management=session.scenario.get_management_goal_dto(),
            tasks=get_tasks_status(session.scenario.id),
            state=get_scenario_state_dto(session.scenario),
            members=get_member_report(session.scenario.team.id),
            models=next_component.models(),
            team=session.scenario.team.stats(session.members),
            text=next_component.text,
        )

    write_history(session.scenario, req, scenario_response.type)

    # increase counter
    increase_scenario_step_counter(session.scenario)
    if scenario_response.type != "SIMULATION":
        increase_scenario_component_counter(session.scenario)
    return scenario_response
