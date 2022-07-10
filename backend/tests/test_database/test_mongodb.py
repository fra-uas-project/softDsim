from cProfile import label
from copy import deepcopy
from turtle import title
import pytest

from app.src_deprecated.dataObjects import SimulationGoal
from app.src_deprecated.decision_tree import Action, ActionList, Decision, Answer, AnsweredDecision, SimulationDecision, TextBlock
from app.src_deprecated.scenario import UserScenario, Scenario
from app.src_deprecated.task import Difficulty, Task
from app.src_deprecated.task_queue import TaskQueue
from app.src_deprecated.team import Member, SkillType
from mongo_models import ScenarioMongoModel, NoObjectWithIdException, ClickHistoryModel

from bson.objectid import ObjectId


def test_save_empty_scenario():
    mongo = ScenarioMongoModel()
    s = Scenario()
    mid = mongo.save(s)
    
    s2 = mongo.get(mid)

    assert s2.id == s.id
    assert s2.id == mid

    assert isinstance(s, Scenario) is True
    assert isinstance(s, UserScenario) is False
    assert isinstance(s2, Scenario) is True
    assert isinstance(s2, UserScenario) is False
    mongo.remove(mid)

def test_save_user_scenario():
    mongo = ScenarioMongoModel()
    s = UserScenario()
    mid = mongo.save(s)
    
    s2 = mongo.get(mid)

    assert s2.id == s.id
    assert s2.id == mid

    assert isinstance(s, Scenario) is False
    assert isinstance(s, UserScenario) is True
    assert isinstance(s2, Scenario) is False
    assert isinstance(s2, UserScenario) is True
    mongo.remove(s)


def test_two_stored_scenarios_are_not_equal():
    mongo = ScenarioMongoModel()
    s1 = Scenario()
    s2 = Scenario()
    mid1 = mongo.save(s1)
    mid2 = mongo.save(s2)
    assert mid1 != mid2

    r1 = mongo.get(mid1)
    r2 = mongo.get(mid2)

    assert s1.id == r1.id
    assert s2.id == r2.id
    assert r1 != r2
    assert r1 != s2
    assert r2 != s1
    assert mid1 == r1.id
    assert mid1 != r2.id
    mongo.remove(s1)
    mongo.remove(s2)


@pytest.fixture
def decisions():
    d1 = AnsweredDecision(text = [TextBlock("Header1", "Content1")], points=200, active_actions=["A", "B"], name="D1",
        actions=[Action(id=ObjectId(), title="A", typ="button", active=True,required=False,hover="ABC", restrictions={'a':['b', 'c']}, answers=[Answer(label="L", active=True, points=3)])])
    d2 = SimulationDecision(text = [TextBlock("Header2", "Content2"), TextBlock("Header3", "Content3")], points=21, name="D2", goal=SimulationGoal(300), max_points=200)
    return [d1, d2]


def test_save_scenario_with_attributes(decisions):
    name = "Some"
    budget = 234
    scheduled_days = 12
    desc = "Text"
    tasks_easy = 1000
    tasks_medium = 1
    tasks_hard = 100
    pred_c = 0.3
    id = ObjectId()
    s = Scenario(name=name, budget=budget, scheduled_days=scheduled_days, desc=desc, 
            tasks_easy=tasks_easy, tasks_medium=tasks_medium, tasks_hard=tasks_hard, 
            pred_c=pred_c, decisions=decisions, id=id)
    
    
    mongo = ScenarioMongoModel()
    mongo.save(s)

    r = mongo.get(id)
    mongo.remove(s)
    
    assert r.id == s.id
    assert r.name == s.name
    assert r.budget == s.budget
    assert r.scheduled_days == s.scheduled_days
    assert r.desc == s.desc
    assert r.tasks_easy == s.tasks_easy
    assert r.tasks_hard == s.tasks_hard
    assert r.tasks_medium == s.tasks_medium
    assert r.pred_c == s.pred_c
    a = 1
    b = 0
    if isinstance(r.decisions[0], AnsweredDecision):
        a = 0
        b = 1
    assert isinstance(r.decisions[a], AnsweredDecision)
    assert isinstance(r.decisions[b], SimulationDecision)
    assert r.decisions[a].text == s.decisions[0].text
    assert r.decisions[a].name == s.decisions[0].name
    assert r.decisions[a].points == s.decisions[0].points
    assert r.decisions[a].active_actions[1] == s.decisions[0].active_actions[1]
    assert r.decisions[a].actions[0].title == s.decisions[0].actions[0].title
    assert r.decisions[a].actions[0].typ == s.decisions[0].actions[0].typ
    assert r.decisions[a].actions[0].active == s.decisions[0].actions[0].active
    assert r.decisions[a].actions[0].required == s.decisions[0].actions[0].required
    assert r.decisions[a].actions[0].hover == s.decisions[0].actions[0].hover
    assert r.decisions[a].actions[0].answers[0] == s.decisions[0].actions[0].answers[0]
    assert r.decisions[b].text == s.decisions[1].text
    assert r.decisions[b].name == s.decisions[1].name
    assert r.decisions[b].points == s.decisions[1].points
    assert r.decisions[b].max_points == s.decisions[1].max_points
    assert r.decisions[b].goal == s.decisions[1].goal 


