import pytest
from app.src_deprecated.task_queue import TaskQueue

from app.src_deprecated.team import Team, Member, SkillType, order_tasks_for_member, NotAValidSkillTypeException
from app.src_deprecated.task import Task, Difficulty
from app.src_deprecated.scenario import Scenario, UserScenario
from utils import YAMLReader

from bson.objectid import ObjectId

def test_skill_type_reads_parameter_from_yaml():
    t = 'senior'
    sl = SkillType(t)
    data = YAMLReader.read('skill-levels', t)
    assert sl.salary == data['salary']
    assert sl.error_rate == data['error-rate']
    assert sl.throughput == data['throughput']


def test_skill_type_raises_exception():
    with pytest.raises(NotAValidSkillTypeException):
        SkillType('not-a-skill-type')


def test_member_has_skill_type():
    m1 = Member(skill_type='junior')
    assert m1.skill_type == SkillType('junior')


def test_member_has_all_params():
    x = 0.4
    y = 0.99
    z = 0.1
    m = Member(skill_type='expert', xp_factor=x, motivation=y, familiarity=z)

    assert m.skill_type == SkillType('expert')
    assert m.xp_factor == x
    assert m.motivation == y
    assert m.familiarity == z
    assert m.halted is False


def test_team_add_operator():
    team = Team(str(ObjectId()))
    assert len(team.staff) == 0
    team += Member()
    assert len(team.staff) == 1
    team += Member()
    assert len(team.staff) == 2


def test_team_remove_member():
    team = Team(str(ObjectId()))
    m1 = Member()
    m2 = Member()
    assert m1 not in team
    assert m2 not in team
    team += m1
    team += m2
    assert m1 in team
    assert m2 in team
    team -= m1
    assert m1 not in team
    assert m2 in team


def test_team_remove_member_that_is_not_in_team():
    team = Team(str(ObjectId()))
    assert len(team) == 0
    team += Member()
    assert len(team) == 1
    team -= Member()
    assert len(team) == 1


def test_team_size():
    team = Team(str(ObjectId()))
    assert len(team) == 0
    team += Member()
    assert len(team) == 1


def test_teams_motivation():
    team = Team(str(ObjectId()))
    assert team.motivation == 0
    team += Member(motivation=0.10)
    team += Member(motivation=0)
    assert .05 >= team.motivation >= .05


def test_teams_salary():
    team = Team(str(ObjectId()))
    salary = 0
    assert team.salary == salary
    team += Member(skill_type='expert')
    salary += YAMLReader.read('skill-levels', 'expert', 'salary')
    assert team.salary == salary
    team += Member(skill_type='senior')
    salary += YAMLReader.read('skill-levels', 'senior', 'salary')
    assert team.salary == salary
    team += Member(skill_type='expert')
    salary += YAMLReader.read('skill-levels', 'expert', 'salary')
    assert team.salary == salary

def test_order_tasks_for_junior():
    easy = 23
    medium = 15
    hard = 39
    tasks = {Task(difficulty=t) for t in [*[1]*easy, *[2]*medium, *[3]*hard]}

    m = Member(skill_type='junior')

    tasks = order_tasks_for_member(tasks, m.skill_type)

    for i in range(easy):
        assert tasks[i].difficulty == Difficulty.EASY
    
    for i in range(easy, easy+medium):
        assert tasks[i].difficulty == Difficulty.MEDIUM
    
    for i in range(easy+medium, len(tasks)):
        assert tasks[i].difficulty == Difficulty.HARD
    

def test_order_tasks_for_expert():
    easy = 23
    medium = 15
    hard = 39
    tasks = {Task(difficulty=t) for t in [*[1]*easy, *[2]*medium, *[3]*hard]}

    m = Member(skill_type='expert')

    tasks = order_tasks_for_member(tasks, m.skill_type)

    for i in range(hard):
        assert tasks[i].difficulty == Difficulty.HARD
    
    for i in range(hard, hard+medium):
        assert tasks[i].difficulty == Difficulty.MEDIUM
    
    for i in range(hard+medium, len(tasks)):
        assert tasks[i].difficulty == Difficulty.EASY

def test_order_tasks_for_senior():
    easy = 23
    medium = 15
    hard = 39
    tasks = {Task(difficulty=t) for t in [*[1]*easy, *[2]*medium, *[3]*hard]}

    m = Member(skill_type='senior')

    tasks = order_tasks_for_member(tasks, m.skill_type)

    for i in range(medium):
        assert tasks[i].difficulty == Difficulty.MEDIUM
    
    for i in range(medium, easy+medium+hard):
        assert tasks[i].difficulty == Difficulty.HARD or tasks[i].difficulty == Difficulty.EASY

def test_work():
    easy = 23
    medium = 15
    hard = 39
    tasks = {Task(difficulty=t) for t in [*[1]*easy, *[2]*medium, *[3]*hard]}
    tq = TaskQueue()
    tq.add(tasks)
    s = UserScenario(tq=tq)
    m = Member(scenario=s)


def test_team_get_member_by_id():
    t = Team(str(ObjectId()))
    t += Member(xp_factor=1)
    t += Member(skill_type='expert')
    m = Member(skill_type='senior', xp_factor=0.1, motivation=1, familiarity=0)
    _id = m.get_id()
    t += m
    t += Member(xp_factor=0)
    m2 = t.get_member(_id)
    assert m2.get_id() == m.get_id()
    assert m2.skill_type == m.skill_type
    assert m2.xp_factor == m.xp_factor
    assert m2.motivation == m.motivation
    assert m2.familiarity == m.familiarity

def test_team_count_types():
    t = Team(str(ObjectId()))
    t += Member("junior")
    t += Member("senior")
    t += Member("senior")
    t += Member("junior")
    t += Member("expert")
    assert t.count("junior") == 2
    assert t.count("senior") == 2
    assert t.count("expert") == 1


def test_remove_weakest_member():
    t = Team(str(ObjectId()))
    m1 = Member(skill_type='junior', xp_factor=0.1, motivation=1, familiarity=0)
    m2 = Member(skill_type='senior', xp_factor=1, motivation=1, familiarity=1)
    m3 = Member(skill_type='senior', xp_factor=0.1, motivation=1, familiarity=0)
    m4 = Member(skill_type='junior', xp_factor=1, motivation=1, familiarity=0)
    t += m1
    t += m2
    t += m3
    t += m4
    assert m1 in t
    assert m2 in t
    assert m3 in t
    assert m4 in t
    t.remove_weakest('senior')
    assert m1 in t
    assert m2 in t
    assert m3 not in t
    assert m4 in t
    t.remove_weakest('junior')
    assert m1 not in t
    assert m2 in t
    assert m3 not in t
    assert m4 in t


def test_team_number_communication_channels():
    t = Team(str(ObjectId()))
    assert t.num_communication_channels == 0
    t += Member()
    assert t.num_communication_channels == 0
    t += Member()
    assert t.num_communication_channels == 1
    t += Member()
    assert t.num_communication_channels == 3
    for _ in range(10):
        t += Member()
    assert t.num_communication_channels == 78
