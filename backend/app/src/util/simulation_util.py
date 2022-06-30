import math
import operator


from deprecated.classic import deprecated
from numpy import mean
from app.cache.scenario import CachedScenario
from pydantic import BaseModel

from app.dto.response import EventResponse
from app.models.event import Event
from app.models.question_collection import QuestionCollection
from app.models.simulation_fragment import SimulationFragment
from app.models.model_selection import ModelSelection
from app.models.task import Task, CachedTasks
from app.models.team import Member, Team
from app.models.user_scenario import UserScenario, EventStatus

from history.util.result import get_result_response


def find_next_scenario_component(session: CachedScenario):
    """
    Function to find next component in a scenario by component-index depending on the current counter.
    If no next component can be found, it will return a ResultReponse
    This is probably not a fast way of finding the next component and should be replaced by a better system.
    """
    scenario = session.scenario
    if end_of_simulation(scenario):
        scenario.ended = True

    # add all components here
    components = [QuestionCollection, SimulationFragment, ModelSelection]
    query = dict(
        index=scenario.state.component_counter,
        template_scenario_id=scenario.template_id,
    )

    for component in components:
        if component.objects.filter(**query).exists():
            # return the next component instance -> gets checked with isinstance() in continue_simulation function
            fetched_component = component.objects.get(**query)
            # if scenario ended, we will skip any simulation fragments
            if scenario.ended and isinstance(fetched_component, SimulationFragment):
                scenario.state.component_counter += 1
                return find_next_scenario_component(session)
            return fetched_component

    # send ResultResponse when scenario is finished

    return get_result_response(session)


def end_of_fragment(scenario) -> bool:
    """
    This function determines if the end condition of a simulation fragment is reached
    returns: boolean
    """

    try:
        fragment = SimulationFragment.objects.get(
            template_scenario=scenario.template, index=scenario.state.component_counter
        )
    except:
        return False

    if fragment.last:
        return end_of_simulation(scenario)

    limit = None
    end_type = fragment.simulation_end.type.lower()

    if end_type == "stress" or end_type == "motivation":
        members = Member.objects.filter(team_id=scenario.team.id)
        limit = mean([getattr(member, end_type) for member in members] or 0)
    elif end_type == "duration":
        limit = scenario.state.day
    elif end_type == "budget":
        limit = scenario.state.cost
    elif end_type == "tasks_done":
        tasks_done = Task.objects.filter(user_scenario=scenario, done=True)
        limit = len(tasks_done)

    if (
        fragment.simulation_end.limit_type == "ge"
        and limit >= fragment.simulation_end.limit
    ):
        return True

    if (
        fragment.simulation_end.limit_type == "le"
        and limit <= fragment.simulation_end.limit
    ):
        return True

    return False

    # end_types = ["tasks_done", "motivation", "duration", "stress", "budget"]
    #
    # end_condition = {
    #     "tasks_done": tasks_done_end,
    #     "motivation": is_end,
    #     "duration": is_end,
    #     "stress": is_end,
    #     "budget": is_end,
    # }
    #
    # end_condition[fragment.simulation_end.type.lower()](
    #     scenario, fragment, fragment.simulation_end.type.lower()
    # )

    # for end_type in end_types:
    #     if fragment.simulation_end.type.lower() == end_type:
    #         if fragment.simulation_end.limit_type == "ge":
    #             if len(tasks_done) >= fragment.simulation_end.limit:
    #                 return True
    #             else:
    #                 return False
    #         # elif fragment.simulation_end.limit_type == "le":


def end_of_simulation(scenario: UserScenario) -> bool:
    tasks = Task.objects.filter(user_scenario=scenario).count()
    tasks_integration = Task.objects.filter(
        user_scenario=scenario,
        unit_tested=True,  # TODO: CAHNGE BACK TO INTEGRATIO TESTED
        # THIS IS ONLY BECAUSE WE CANNOT INTEGRATION TEST YET
    ).count()
    if tasks == tasks_integration:
        return True
    return False


