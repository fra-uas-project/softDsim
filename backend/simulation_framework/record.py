from dataclasses import dataclass
from statistics import mean
from time import perf_counter

from regex import D
from simulation_framework.wrappers import FastSecenario

import numpy as np
from pandas import DataFrame


class NpRecord:
    def __init__(self):
        self.data = None

    def add(self, s: FastSecenario):
        if self.data is None:
            self.data = np.array([np_record(s)])
        else:
            self.data = np.vstack((self.data, np.array([np_record(s)])))

    def df(self):
        return DataFrame(
            self.data,
            columns=["Cost", "Day", "Eff", "Fam", "Str", "XP", "Mot", "Acc", "Rej"],
        )


def np_record(s: FastSecenario) -> np.array:
    return np.array(
        [
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


@dataclass
class Record:
    efficiency: float
    familiarity: float
    motivation: float
    stress: float
    xp: float

    # tasks_accepted: int
    # tasks_rejected: int
    # tasks_bug: int
    # tasks_bug_undiscovered: int
    # tasks_done: int
    # tasks_done_wrong_specification: int
    # taks_integration_tested: int
    # tasks_solved: int
    # tasks_todo: int
    # tasks_unit_tested: int

    cost: float
    day: int

    def __init__(self, s: FastSecenario):
        self.efficiency = mean([m.efficiency for m in s.members])
        self.familiarity = mean([m.familiarity for m in s.members])
        self.stress = mean([m.stress for m in s.members])
        self.xp = mean([m.xp for m in s.members])
        self.motivation = mean([m.motivation for m in s.members])

        self.tasks_accepted = len(s.tasks.accepted())
        self.tasks_rejected = len(s.tasks.rejected())
        # self.tasks_bug = len(s.tasks.bug())
        # self.tasks_bug_undiscovered = len(s.tasks.bug_undiscovered())
        # self.tasks_done = len(s.tasks.done())
        # self.tasks_done_wrong_specification = len(s.tasks.done_wrong_specification())
        # self.taks_integration_tested = len(s.tasks.integration_tested())
        # self.tasks_solved = len(s.tasks.solved())
        # self.tasks_todo = len(s.tasks.todo())
        # self.tasks_unit_tested = len(s.tasks.unit_tested())

        self.cost = s.scenario.state.cost
        self.day = s.scenario.state.day

