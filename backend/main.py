print("MAIN SCRIPT")
from random import randint, random
from statistics import mean
from typing import List

import numpy as np
from pandas import DataFrame
from app.models.scenario import ScenarioConfig
from app.models.task import Task
from app.models.team import Member, SkillType, Team
from app.models.user_scenario import ScenarioState, UserScenario
from app.src.simulation import simulate
from app.dto.request import SimulationRequest, Workpack
from simulation_framework.wrappers import FastSecenario, FastTasks
from userparameter.set1 import USERPARAMETERS


DATAPATH = "~/data"
RUNNAME = "run1"
NRUNS = 1_000_000
SAVE_EVERY = 10_000

Team.objects.create()


def init_scenario() -> UserScenario:
    us = UserScenario.objects.create()
    state = ScenarioState.objects.create(user_scenario=us)
    team = Team.objects.create(user_scenario=us)
    return us, state, team


def init_config():
    try:
        return ScenarioConfig.objects.get(name="c1")
    except:
        return ScenarioConfig.objects.create(name="c1")


def init_skill_types():
    try:
        s1 = SkillType.objects.get(name="s1").delete()
        s2 = SkillType.objects.get(name="s2").delete()
        s3 = SkillType.objects.get(name="s3").delete()
    except:
        pass
    s1 = SkillType.objects.create(name="s1", cost_per_day=200)
    s2 = SkillType.objects.create(name="s2", cost_per_day=350)
    s3 = SkillType.objects.create(name="s3", cost_per_day=500)
    return [s1, s2, s3]


def init_members(skill_types):
    members = []
    for sk in skill_types:
        members.append(Member.objects.create(skill_type=sk, team_id=1))
    return members


def run_simulation(scenario, config, members, tasks, skill_types, rec, UP, UP_n):
    scenario.config = config
    s = FastSecenario(scenario, members, tasks, 1, 1)
    r = SimulationRequest(scenario_id=0, type="SIMULATION", actions=UP)
    simulate(r, s)
    rec.add(s, config, skill_types, UP, UP_n)


def set_config(config: ScenarioConfig):
    config.stress_weekend_reduction = round(random() * 0.8, 2)
    config.stress_overtime_increase = round(random() * 0.25, 2)
    config.stress_error_increase = round(random() * 0.33, 2)
    config.done_tasks_per_meeting = randint(0, 5) * 20
    config.train_skill_increase_rate = round(random() * 0.5, 2)


def set_skill_types(skill_types: List[SkillType]):
    skill_types[0].throughput = randint(1, 5)
    skill_types[0].error_rate = round(random() * 0.23 + 0.1, 2)
    skill_types[1].throughput = randint(3, 8)
    skill_types[1].error_rate = round(random() * 0.3 + 0.03, 2)
    skill_types[2].throughput = randint(5, 10)
    skill_types[2].error_rate = round(random() * 0.25, 2)


def set_tasks(u):
    TOTAL = 200
    tasks = set()
    for _ in range(int(TOTAL * 0.25)):
        tasks.add(Task(id=randint(0, 9999999999), difficulty=1, user_scenario=u))
    for _ in range(int(TOTAL * 0.5)):
        tasks.add(Task(id=randint(0, 9999999999), difficulty=2, user_scenario=u))
    for _ in range(int(TOTAL * 0.25)):
        tasks.add(Task(id=randint(0, 9999999999), difficulty=3, user_scenario=u))
    return FastTasks(tasks)


def np_record(
    s: FastSecenario,
    config: ScenarioConfig,
    skill_types: List[SkillType],
    workpack: Workpack,
    UP_n,
) -> np.array:
    return np.array(
        [
            config.stress_weekend_reduction,
            config.stress_overtime_increase,
            config.stress_error_increase,
            config.done_tasks_per_meeting,
            config.train_skill_increase_rate,
            skill_types[0].throughput,
            skill_types[0].error_rate,
            skill_types[1].throughput,
            skill_types[1].error_rate,
            skill_types[2].throughput,
            skill_types[2].error_rate,
            UP_n,
            workpack.days,
            workpack.bugfix,
            workpack.unittest,
            workpack.integrationtest,
            workpack.meetings,
            workpack.training,
            workpack.teamevent,
            workpack.salary,
            workpack.overtime,
            s.scenario.state.cost,
            s.scenario.state.day,
            mean([m.efficiency for m in s.members]),
            mean([m.familiarity for m in s.members]),
            mean([m.stress for m in s.members]),
            mean([m.xp for m in s.members]),
            mean([m.motivation for m in s.members]),
            len(s.tasks.accepted()),
            len(s.tasks.rejected()),
        ]
    )


class NpRecord:
    def __init__(self):
        self.data = None

    def add(self, s: FastSecenario, *args):
        if self.data is None:
            self.data = np.array([np_record(s, *args)])
        else:
            self.data = np.vstack((self.data, np.array([np_record(s, *args)])))

    def clear(self):
        self.data = None

    def df(self):
        return DataFrame(
            self.data,
            columns=[
                "c_swr",
                "c_soi",
                "c_sei",
                "c_dtm",
                "c_tsi",
                "s1_thr",
                "s1_err",
                "s2_thr",
                "s2_err",
                "s3_thr",
                "s3_err",
                "UP",
                "days",
                "bugfix",
                "unittest",
                "integrationtest",
                "meetings",
                "training",
                "teamevent",
                "salary",
                "overtime",
                "Cost",
                "Day",
                "Eff",
                "Fam",
                "Str",
                "XP",
                "Mot",
                "Acc",
                "Rej",
            ],
        )


def set_members(members: List[Member]):
    for member in members:
        member.familiar_tasks = 0
        member.familiarity = 0
        member.motivation = 0.75
        member.stress = 0.15
        member.xp = 0


def set_scenario(scenario: UserScenario, state: ScenarioState):
    state.cost = 0
    state.day = 0


def main():
    print("Started")
    rec = NpRecord()
    scenario, state, team = init_scenario()
    config = init_config()
    skill_types = init_skill_types()
    members = init_members(skill_types)

    for x in range(1, NRUNS + 1):
        set_config(config)
        set_skill_types(skill_types)
        for n, UP in enumerate(USERPARAMETERS):

            set_scenario(scenario, state)
            set_members(members)
            tasks = set_tasks(scenario)
            run_simulation(scenario, config, members, tasks, skill_types, rec, UP, n)
            # print(f"{len(tasks.done())} \t {mean([m.efficiency for m in members])}")

        if x % SAVE_EVERY == 0:
            print(f"{x} of {NRUNS}")
            rec.df().to_csv(f"{DATAPATH}/{RUNNAME}/file{int(x / SAVE_EVERY)}.csv")
            rec.clear()


main()
