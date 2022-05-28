import logging
from app.src.util.task_util import get_tasks_status_detailed
from app.dto.request import SimulationRequest
from history.models.history import History


def write(scenario, request: SimulationRequest):
    request
    scenario
    h = History(
        type=request.type,
        user_scenario=scenario,
        counter=scenario.state.counter,
        day=scenario.state.day,
        cost=scenario.state.cost,
        model="scrum",
        **get_tasks_status_detailed(scenario.id),
    )
    h.save()
    logging.info(
        f"Wrote history (id {h.id}) for scenario with id {scenario.id} (user: {scenario.user.username})"
    )
