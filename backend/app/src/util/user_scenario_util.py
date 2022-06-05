from asyncio import tasks
from app.dto.response import ScenarioStateDTO, ResultResponse
from app.models.question_collection import QuestionCollection
from app.models.simulation_fragment import SimulationFragment
from app.models.model_selection import ModelSelection
from app.models.task import Task, TaskStatus
from app.models.user_scenario import UserScenario
from app.serializers.user_scenario import ScenarioStateSerializer
from app.src.util.member_util import get_member_report
from app.src.util.task_util import get_tasks_status, get_tasks_status_detailed
from history.models.result import Result

from django.core.exceptions import ObjectDoesNotExist


def get_scenario_state_dto(scenario: UserScenario) -> ScenarioStateDTO:
    return ScenarioStateDTO(**ScenarioStateSerializer(scenario.state).data)


def find_next_scenario_component(scenario: UserScenario):
    """
    Function to find next component in a scenario by component-index depending on the current counter.
    If no next component can be found, it will return a ResultReponse
    This is probably not a fast way of finding the next component and should be replaced by a better system.
    """
    # todo: find better solution

    # add all components here
    components = [QuestionCollection, SimulationFragment, ModelSelection]
    query = dict(
        index=scenario.state.component_counter,
        template_scenario_id=scenario.template_id,
    )

    for component in components:
        if component.objects.filter(**query).exists():
            # return the next component instance -> gets checked with isinstance() in continue_simulation function
            return component.objects.get(**query)

    # send ResultResponse when scenario is finished
    try:
        result: Result = Result.objects.get(user_scenario=scenario)
    except ObjectDoesNotExist:
        result: Result = Result.objects.create(
            user_scenario=scenario,
            total_score=200,  # todo: get total score
            total_steps=scenario.state.step_counter,
            total_days=scenario.state.days,
            total_cost=scenario.state.cost,
            **get_tasks_status_detailed(scenario_id=scenario.id),
            quality_score=100,  # todo: get quality score
            time_score=50,  # todo: get time score
            budget_score=25,  # todo: get budget score
            question_score=25,  # todo: get question score
            model=scenario.model,
        )
    return ResultResponse(
        state=get_scenario_state_dto(scenario),
        tasks=get_tasks_status(scenario.id),
        members=get_member_report(scenario.team.id),
        total_score=result.total_score,
        quality_score=result.quality_score,
        question_score=result.question_score,
        budget_score=result.budget_score,
        time_score=result.time_score,
        tasks_accepted=TaskStatus.accepted(scenario_id=scenario.id),
        tasks_rejected=TaskStatus.rejected(scenario_id=scenario.id),
        total_days=result.total_days,
        total_cost=result.total_cost,
    )


def end_of_fragment(scenario) -> bool:
    """
    THIS IMPLEMENTATION IS NOT FINAL AND NOT FINISHED (wip for testing)
    This function determines if the end condition of a simulation fragment is reached
    returns: boolean
    """
    # todo philip: clean this up
    try:
        fragment = SimulationFragment.objects.get(
            template_scenario=scenario.template, index=scenario.state.component_counter
        )
    except:
        return False

    tasks_done = Task.objects.filter(user_scenario=scenario, done=True)

    end_types = ["tasks_done", "motivation"]

    for end_type in end_types:
        if fragment.simulation_end.type == end_type:
            if fragment.simulation_end.limit_type == "ge":
                if len(tasks_done) >= fragment.simulation_end.limit:
                    return True
                else:
                    return False


def increase_scenario_component_counter(scenario, increase_by=1):
    scenario.state.component_counter = scenario.state.component_counter + increase_by
    scenario.state.save()


def increase_scenario_step_counter(scenario, increase_by=1):
    scenario.state.step_counter = scenario.state.step_counter + increase_by
    scenario.state.save()
