from app.dto.response import ScenarioStateDTO
from app.models.question_collection import QuestionCollection
from app.models.simulation_fragment import SimulationFragment
from app.models.user_scenario import UserScenario
from app.serializers.user_scenario import ScenarioStateSerializer


def get_scenario_state_dto(scenario: UserScenario) -> ScenarioStateDTO:
    return ScenarioStateDTO(**ScenarioStateSerializer(scenario.state).data)


def find_next_scenario_component(scenario):
    """
    Function to find next component in a scenario by component-index depending on the current counter.
    This is probably not a fast way of finding the next component and should be replaced by a better system.
    todo: find better solution
    """

    # add all components here
    components = [QuestionCollection, SimulationFragment]

    for component in components:
        if component.objects.filter(
            index=scenario.state.counter, template_scenario_id=scenario.template_id
        ).exists():
            # return an instance of the component -> gets checked with isinstance() in continue_simulation function
            return component()
        else:
            pass

    # todo philip: send message back when no more index is found (scenario is finished)
    # send result response when scenario is finished

    # todo find better return if none of the ifs are true
    return None
