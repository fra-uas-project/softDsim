import pytest

from app.src_deprecated.scenario import Scenario, UserScenario
from app.src_deprecated.scorecard import ScoreCard
from app.src_deprecated.task import Task

@pytest.fixture
def us() -> UserScenario:
    card = ScoreCard()
    s = Scenario(scorecard=card)
    us = UserScenario(template=s)
    return us


def test_scenario_has_scorecard(us):
    assert isinstance(us.template.scorecard, ScoreCard) is True


def test_budget_score_default(us: UserScenario):
    us.template.budget = 1000

    us.actual_cost = 500
    assert us.budget_score() == 100

        
    us.actual_cost = 1200 # 20% exceed
    assert us.budget_score() == 80

    us.actual_cost = 1500 # 50% exceed
    assert us.budget_score() == 50

    us.actual_cost = 2000 # 100% exceed
    assert us.budget_score() == 0



def test_budget_score_p_values(us: UserScenario):
    us.template.scorecard.budget_p = 2
    us.template.budget = 1000

    us.actual_cost = 500
    assert us.budget_score() == 100

        
    us.actual_cost = 1200 # 20% exceed
    assert us.budget_score() == 0

    us.template.scorecard.budget_p = 1.12
    assert us.budget_score() == int(100 - 20**1.12)

    us.template.budget = 2000
    us.actual_cost = 2800 # 40% exceed
    us.template.scorecard.budget_p = 1.19
    assert us.budget_score() == int(100 - 40**1.19)


def test_budget_scaling(us:UserScenario):
    us.template.scorecard.budget_p = 2
    us.template.scorecard.budget_limit = 1000
    us.template.budget = 1000

    us.actual_cost = 500
    assert us.budget_score() == 1000

        
    us.actual_cost = 1200 # 20% exceed
    assert us.budget_score() == 0

    us.template.scorecard.budget_p = 1.12
    assert us.budget_score() == int(100 - 20**1.12)*10

    us.template.budget = 2000
    us.actual_cost = 2800 # 40% exceed
    us.template.scorecard.budget_p = 1.19
    assert us.budget_score() == int(100 - 40**1.19)*10



def test_time_score_default(us: UserScenario):
    us.template.scheduled_days = 200

    us.current_day = 50
    assert us.time_score() == 100

        
    us.current_day = 240 # 20% exceed
    assert us.time_score() == 80

    us.current_day = 300 # 50% exceed
    assert us.time_score() == 50

    us.current_day = 400 # 100% exceed
    assert us.time_score() == 0


def test_time_score_p_values(us: UserScenario):
    us.template.scorecard.time_p = 2
    us.template.scheduled_days = 100

    us.current_day = 100
    assert us.time_score() == 100

        
    us.current_day = 120 # 20% exceed
    assert us.time_score() == 0

    us.template.scorecard.time_p = 1.12
    assert us.time_score() == int(100 - 20**1.12)

    us.template.scheduled_days = 50
    us.current_day = 75 # 50% exceed
    us.template.scorecard.time_p = 1.13
    assert us.time_score() == int(100 - 50**1.13)



def test_quality_score_tasks_not_done(us: UserScenario):
    [us.task_queue.add(Task()) for _ in range(100)]
    
    assert us.quality_score() == 0

    # 10 % undone tasks
    [us.task_queue.add(Task(done=True)) for _ in range(900)]

    assert us.quality_score() == 43

    # 15.053763440860216 % undone tasks
    [us.task_queue.add(Task()) for _ in range(40)]
    [us.task_queue.add(Task(done=True)) for _ in range(30)]

    assert us.quality_score() == 32

    [us.task_queue.add(Task(done=True)) for _ in range(20000)]

    assert us.quality_score() == 94


def test_quality_score_tasks_buggy_with_k(us: UserScenario):
    us.template.scorecard.quality_k = 2
    [us.task_queue.add(Task(done=True, bug=True)) for _ in range(5)]
    
    assert us.quality_score() == 0

    [us.task_queue.add(Task(done=True)) for _ in range(10)]

    assert us.quality_score() == 44


    [us.task_queue.add(Task(done=True)) for _ in range(30)]

    assert us.quality_score() == 79

    [us.task_queue.add(Task(done=True, correct_specification=False)) for _ in range(27)]

    assert us.quality_score() == 30


def test_quality_score_with_k_and_scaling(us: UserScenario):
    us.template.scorecard.quality_k = 10
    us.template.scorecard.quality_limit = 200
    [us.task_queue.add(Task(done=True, bug=True)) for _ in range(7)]
    [us.task_queue.add(Task(done=True, bug=False, correct_specification=False)) for _ in range(4)]
    [us.task_queue.add(Task(done=True)) for _ in range(1000)]

    assert us.quality_score() == 179


    [us.task_queue.add(Task(done=True)) for _ in range(50000)]

    assert us.quality_score() == 199

    [us.task_queue.add(Task(done=False, bug=True, correct_specification=False)) for _ in range(7000)]

    us.template.scorecard.quality_limit = 10
    assert us.quality_score() == 2