class WorkpackStatus:
    remaining_trainings: int = 0

    def __init__(self, days, workpack):
        self.meetings_per_day = []
        self.calculate_meetings_per_day(days, workpack)
        self.remaining_trainings = workpack.training

    def calculate_meetings_per_day(self, days, workpack):
        meetings_per_day_without_modulo = math.floor(workpack.meetings / days)
        modulo = workpack.meetings % days
        for day in range(days):
            if day < modulo:
                self.meetings_per_day.append(meetings_per_day_without_modulo + 1)
            else:
                self.meetings_per_day.append(meetings_per_day_without_modulo)

    # def set_remaining_trainings(self, remaining_trainings_today, remaining_work_hours):
    #     if remaining_trainings_today > remaining_work_hours:
    #         self.remaining_trainings = remaining_trainings_today - remaining_work_hours
    #     else:
    #         self.remaining_trainings = 0


def adjust_team_stress(scenario, event_effect):
    members = Member.objects.filter(team_id=scenario.team.id)
    for member in members:
        member.stress = (
            min(member.stress + event_effect.value, 1)
            if min(member.stress + event_effect.value, 1) >= 0
            else 0
        )
    Member.objects.bulk_update(members, ["stress"])


def adjust_team_motivation(scenario, event_effect):
    members = Member.objects.filter(team_id=scenario.team.id)
    for member in members:
        member.motivation = (
            min(member.motivation + event_effect.value, 1)
            if min(member.motivation + event_effect.value, 1) >= 0
            else 0
        )
    Member.objects.bulk_update(members, ["motivation"])


def adjust_team_familiarity(scenario, event_effect):
    members = Member.objects.filter(team_id=scenario.team.id)
    for member in members:
        member.familiarity = (
            min(member.familiarity + event_effect.value, 1)
            if min(member.familiarity + event_effect.value, 1) >= 0
            else 0
        )
    Member.objects.bulk_update(members, ["familiarity"])


def adjust_budget(scenario, event_effect):
    scenario.state.budget += event_effect.value
    scenario.state.save()


def add_tasks(scenario, event_effect):
    """Currently we only add tasks via an event effect - we could also add the option to remove tasks through an event in the future"""
    tasks = [
        Task(difficulty=1, user_scenario=scenario)
        for _ in range(event_effect.easy_tasks)
    ]
    tasks += [
        Task(difficulty=2, user_scenario=scenario)
        for _ in range(event_effect.medium_tasks)
    ]
    tasks += [
        Task(difficulty=3, user_scenario=scenario)
        for _ in range(event_effect.hard_tasks)
    ]
    Task.objects.bulk_create(tasks)
    scenario.state.total_tasks += (
        event_effect.easy_tasks + event_effect.medium_tasks + event_effect.hard_tasks
    )
    scenario.state.save()


class EventEffectDTO(BaseModel):
    value: float = 0
    easy_tasks: int = 0
    medium_tasks: int = 0
    hard_tasks: int = 0


def event_triggered(session: CachedScenario):
    scenario = session.scenario
    tasks = session.tasks

    trigger_types = {
        "motivation": scenario.team.motivation(session.members),
        "tasks_done": len(tasks.done()),
        "time": scenario.state.day,
        "stress": scenario.team.stress(session.members),
        "cost": scenario.state.cost,
    }

    effect_types = {
        "stress": adjust_team_stress,
        "motivation": adjust_team_motivation,
        "familiarity": adjust_team_familiarity,
        "tasks": add_tasks,
        "budget": adjust_budget,
    }

    # get all events
    events = Event.objects.filter(
        template_scenario_id=scenario.template.id
    ).prefetch_related("effects")

    for event in events:

        compare = operator.le if event.trigger_comparator == "le" else operator.ge

        if compare(trigger_types[event.trigger_type], event.trigger_value):
            # event condition is triggered
            # check if event already happened in this user scenario
            event_status = EventStatus.objects.get(
                event_id=event.id, state_id=scenario.state.id
            )
            if not event_status.has_happened:

                # handle all event effects
                for effect in event.effects.all():
                    event_effect = EventEffectDTO(
                        value=effect.value,
                        easy_tasks=effect.easy_tasks,
                        medium_tasks=effect.medium_tasks,
                        hard_tasks=effect.hard_tasks,
                    )

                    effect_types[effect.type](scenario, event_effect)

                event_status.has_happened = True
                event_status.save()
                return event

    return None
