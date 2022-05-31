from app.dto.response import ScenarioStateDTO
from app.models.user_scenario import UserScenario
from app.serializers.user_scenario import ScenarioStateSerializer

def get_scenario_state_dto(scenario: UserScenario) -> ScenarioStateDTO:
    return ScenarioStateDTO(**ScenarioStateSerializer(scenario.state).data)
