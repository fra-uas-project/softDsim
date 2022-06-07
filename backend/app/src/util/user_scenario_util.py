from app.dto.response import ScenarioStateDTO
from app.models.user_scenario import UserScenario
from app.serializers.user_scenario import ScenarioStateSerializer


def get_scenario_state_dto(scenario: UserScenario) -> ScenarioStateDTO:
    return ScenarioStateDTO(**ScenarioStateSerializer(scenario.state).data)


def increase_scenario_component_counter(scenario, increase_by=1):
    scenario.state.component_counter = scenario.state.component_counter + increase_by
    scenario.state.save()


def increase_scenario_step_counter(scenario, increase_by=1):
    scenario.state.step_counter = scenario.state.step_counter + increase_by
    scenario.state.save()
