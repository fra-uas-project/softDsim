from random import randint
from typing import List
from app.models.task import Task
from app.models.team import Member, SkillType, Team
from simulation_framework.wrappers import (
    FastSecenario,
    FastTasks,
    SimulationMember,
    SimulationScenario,
    SimulationScenarioConfig,
    SimulationSkillType,
    SimulationState,
    SimulationTeam,
    SimulationTemplateScenario,
    SimulationUser,
)


def _get_user() -> SimulationUser:
    return SimulationUser()


def _get_config() -> SimulationScenarioConfig:
    config = SimulationScenarioConfig()
    # Create config
    return config


def _get_state() -> SimulationState:
    state = SimulationState()
    state.component_counter = 0
    state.step_counter = 0
    state.cost = 0
    state.day = 0
    # Load from scenario
    state.budget = 500000
    state.total_tasks = 500
    state.poison_counter = 0
    state.poisson_sum = 0
    state.user_scenario = None
    return state


def _get_team() -> SimulationTeam:
    team = SimulationTeam()
    team.members = []
    team.user_scenario = None
    return team


def _get_template() -> SimulationTemplateScenario:
    template = SimulationTemplateScenario()
    template.management_goal = None
    template.user_scenario = None
    return template


def _get_scenario() -> SimulationScenario:
    s = SimulationScenario()
    s.user = _get_user()
    s.config = _get_config()
    s.model = "scrum"

    s.question_points = 0
    s.ended = False
    s.team = _get_team()

    # Template
    template = _get_template()
    template.user_scenario = s
    s.template = template

    # State
    state = _get_state()
    state.user_scenario = s
    s.state = state

    return s


def _get_members(scenario) -> List[Member]:
    team = SimulationTeam(user_scenario=scenario)
    skill_type = SimulationSkillType(
        name="demo",
        cost_per_day=500,
        error_rate=0.1,
        throughput=2,
        management_quality=10,
        development_quality=90,
        signing_bonus=0,
    )
    members = [SimulationMember(team=team, skill_type=skill_type) for _ in range(3)]
    return members


def _get_tasks(scenario):
    tasks = {
        Task(difficulty=1, user_scenario=scenario, id=randint(1000000, 9999999))
        for _ in range(100)
    }
    return FastTasks(tasks)


def get_scenario() -> FastSecenario:
    scenario = _get_scenario()
    s = FastSecenario(scenario, _get_members(scenario), _get_tasks(scenario))
    return s
