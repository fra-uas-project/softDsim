import os
from random import randint, random
from app.src.simulation import simulate
from app.dto.request import SimulationRequest, Workpack
from simulation_framework.django_factory import get
from simulation_framework.record import NpRecord


DATAPATH = "/Users/anton/XProjects/thesis/data"


def _bool(x=0.5):
    return random() < x


def _work_pack():
    return Workpack(
        bugfix=_bool(0.7),
        unittest=_bool(),
        integrationtest=_bool(0.2),
        meetings=randint(0, 10),
        training=randint(0, 10),
        teamevent=_bool(0.15),
        salary=randint(0, 3),
        overtime=randint(0, 3),
    )


def test(s):
    r = SimulationRequest(scenario_id=0, type="SIMULATION", actions=_work_pack())

    simulate(r, s)


def main():
    os.environ["SIMULATION_CONFIG_NAME"] = "c3"
    s = get()
    record = NpRecord()
    for _ in range(250):
        test(s)
        record.add(s)
    record.df().to_csv(
        f"{DATAPATH}/simulation_{os.environ.get('SIMULATION_CONFIG_NAME', '')}.csv"
    )


main()

