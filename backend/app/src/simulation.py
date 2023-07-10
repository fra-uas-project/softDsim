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
    EventResponse,
)
from app.exceptions import (
    SimulationException,
    RequestTypeException,
    RequestActionException,
    RequestTypeMismatchException,
    TooManyMeetingsException,
)
from app.models.event import Event
from app.models.question_collection import QuestionCollection
from app.models.simulation_fragment import SimulationFragment
from app.models.model_selection import ModelSelection
from app.src.util.question_util import get_question_collection, handle_question_answers
from app.src.util.scenario_util import (
    handle_end_request,
    handle_model_request,
    handle_start_request,
    request_type_matches_previous_response_type,
    handle_event_request,
    get_effects_from_event,
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
    event_triggered,
)
from app.models.team import SkillType
from app.models.team import Member


from django.core.exceptions import ObjectDoesNotExist
from app.src.util.scenario_util import get_actions_from_fragment
from history.models.result import Result
from history.util.result import get_result_response, ResultDTO

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
    # logging.info(f"Workpack: {workpack}")
    days = workpack.days

    # you can not do more meetings than hours per day
    if (workpack.meetings / days) > (normal_work_hour_day + workpack.overtime):
        raise TooManyMeetingsException(
            (workpack.meetings / days), (normal_work_hour_day + workpack.overtime)
        )





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
                    new_member = Member(
                        skill_type=s, team=session.scenario.team)
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
    # logging.info(f"Member change took {time.perf_counter() - start} seconds")

    # team event
    if req.actions.teamevent:
        days = days - 1
        # team event will be at the end of the week

    # integration test
    if req.actions.integrationtest:
        days = days - 1
        # integration test will be at the end of the week

    workpack_status = WorkpackStatus(days, workpack)





    # check if there are members to work
    if len(session.members) > 0:
        # for schleife für tage (kleinste simulation ist stunde, jeder tag ist 8 stunden) (falls team event muss ein tag abgezogen werden)
        # scenario.team.work(workpack) (ein tag simuliert)
        for day in range(0, days):
            session.scenario.team.work(session, workpack, workpack_status, day)
            session.scenario.state.day += 1
            for member in session.members:
                member.calculate_familiarity(len(session.tasks.solved()))
        logging.warning(
            f"Team work took {time.perf_counter() - start} seconds")
    else:
        logging.info(
            "There are no members in the team, so there is nothing to simulate."
        )
    if req.actions.integrationtest:
        tasks_to_integration_test = session.tasks.unit_tested()
        for t in tasks_to_integration_test:
            if t.correct_specification:
                t.integration_tested = True
            else:
                t.done = False

    # team event
    if req.actions.teamevent:
        cost = len(session.members) * \
            session.scenario.config.cost_member_team_event
        session.scenario.state.cost += cost
        session.scenario.state.day += 1
        for member in session.members:
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
    # if not request_type_matches_previous_response_type(session.scenario, req):
    #     raise RequestTypeMismatchException(req.type)

    # 1.3 handle the request data
    request_handling_mapper = {
        "SIMULATION": simulate,
        "QUESTION": handle_question_answers,
        "MODEL": handle_model_request,
        "START": handle_start_request,
        "EVENT": handle_event_request,
        "END": handle_end_request,
    }
    start = time.perf_counter()
    request_handling_mapper[req.type](req, session)
    # {time.perf_counter() - start} seconds.")

    # check if event occurred
    # check if this event already happened (bool for every event in db -> set 'happened' to true if event happened)
    event = event_triggered(session)
    if isinstance(event, Event):
        scenario_response = EventResponse(
            # todo philip: don't know which one frontend wants to use, can delete one of the two text fields later
            event_text=event.text,
            text=event.text,
            effects=get_effects_from_event(event),
            management=session.scenario.get_management_goal_dto(),
            tasks=get_tasks_status(session),
            state=get_scenario_state_dto(session.scenario),
            members=get_member_report(session.members),
            team=session.scenario.team.stats(session.members),
        )

        return complete_scenario_step(session, req, scenario_response)

    # 2. Check if Simulation Fragment ended
    # if fragment ended -> increase counter -> next component will be loaded in next step
    if end_of_fragment(session):
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
            tasks=get_tasks_status(session),
            state=get_scenario_state_dto(session.scenario),
            members=get_member_report(session.members),
            team=session.scenario.team.stats(session.members),
            text=next_component.text,
        )
    # 5.2 Check if next component is a Question Component
    elif isinstance(next_component, QuestionCollection):
        scenario_response = QuestionResponse(
            management=session.scenario.get_management_goal_dto(),
            question_collection=get_question_collection(session.scenario),
            state=get_scenario_state_dto(session.scenario),
            tasks=get_tasks_status(session),
            members=get_member_report(session.members),
            team=session.scenario.team.stats(session.members),
            text=next_component.text,
        )
    # 5.3 Check if next component is a Model Selection
    elif isinstance(next_component, ModelSelection):
        scenario_response = ModelSelectionResponse(
            management=session.scenario.get_management_goal_dto(),
            tasks=get_tasks_status(session),
            state=get_scenario_state_dto(session.scenario),
            members=get_member_report(session.members),
            models=next_component.models(),
            team=session.scenario.team.stats(session.members),
            text=next_component.text,
        )
    # 5.4 Check if next component is a Result -> Scenario is finished
    elif isinstance(next_component, Result):
        scenario_response = ResultDTO()
        # didn't want to rewrite the whole get_result_response function

    return complete_scenario_step(session, req, scenario_response)


def complete_scenario_step(session: CachedScenario, req, scenario_response):
    # write_history(session.scenario, req, scenario_response.type)

    if scenario_response.type == "RESULT":
        return get_result_response(session)

    # increase counter
    increase_scenario_step_counter(session.scenario)
    if scenario_response.type not in ("SIMULATION", "EVENT"):
        increase_scenario_component_counter(session.scenario)
    return scenario_response