def test_save_userscenario_with_attributes(decisions):
    mongo = ScenarioMongoModel()
    name = "Some"
    budget = 234
    scheduled_days = 12
    desc = "Text"
    tasks_easy = 1000
    tasks_medium = 1
    tasks_hard = 100
    pred_c = 0.3
    id = ObjectId()
    s = Scenario(name=name, budget=budget, scheduled_days=scheduled_days, desc=desc, 
            tasks_easy=tasks_easy, tasks_medium=tasks_medium, tasks_hard=tasks_hard, 
            pred_c=pred_c, decisions=decisions, id=id)
    mongo.save(s)
    task_queue = TaskQueue()
    actual_cost = 499
    current_day = 19
    counter = 123
    task_queue.add([
        Task(difficulty=Difficulty.EASY, done=True, bug=True),
        Task(difficulty=Difficulty.EASY, done= True, unit_tested=True),
        Task(difficulty=Difficulty.HARD)
    ])
    template = s
    model = "kanban"

    
    us = UserScenario(tq=task_queue, actual_cost=actual_cost, current_day=current_day, 
        counter=counter, decisions=deepcopy(decisions), template=template, model=model,
        user="PETER")
    
    sid = mongo.save(us)

    r = mongo.get(sid)

    assert r.model == model
    assert r.actual_cost  == actual_cost
    assert r.current_day == current_day
    assert r.counter == counter
    assert r.template.name == name
    assert r.template.tasks_easy == tasks_easy
    assert r.user == "PETER"
    
    a = 1
    b = 0
    if isinstance(r.decisions[0], AnsweredDecision):
        a = 0
        b = 1
    assert isinstance(r.decisions[a], AnsweredDecision)
    assert isinstance(r.decisions[b], SimulationDecision)
    assert r.decisions[a].text == s.decisions[0].text
    assert r.decisions[a].name == s.decisions[0].name
    assert r.decisions[a].points == s.decisions[0].points
    assert r.decisions[a].active_actions[1] == s.decisions[0].active_actions[1]
    assert r.decisions[a].actions[0].title == s.decisions[0].actions[0].title
    assert r.decisions[a].actions[0].typ == s.decisions[0].actions[0].typ
    assert r.decisions[a].actions[0].active == s.decisions[0].actions[0].active
    assert r.decisions[a].actions[0].required == s.decisions[0].actions[0].required
    assert r.decisions[a].actions[0].hover == s.decisions[0].actions[0].hover
    assert r.decisions[a].actions[0].answers[0] == s.decisions[0].actions[0].answers[0]
    assert r.decisions[b].text == s.decisions[1].text
    assert r.decisions[b].name == s.decisions[1].name
    assert r.decisions[b].points == s.decisions[1].points
    assert r.decisions[b].max_points == s.decisions[1].max_points
    assert r.decisions[b].goal == s.decisions[1].goal 
    mongo.remove(s)
    mongo.remove(sid)

def test_mongo_scenario_update():
    mongo = ScenarioMongoModel()
    s = Scenario(budget=300, name="Old", scheduled_days=3)
    
    mid = mongo.save(s)
    result = mongo.get(mid)
    assert result.id == s.id

    result.budget = 301
    result.name = "New Name"
    result.scheduled_days = 2
    with pytest.raises(ValueError):
        mongo.update(result)
    mongo.remove(s)

def test_mongo_userscenario_update():
    mongo = ScenarioMongoModel()
    s = UserScenario(current_day = 12)
    
    mid = mongo.save(s)
    result = mongo.get(mid)

    assert result.id == s.id
    assert len(result.task_queue) == 0

    result.current_day = 301
    result.task_queue.add(Task())

    mongo.update(result)

    result2 = mongo.get(mid)

    assert result2.current_day == 301
    assert len(result2.task_queue) == 1
    mongo.remove(s)


