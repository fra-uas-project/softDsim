import pytest

from bson.objectid import ObjectId

from app.src_deprecated.task import Task, Difficulty
from app.src_deprecated.team import TASK_COMPLETION_COEF, Member


def test_instantiate_task():
    t = Task()


def test_task_has_id():
    t = Task()
    assert isinstance(t.id, ObjectId)


def test_task_difficulty():
    t1 = Task(difficulty=2)
    assert t1.difficulty == Difficulty.MEDIUM

    t2 = Task(difficulty=Difficulty.HARD)
    assert t2.difficulty == Difficulty.HARD

    t3 = Task()
    assert t3.difficulty == Difficulty.EASY

    t4 = Task(difficulty="2")
    assert t4.difficulty == Difficulty.MEDIUM


def test_task_bool_attributes():
    t = Task()

    assert t.done == False
    assert t.bug == False
    assert t.correct_specification == True

    t2 = Task(done=True, bug=True, correct_specification=False)

    assert t2.done == True
    assert t2.bug == True
    assert t2.correct_specification == False


def test_done_by():
    m = Member()
    t = Task(done_by=m.id)

    m2 = Member()
    t2 = Task(done_by=str(m2.id))

    assert isinstance(t.done_by, ObjectId)
    assert isinstance(t2.done_by, ObjectId)

    assert t.done_by == m.id
    assert t2.done_by == m2.id
    assert t.done_by != m2.id
    assert t.done_by != t2.done_by


def test_predecessor():
    t0 = Task()
    t1 = Task(pred=t0.id)

    assert t0.pred is None
    assert t1.pred == t0.id


def test_task_to_json():
    _id = ObjectId()
    m = Member()
    t = Task(id=_id, difficulty=3, done=True, bug=False, done_by=m.id)

    json = {
        'id': str(_id),
        'difficulty': 3,
        'done': True,
        'bug': False,
        'correct_specification': True,
        'unit_tested': False,
        'integration_tested': False,
        'done_by': str(m.id)
    }

    assert t.json == json
    assert t.json.get('pred') is None

    _id2 = ObjectId()
    t2 = Task(id=_id2, difficulty=Difficulty.MEDIUM,
              pred=t.id, correct_specification=False)

    json2 = {
        'id': str(_id2),
        'difficulty': 2,
        'done': False,
        'bug': False,
        'correct_specification': False,
        'unit_tested': False,
        'integration_tested': False,
        'pred': str(t.id),
    }

    assert t2.json == json2
    assert t2.json.get('done_by') is None


def test_task_filter_difficulty():

    t = Task(difficulty=3)
    assert t.filter(difficulty=Difficulty.HARD) == True
    assert t.filter(difficulty=1) == False
    assert t.filter(difficulty=Difficulty.MEDIUM) == False

    t = Task(difficulty=Difficulty.MEDIUM)
    assert t.filter(difficulty=Difficulty.HARD) == False
    assert t.filter(difficulty=1) == False
    assert t.filter(difficulty=Difficulty.MEDIUM) == True

    t = Task()
    assert t.filter(difficulty=Difficulty.HARD) == False
    assert t.filter(difficulty=Difficulty.EASY) == True
    assert t.filter(difficulty=Difficulty.MEDIUM) == False


def test_task_filter_done():
    
    t = Task(done=True)
    assert t.filter(done=True) == True
    assert t.filter(done=False) == False

    t = Task(difficulty=3, id=ObjectId(), bug=True)
    assert t.filter(done=True) == False
    assert t.filter(done=False) == True

    t = Task(difficulty=1, id=ObjectId(), done=True, bug=True)
    assert t.filter(done=True) == True
    assert t.filter(done=False) == False


def test_task_filter_done_by():
    
    m = Member()
    t = Task(done=True, done_by=m.id)

    assert t.filter(done_by=m.id) == True
    assert t.filter(done_by=ObjectId()) == False

def test_task_filter_combination1():
    m = Member()
    t0 = Task()
    _id = ObjectId()
    t = Task(id=_id, difficulty=Difficulty.HARD, done=True, done_by=m.id, pred=t0.id, correct_specification=False, bug=True)

    # Testing id
    assert t.filter(id=_id)
    assert t.filter(id=ObjectId(str(_id)))
    assert not t.filter(id=m.id)

    assert not t0.filter(id=_id)
    assert not t0.filter(id=_id, done=False)
    assert t0.filter(done=False)
    assert t0.filter(done=False, bug=False)
    assert t0.filter(done=False, bug=False, done_by=None)
    assert not t0.filter(done=False, bug=True, done_by=None)
    assert not t0.filter(done=True, bug=True, done_by=m.id)

    assert t.filter()
    assert t.filter(done=True)
    assert t.filter(difficulty=Difficulty.HARD, done=True)
    assert t.filter(done=True, id=_id)
    assert not t.filter(done=False, id=_id)
    assert t.filter(done_by=m.id, difficulty=Difficulty.HARD, correct_specification=False, bug=True)
    assert t.filter(pred=t0.id, id=t.id, done=True, done_by=m.id, difficulty=Difficulty.HARD, correct_specification=False, bug=True)
    assert not t.filter(pred=m.id, id=t.id, done=True, done_by=m.id, difficulty=Difficulty.HARD, correct_specification=False, bug=True)
    assert not t.filter(pred=t0.id, id=t.id, done=False, done_by=m.id, difficulty=Difficulty.HARD, correct_specification=False, bug=True)
    assert not t.filter(pred=t0.id, id=t.id, done=True, done_by=m.id, difficulty=Difficulty.EASY, correct_specification=False, bug=True)
    assert not t.filter(pred=t0.id, id=t.id, done=True, done_by=m.id, difficulty=Difficulty.HARD, correct_specification=True, bug=True)
    assert not t.filter(pred=t0.id, id=t.id, done=True, done_by=m.id, difficulty=Difficulty.HARD, correct_specification=False, bug=False)
    assert not t.filter(pred=t0.id, id=t0.id, done=True, done_by=m.id, difficulty=Difficulty.HARD, correct_specification=False, bug=True)
    assert not t.filter(pred=t0.id, id=t.id, done=True, done_by=ObjectId(), difficulty=Difficulty.HARD, correct_specification=False, bug=True)


    