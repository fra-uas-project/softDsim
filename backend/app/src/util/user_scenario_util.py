from app.dto.response import ScenarioStateDTO, ResultResponse
from app.models.question_collection import QuestionCollection
from app.models.simulation_fragment import SimulationFragment
from app.models.model_selection import ModelSelection
from app.models.task import Task
from app.models.user_scenario import UserScenario
from app.serializers.user_scenario import ScenarioStateSerializer
from app.src.util.member_util import get_member_report
from app.src.util.task_util import get_tasks_status


def get_scenario_state_dto(scenario: UserScenario) -> ScenarioStateDTO:
    return ScenarioStateDTO(**ScenarioStateSerializer(scenario.state).data)


def find_next_scenario_component(scenario):
    """
    Function to find next component in a scenario by component-index depending on the current counter.
    If no next component can be found, it will return a ResultReponse
    This is probably not a fast way of finding the next component and should be replaced by a better system.
    """
    # todo: find better solution

    # add all components here
    components = [QuestionCollection, SimulationFragment, ModelSelection]
    query = dict(
        index=scenario.state.counter, template_scenario_id=scenario.template_id
    )

    for component in components:
        if component.objects.filter(**query).exists():
            # return the next component instance -> gets checked with isinstance() in continue_simulation function
            return component.objects.get(**query)

    # send ResultResponse when scenario is finished
    return ResultResponse(
        state=get_scenario_state_dto(scenario),
        tasks=get_tasks_status(scenario.id),
        members=get_member_report(scenario.team.id),
    )


def end_of_fragment(scenario) -> bool:
    """
    THIS IMPLEMENTATION IS NOT FINAL AND NOT FINISHED (wip for testing)
    This function determines if the end condition of a simulation fragment is reached
    returns: boolean
    """
    # todo philip: clean this up

    fragment = SimulationFragment.objects.get(
        template_scenario=scenario.template, index=scenario.state.counter
    )

    tasks_done = Task.objects.filter(user_scenario=scenario, done=True)

    end_types = ["tasks_done", "motivation"]

    for end_type in end_types:
        if fragment.simulation_end.type == end_type:
            if fragment.simulation_end.limit_type == "ge":
                if len(tasks_done) >= fragment.simulation_end.limit:
                    return True
                else:
                    return False


def increase_scenario_counter(scenario, increase_by=1):
    scenario.state.counter = scenario.state.counter + increase_by
    scenario.state.save()