def test_mongo_scenario_can_be_saved_loaded_and_deleted():
    mongo = ScenarioMongoModel()
    s = Scenario(budget=100000, scheduled_days=40, tasks_easy=300)
    s2 = UserScenario(user='alice', current_day=12)

    mid = mongo.save(s)
    result = mongo.get(mid)
    assert result.budget == s.budget
    assert result.tasks_easy == s.tasks_easy
    assert result.id == s.id

    mid2 = mongo.save(s2)
    result2 = mongo.get(mid2)
    assert result2.user == s2.user
    assert result2.current_day == s2.current_day
    assert result2.id == s2.id

    mongo.remove(mid)
    with pytest.raises(NoObjectWithIdException):
        mongo.get(mid)
    
    result3 = mongo.get(mid2)
    assert result2.id == result3.id == s2.id

    mongo.remove(mid2)
    with pytest.raises(NoObjectWithIdException):
        mongo.get(mid2)



def test_number_of_total_templates():
    mongo = ScenarioMongoModel()
    n = len(mongo.find_all_templates())

    s = Scenario()
    id = mongo.save(s)

    assert n+1 == len(mongo.find_all_templates())
    mongo.remove(id)
    assert n == len(mongo.find_all_templates())

"""
def test_mongo_scenario_saves_text_blocks():
    mongo = ScenarioMongoModel()
    s = Scenario()
    d = AnsweredDecision()
    d.add_text_block("Title", "This is some sweet content!")
    d.add_text_block("Title 2", "C2")
    s.add(d)
    mid = mongo.save(s)

    result = mongo.get(mid)

    block = next(result).text[1]
    assert "Title 2" == block.header
    assert "C2" == block.content


def test_decision_saves_dtype_and_points():
    mongo = ScenarioMongoModel()
    s = Scenario()
    d = AnsweredDecision(points=200)
    d.add_text_block("Title", "This is some sweet content!")
    d.add_text_block("Title 2", "C2")
    s.add(d)
    mid = mongo.save(s)

    result = mongo.get(mid)

    dec = result.decisions[0]
    assert isinstance(dec, AnsweredDecision)
    assert isinstance(dec, Decision)
    assert not isinstance(dec, SimulationDecision)
    assert dec.points == 200


def test_team_members_are_saved():
    mongo = ScenarioMongoModel()
    s = Scenario()
    s.team += Member(xp_factor=1, motivation=0.5, familiarity=0)

    mid = mongo.save(s)

    result = mongo.get(mid)
    team = result.team

    m = team.staff[0]

    assert m.xp_factor == 1
    assert m.motivation == 0.5
    assert m.familiarity == 0
    assert m.halted is False

    assert m.skill_type == SkillType('junior')


def test_halted_team_members_are_saved():
    mongo = ScenarioMongoModel()
    s = Scenario()
    m = Member()
    m.halt()
    s.team += m

    mid = mongo.save(s)

    result = mongo.get(mid)
    team = result.team

    m = team.staff[0]

    assert m.halted is True


def test_team_members_skill_type_are_saved():
    mongo = ScenarioMongoModel()
    s = Scenario()
    s.team += Member('senior')
    s.team += Member('expert')

    mid = mongo.save(s)

    result = mongo.get(mid)
    team = result.team

    stypes = [m.skill_type for m in team.staff]

    assert SkillType('senior') in stypes
    assert SkillType('expert') in stypes
    assert SkillType('junior') not in stypes


def test_member_id_is_same_when_saved():
    mongo = ScenarioMongoModel()
    s = Scenario()
    s.team += Member()
    m = Member(skill_type='senior', xp_factor=0.1, motivation=1, familiarity=0)
    _id = m.get_id()
    s.team += m
    s.team += Member(skill_type='senior')

    mid = mongo.save(s)
    result = mongo.get(mid)
    team = result.team

    m2 = team.get_member(_id)

    assert m2.get_id() == m.get_id()
    assert m2.skill_type == m.skill_type
    assert m2.xp_factor == m.xp_factor
    assert m2.motivation == m.motivation
    assert m2.familiarity == m.familiarity


def test_members_have_different_id():
    mongo = ScenarioMongoModel()
    s = Scenario()

    m1 = Member(skill_type='senior', xp_factor=0.1, motivation=1, familiarity=0)
    id1 = m1.get_id()
    s.team += m1

    m2 = Member(skill_type='expert', xp_factor=0.5, motivation=0, familiarity=0.099)
    id2 = m2.get_id()
    s.team += m2

    sid = mongo.save(s)

    result = mongo.get(sid)

    team = result.team

    m1n = team.get_member(id1)
    assert m1n.get_id() == m1.get_id()
    assert m1n.motivation == m1.motivation

    m2n = team.get_member(id2)
    assert m2n.get_id() == m2.get_id()
    assert m2n.motivation == m2.motivation


def test_remove_member_saved_in_database():
    mongo = ScenarioMongoModel()
    s = Scenario()
    s.team += Member()
    m = Member('expert', motivation=0.5, xp_factor=0, familiarity=0)
    s.team += m
    s.team += Member('expert')

    sid = mongo.save(s)
    result = mongo.get(sid)
    team = result.team

    assert m in team
    assert len(team) == 3
    team -= m
    assert m not in team
    assert len(team) == 2


def test_can_save_different_decision_types():
    mongo = ScenarioMongoModel()
    s = Scenario()
    s.add(AnsweredDecision())
    s.add(Decision())
    s.add(SimulationDecision(goal=SimulationGoal(tasks=2)))

    sid = mongo.save(s)
    result = mongo.get(sid)

    d = next(result)
    assert isinstance(d, Decision)
    assert isinstance(d, AnsweredDecision)
    assert not isinstance(d, SimulationDecision)

    d = next(result)
    assert isinstance(d, Decision)
    assert not isinstance(d, SimulationDecision)

    d = next(result)
    assert isinstance(d, Decision)
    assert not isinstance(d, AnsweredDecision)
    assert isinstance(d, SimulationDecision)


def test_simulation_goal_is_saved():
    mongo = ScenarioMongoModel()
    s = Scenario()
    s.add(SimulationDecision(goal=SimulationGoal(tasks=2)))
    sid = mongo.save(s)
    result = mongo.get(sid)
    d = next(result)
    assert d.goal == SimulationGoal(tasks=2)


def test_custom_name_for_scenario():
    s = Scenario(name="CoolName")
    mongo = ScenarioMongoModel()
    mid = mongo.save(s)

    res = mongo.get(mid)

    assert res.name == 'CoolName'


def test_change_decision():
    s = Scenario()
    mongo = ScenarioMongoModel()
    s.add(Decision())
    mid = mongo.save(s)
    res = mongo.get(mid)
    d = res.get_decision(0)
    d.add_text_block(header="hi", content="None")
    mongo.update(res)
    res2 = mongo.get(mid)
    assert res2.get_decision(0).text[0].header == "hi"


def test_mongo_scenario_saves_decision_tree():
    mongo = ScenarioMongoModel()
    s = Scenario()
    s.actions.scrap_actions()
    d = AnsweredDecision()
    s.add(d)
    d2 = AnsweredDecision()
    d2.active_actions.append('model-pick')
    s.add(d2)

    mid = mongo.save(s)

    s = mongo.get(mid)
    next(s)
    assert len(s.button_rows) == 0
    next(s)
    assert len(s.button_rows) == 1
    assert s.button_rows[0]['title'] == 'Model'


def test_mongo_stores_points_for_answer():
    mongo = ScenarioMongoModel()
    s = Scenario()
    s.actions.scrap_actions()
    d = AnsweredDecision()
    d.add_button_action(title='Model', answers=[{'label': 'Waterfall', 'points': 100}, {'label': 'Scrum', 'points': 0},
                                                {'label': 'Spiral', 'points': 0}])
    s.add(d)
    next(s)
    assert len(s.button_rows) == 1
    assert s.button_rows[0]['title'] == 'Model'
    assert 'Waterfall' in [a['label'] for a in s.button_rows[0]['answers']]
    assert 'Scrum' in [a['label'] for a in s.button_rows[0]['answers']]
    assert 'Spiral' in [a['label'] for a in s.button_rows[0]['answers']]
    assert 'Kanban' not in [a['label'] for a in s.button_rows[0]['answers']]

    mid = mongo.save(s)

    s = mongo.get(mid)

    assert len(s.button_rows) == 1
    assert s.button_rows[0]['title'] == 'Model'
    assert 'Waterfall' in [a['label'] for a in s.button_rows[0]['answers']]
    assert 'Scrum' in [a['label'] for a in s.button_rows[0]['answers']]
    assert 'Spiral' in [a['label'] for a in s.button_rows[0]['answers']]
    assert 'Kanban' not in [a['label'] for a in s.button_rows[0]['answers']]


def test_save_click_history():
    model = ClickHistoryModel()
    id = model.new_hist()
    json = model.get(id)

    assert json == {"_id": id}

def test_save_click_history_add_event():
    model = ClickHistoryModel()
    id = model.new_hist()

    event = {'btn_id': 'model', 'answer': 'scrum'}
    model.add_event(id, event)
    assert model.get(id) == {'_id': id, 'events': [event]}

    event2 = {'decision_index': 3, 'btn_id': 'life-cycle', 'answer': 'iterative'}
    model.add_event(id, event2)
    assert model.get(id) == {'_id': id, 'events': [event, event2]}
 """