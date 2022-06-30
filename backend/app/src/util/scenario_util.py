import logging
from typing import List
from app.cache.scenario import CachedScenario
from app.dto.request import (
    EndRequest,
    ScenarioRequest,
    SimulationRequest,
    QuestionRequest,
    ModelRequest,
    StartRequest,
    EventRequest,
)
from app.dto.response import ActionDTO, EffectsDto
from app.models.user_scenario import UserScenario
from history.models.history import History


def check_indexes(data) -> bool:
    """checks if indexes of template scenario are correct."""
    index_list = []
    for component_type in [
        "question_collections",
        "simulation_fragments",
        "model_selections",
    ]:
        for component_data in data.get(component_type):
            index_list.append(component_data.get("index"))

    sorted_index_list = sorted(index_list)
    for i in range(0, len(sorted_index_list)):
        if i != sorted_index_list[i]:
            return False

    return True


def create_correct_request_model(request) -> ScenarioRequest:
    """
    Creates object of the right request model, depending on the request type.
    (If type of request is QUESTION -> will create QuestionRequest object.)
    """
    request_types = {
        "SIMULATION": SimulationRequest,
        "QUESTION": QuestionRequest,
        "MODEL": ModelRequest,
        "START": StartRequest,
        "END": EndRequest,
        "EVENT": EventRequest,
    }
    for key, value in request_types.items():
        if request.data.get("type") == key:
            a = value(**request.data)
            logging.info(a)
            return a


def handle_model_request(req, session: CachedScenario):
    # todo: we could implement a check here to see if the model in the request is actually available in the scenario, but the frontend should only diplay the available options anyway
    UserScenario.objects.filter(id=session.scenario.id).update(model=req.model.upper())


def handle_start_request(req, session: CachedScenario):
    pass


def handle_end_request(req, session: CachedScenario):
    session.scenario.ended = True


def handle_event_request(req, scenario):
    pass


def handle_end_request(req, scenario):
    scenario.ended = True


def get_actions_from_fragment(next_component) -> List[ActionDTO]:
    """Extracts and returns all actions from a component and returns it as a
    list of ActionDTOs."""
    return [
        ActionDTO(
            action=a.get("title"),
            lower_limit=a.get("lower_limit"),
            upper_limit=a.get("upper_limit"),
        )
        for a in next_component.actions.values()
    ]


def request_type_matches_previous_response_type(scenario, req) -> bool:

    if scenario.state.step_counter == 0:
        return req.type == "START"

    # get last step from history
    history = History.objects.get(
        user_scenario_id=scenario.id, step_counter=scenario.state.step_counter - 1
    )
    return req.type == history.response_type or req.type == "END"  # END is always ok


def get_effects_from_event(event):
    return [
        EffectsDto(
            type=e.get("type"),
            value=e.get("value"),
            easy_tasks=e.get("easy_tasks"),
            medium_tasks=e.get("medium_tasks"),
            hard_tasks=e.get("hard_tasks"),
        )
        for e in event.effects.values()
    ]

    value: float
    easy_tasks: int
    medium_tasks: int
    hard_tasks: int
