import pytest

from app.src_deprecated.dataObjects import WorkPackage
from app.src_deprecated.scenario import Scenario, UserScenario
from app.src_deprecated.task_queue import TaskQueue
from app.src_deprecated.task import Task
from app.src_deprecated.team import Team, Member, ScrumTeam


@pytest.fixture
def teams():
    teams = []
    for i, n in zip(range(3), [1, 5, 10]):
        t = Team(id=str(i))
        for _ in range(n):
            t += Member(skill_type='expert')
        teams.append(t)
    return teams


@pytest.fixture
def tqs():
    tqs = []
    for _ in range(3):
        tq = TaskQueue()
        for i in range(1, 4):
            t = Task(difficulty=i)
            tq.add(t)
        tqs.append(tq)
    return tqs


def test_communication_channels(teams, tqs):
    t1, t2, t3 = teams
    assert t1.num_communication_channels < t2.num_communication_channels
    assert t2.num_communication_channels < t3.num_communication_channels


def test_team_efficieny(teams):
    assert teams[0].efficiency > teams[1].efficiency
    assert teams[1].efficiency > teams[2].efficiency


def test_more_members_less_efficient_per_member(teams, tqs):
    tpms = []  # Tasks per Member
    for t, tq in zip(teams, tqs):
        scenario = UserScenario(tq=tq, template=Scenario(name="", scheduled_days=1, budget=0,pred_c=0.5))
        for m in t.staff:
            m.scenario = scenario 
        t.work(wp=WorkPackage(meeting_hours=10, training_hours=0, day_hours=8, days=20, error_fixing=False,
                              quality_check=False), tq=tq)

        tpms.append((tq.size(test=True)+tq.size(done=True)) / len(t))

    tpm1, tpm2, tpm3 = tpms

    assert tpm1 > tpm2
    assert tpm2 > tpm3
