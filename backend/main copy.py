from dataclasses import dataclass
from distutils.command.config import config
import os
from random import randint, random
import sys
from time import perf_counter

import numpy as np
from app.src.simulation import simulate
from app.dto.request import SimulationRequest, Workpack
from simulation_framework.django_factory_dep import get
from simulation_framework.record import Np2ParameterRecord, NpParameterRecord, NpRecord
from userparameter.factory import UserParameter
from userparameter.set1 import UP1, UP3


DATAPATH = "/Users/anton/XProjects/thesis/data"


def _bool(x=0.5):
    return random() < x


def _work_pack():
    return Workpack(
        # bugfix=_bool(0.7),
        # unittest=_bool(),
        # integrationtest=_bool(0.2),
        # meetings=randint(0, 10),
        # training=randint(0, 10),
        # teamevent=_bool(0.15),
        # salary=randint(0, 3),
        # overtime=randint(0, 3),
    )


def test(s, UP: UserParameter):
    r = SimulationRequest(scenario_id=0, type="SIMULATION", actions=UP.next(s))

    simulate(r, s)


def run_hyperparameter_simulation(parameter, min, max, step):
    os.environ["SIMULATION_CONFIG_NAME"] = "c3"
    record = NpParameterRecord()
    for i in np.arange(float(min), float(max), float(step)):
        print(f"{i}/{max}")
        for _ in range(20):
            s = get()
            s.scenario.config.__setattr__(parameter, i)
            for _ in range(10):
                test(s)
            record.add(s, i)
    record.df().to_csv(f"{DATAPATH}/simulation_{parameter}.csv")


def main():
    os.environ["SIMULATION_CONFIG_NAME"] = "c3"
    s = get()
    record = NpRecord()
    UP = UP1
    for _ in range(10):
        test(s, UP)
        record.add(s)
    record.df().to_csv(
        f"{DATAPATH}/simulation_{os.environ.get('SIMULATION_CONFIG_NAME', '')}.csv"
    )


@dataclass
class NumericSimulationParameter:
    name: str
    lower_bound: float
    upper_bound: float
    step: float

    def get_values(self):
        return np.arange(self.lower_bound, self.upper_bound, self.step)


def two_parameters(p1: NumericSimulationParameter, p2: NumericSimulationParameter):
    os.environ["SIMULATION_CONFIG_NAME"] = "c3"
    record = Np2ParameterRecord()
    UP = UP3
    for i in p1.get_values():
        print(f"{i}/{p1.upper_bound}")
        for j in p2.get_values():
            for _ in range(20):
                s1 = perf_counter()
                s = get()
                print(f"time to get: {perf_counter() - s1}")
                s.scenario.config.__setattr__(p1.name, i)
                s.scenario.config.__setattr__(p2.name, j)
                s2 = perf_counter()
                for _ in range(len(UP)):
                    test(s, UP)
                print(f"time to test: {perf_counter() - s2}")
                record.add(s, i, j)
    record.df().to_csv(f"{DATAPATH}/simulation_{p1.name}_{p2.name}.csv")


p1 = NumericSimulationParameter("stress_error_increase", 0, 0.6, 0.2)
p2 = NumericSimulationParameter("done_tasks_per_meeting", 0, 101, 25)

two_parameters(p1, p2)


def step(p1: NumericSimulationParameter, p2: NumericSimulationParameter):
    os.environ["SIMULATION_CONFIG_NAME"] = "c3"
    record = Np2ParameterRecord()
    UP = UP3
    s = get()
    r = SimulationRequest(scenario_id=0, type="SIMULATION", actions=UP.next(s))
    simulate(r, s)

