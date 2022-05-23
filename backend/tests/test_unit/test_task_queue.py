from app.src_deprecated.task_queue import TaskQueue
from app.src_deprecated.task import Task, Difficulty
from bson.objectid import ObjectId

import pytest


def test_instantiate_task_queue():
    tq = TaskQueue()


def test_task_queue_tasks():
    tq = TaskQueue()
    assert isinstance(tq.tasks, set)


def test_task_queue_get():
    tq = TaskQueue()
    r = tq.get()
    assert isinstance(r, set)


def test_add():
    tq = TaskQueue()

    assert len(tq.get()) == 0
    tq.add(Task())  # Add a single task.
    assert len(tq.get()) == 1
    tq.add([Task(), Task()])  # Add list of tasks
    assert len(tq.get()) == 3

    for e in ["String", 3, Difficulty.EASY]:
        with pytest.raises(TypeError):
            tq.add(e)


def test_add_task():
    tq = TaskQueue()
    t_id = ObjectId()
    t_d = Difficulty.HARD
    t_done = True
    t_bug = False

    t = Task(id=t_id, difficulty=t_d, done=t_done, bug=t_bug)

    assert tq.tasks == set()
    assert tq.get() == set()

    tq.add(t)

    assert tq.tasks == {t}
    assert tq.get() == {t}

def test_tq_get():
    tq = TaskQueue()
    tasks_all = [
        Task(difficulty=2, done=True),
        Task(difficulty=3),
        Task(difficulty=2),
        Task(difficulty=3, done=True)
    ]
    tq.add(tasks_all)

    tasks_filtered = tq.get()
    assert len(tasks_filtered) == 4

    tasks_filtered = tq.get(difficulty=Difficulty.MEDIUM)
    assert len(tasks_filtered) == 2
    assert tasks_all[0] in tasks_filtered
    assert tasks_all[1] not in tasks_filtered
    assert tasks_all[2] in tasks_filtered

    tasks_filtered = tq.get(done=False)
    assert len(tasks_filtered) == 2
    assert tasks_all[0] not in tasks_filtered
    assert tasks_all[1] in tasks_filtered
    assert tasks_all[2] in tasks_filtered

    tasks_filtered = tq.get(done=True)
    assert len(tasks_filtered) == 2
    assert tasks_all[0] in tasks_filtered
    assert tasks_all[1] not in tasks_filtered
    assert tasks_all[3] in tasks_filtered

    tasks_filtered = tq.get(difficulty=Difficulty.HARD, done=True)
    assert len(tasks_filtered) == 1
    assert tasks_all[0] not in tasks_filtered
    assert tasks_all[1] not in tasks_filtered
    assert tasks_all[2] not in tasks_filtered
    assert tasks_all[3] in tasks_filtered


def test_get_set_size():
    tq = TaskQueue()
    tasks_all = [
        Task(difficulty=2, done=True),
        Task(difficulty=3),
        Task(difficulty=2),
        Task(difficulty=3, done=True)
    ]
    tq.add(tasks_all)

    assert len(tq.get(n=1)) == 1
    assert len(tq.get(n=10)) == 4
    assert len(tq.get(n=3)) == 3


    assert len(tq.get(done=True, n=2)) == 2
    assert len(tq.get(done=True, n=1)) == 1
    assert len(tq.get(done=True, n=3)) == 2



def test_tq_deserialize():
    tq = TaskQueue()
    pid = ObjectId()
    tq.add(Task(difficulty=Difficulty.HARD, done=True))
    tq.add(Task(unit_tested=True, pred=pid, done_by=ObjectId()))

    j = tq.json

    tq2 = TaskQueue(**j)

    assert len(tq.get()) == 2
    assert len(tq2.get()) == 2

    assert len(tq.get(pred=pid)) == 1
    assert len(tq2.get(pred=pid)) == 1

    assert len(tq.get(difficulty=Difficulty.HARD)) == 1
    assert len(tq2.get(difficulty=Difficulty.HARD)) == 1

    assert len(tq.get(difficulty=Difficulty.MEDIUM)) == 0
    assert len(tq2.get(difficulty=Difficulty.MEDIUM)) == 0

    assert len(tq.get(difficulty=Difficulty.EASY)) == 1
    assert len(tq2.get(difficulty=Difficulty.EASY)) == 1

    assert len(tq.get(pred=pid, unit_tested=True)) == 1
    assert len(tq2.get(pred=pid, unit_tested=True)) == 1

    assert len(tq.get(pred=pid, unit_tested=True, bug=True)) == 0
    assert len(tq2.get(pred=pid, unit_tested=True, bug=True)) == 0



def test_reset_cascade():
    tq = TaskQueue()

    i1 = ObjectId()
    i2 = ObjectId()
    i3 = ObjectId()
    i4 = ObjectId()

    t1 = Task(id=i1, done=True)
    t2 = Task(id=i2, pred=i1, done=True)
    t3 = Task(id=i3, pred=i2, done=True)
    t4 = Task(id=i4, done=True)

    tq.add([t1, t2, t3, t4])

    assert len(tq.get(done=True)) == 4
    tq.reset_cascade(t1)
    assert len(tq.get(done=True)) == 1
    assert tq.get(done=True).pop() == t4

def test_reset_cascade2():
    tq = TaskQueue()

    i1 = ObjectId()
    i2 = ObjectId()
    i3 = ObjectId()
    i4 = ObjectId()

    t1 = Task(id=i1, done=True)
    t2 = Task(id=i2, pred=i1, done=True)
    t3 = Task(id=i3, pred=i1, done=True)
    t4 = Task(id=i4, done=True)

    tq.add([t1, t2, t3, t4])

    assert len(tq.get(done=True)) == 4
    tq.reset_cascade(t1)
    assert len(tq.get(done=True)) == 1
    assert tq.get(done=True).pop() == t4

def test_reset_cascade_circluar():
    tq = TaskQueue()

    i1 = ObjectId()
    i2 = ObjectId()
    i3 = ObjectId()
    i4 = ObjectId()

    t1 = Task(id=i1, pred=i3, done=True)
    t2 = Task(id=i2, pred=i1, done=True)
    t3 = Task(id=i3, pred=i2, done=True)
    t4 = Task(id=i4, done=True)

    tq.add([t1, t2, t3, t4])

    assert len(tq.get(done=True)) == 4
    tq.reset_cascade(t1)
    assert len(tq.get(done=True)) == 1
    assert tq.get(done=True).pop() == t4

"""
def test_tq_initialize():
    tq = TaskQueue()
    assert tq.easy.todo == 0
    assert tq.medium.todo == 0
    assert tq.hard.todo == 0

    assert tq.easy.solved == 0
    assert tq.medium.solved == 0
    assert tq.hard.solved == 0


def test_tq_from_json():
    json = {'easy': {'todo': 5, 'solved': 5, 'error_unidentified': 2, 'error_identified': 15, 'unit_tested': 900},
            'medium': {'todo': 10, 'solved': 0, 'error_unidentified': 4, 'error_identified': 23, 'unit_tested': 435},
            'hard': {'todo': 15, 'solved': 0, 'error_unidentified': 23, 'error_identified': 1, 'unit_tested': 0}
            }
    tq = TaskQueue(easy=json.get('easy'), medium=json.get(
        'medium'), hard=json.get('hard'))
    assert tq.easy.todo == json.get('easy').get('todo')
    assert tq.easy.solved == json.get('easy').get('solved')
    assert tq.easy.error_unidentified == json.get(
        'easy').get('error_unidentified')
    assert tq.easy.error_identified == json.get('easy').get('error_identified')
    assert tq.easy.unit_tested == json.get('easy').get('unit_tested')

    assert tq.medium.todo == json.get('medium').get('todo')
    assert tq.medium.solved == json.get('medium').get('solved')
    assert tq.medium.error_unidentified == json.get(
        'medium').get('error_unidentified')
    assert tq.medium.error_identified == json.get(
        'medium').get('error_identified')
    assert tq.medium.unit_tested == json.get('medium').get('unit_tested')

    assert tq.hard.todo == json.get('hard').get('todo')
    assert tq.hard.solved == json.get('hard').get('solved')
    assert tq.hard.error_unidentified == json.get(
        'hard').get('error_unidentified')
    assert tq.hard.error_identified == json.get('hard').get('error_identified')
    assert tq.hard.unit_tested == json.get('hard').get('unit_tested')


def test_tq_to_json():
    tq = TaskQueue(easy=5, medium=10, hard=15)
    assert tq.json == {
        'easy': {
            'todo': 5,
            'solved': 0,
            'error_unidentified': 0,
            'error_identified': 0,
            'tested': 0,
            'integration_tested': 0,
        },
        'medium': {
            'todo': 10,
            'solved': 0,
            'error_unidentified': 0,
            'error_identified': 0,
            'tested': 0,
            'integration_tested': 0,
        },
        'hard': {
            'todo': 15,
            'solved': 0,
            'error_unidentified': 0,
            'error_identified': 0,
            'tested': 0,
            'integration_tested': 0,
        }
    }


def test_task_queue_init(tq):
    assert tq.easy.todo == 5
    assert tq.medium.todo == 10
    assert tq.hard.todo == 15


def test_task_queue_len(tq):
    assert len(tq) == 30

    tq2 = TaskQueue(easy=_TaskQueue(todo=100, solved=25, error_unidentified=5),
                    medium=_TaskQueue(todo=200, solved=25,
                                      error_unidentified=5),
                    hard=_TaskQueue(todo=50, solved=25, error_unidentified=5))

    assert len(tq2) == 100 + 200 + 50 + 25 * 3 + 5 * 3


def test_task_queue_solve_junior(tq):
    tq.solve(7, Member(skill_type='junior'))

    assert tq.easy.todo == 0
    assert tq.medium.todo == 8
    assert tq.hard.todo == 15

    assert tq.easy.done == 5
    assert tq.medium.done == 2
    assert tq.hard.done == 0


def test_task_queue_solve_senior(tq):
    tq.solve(2, Member(skill_type='senior'))

    assert tq.easy.todo == 5
    assert tq.medium.todo == 8
    assert tq.hard.todo == 15

    assert tq.easy.done == 0
    assert tq.medium.done == 2
    assert tq.hard.done == 0


def test_task_queue_solve_senior2(tq):
    tq.solve(25, Member(skill_type='senior'))

    assert tq.easy.todo == 0
    assert tq.medium.todo == 0
    assert tq.hard.todo == 5

    assert tq.easy.done == 5
    assert tq.medium.done == 10
    assert tq.hard.done == 10


def test_task_queue_solve_senior3(tq):
    tq.solve(14, Member(skill_type='senior'))

    assert tq.easy.todo == 3
    assert tq.medium.todo == 0
    assert tq.hard.todo == 13

    assert tq.easy.done == 2
    assert tq.medium.done == 10
    assert tq.hard.done == 2


def test_task_queue_solve_expert(tq):
    tq.solve(20, Member(skill_type='expert'))
    assert tq.easy.todo == 5
    assert tq.medium.todo == 5
    assert tq.hard.todo == 0

    assert tq.easy.done == 0
    assert tq.medium.done == 5
    assert tq.hard.done == 15


def test_task_queue_solve_errors_are_made():
    tq_easy = TaskQueue(easy=500)
    m = Member(skill_type='junior')
    tq_easy.solve(500, m)
    assert tq_easy.easy.todo == 0
    assert tq_easy.easy.done == 500

    tq_medium = TaskQueue(medium=500)
    m = Member(skill_type='junior')
    tq_medium.solve(500, m)
    assert tq_medium.medium.todo == 0
    assert tq_medium.medium.done == 500

    tq_hard = TaskQueue(hard=500)
    m = Member(skill_type='junior')
    tq_hard.solve(500, m)
    assert tq_hard.hard.todo == 0
    assert tq_hard.hard.done == 500

    # A junior should make more errors on medium and even more on hard, in a really really unlucky coincidence this test
    # might fail due to the randomness of the error calculation, but n=500 should cover most of the cases
    assert tq_easy.easy.error_unidentified < tq_medium.medium.error_unidentified
    assert tq_medium.medium.error_unidentified < tq_hard.hard.error_unidentified

    assert tq_easy.easy.error_unidentified + \
        tq_easy.easy.solved == tq_easy.easy.done
    assert tq_medium.medium.error_unidentified + \
        tq_medium.medium.solved == tq_medium.medium.done
    assert tq_hard.hard.error_unidentified + \
        tq_hard.hard.solved == tq_hard.hard.done


def test_task_queue_more_tasks_than_todo():
    tq = TaskQueue(easy=3, medium=3, hard=3)
    n = tq.solve(10, Member(skill_type='expert'))

    assert tq.easy.todo == 0
    assert tq.medium.todo == 0
    assert tq.hard.todo == 0

    assert tq.easy.done == 3
    assert tq.medium.done == 3
    assert tq.hard.done == 3

    assert n == 1  # n=1 tasks are left


def test_tq_testing():
    tq = TaskQueue(easy=_TaskQueue(error_unidentified=10, solved=10))

    n = tq.test(10, Member(skill_type='junior'))

    assert n == 0

    assert tq.easy.error_unidentified + tq.easy.solved == 10
    assert tq.easy.unit_tested + tq.easy.error_identified == 10


def test_tq_juniors_cant_test_hard_tasks():
    tq = TaskQueue(hard=_TaskQueue(error_unidentified=10, solved=10))

    n = tq.test(10, Member(skill_type='junior'))

    assert n == 10

    assert tq.hard.error_unidentified == 10
    assert tq.hard.unit_tested == 0
    assert tq.hard.solved == 10


def test_tq_expert_testing():
    tq = TaskQueue(easy=_TaskQueue(error_unidentified=3, solved=3),
                   hard=_TaskQueue(error_unidentified=10, solved=5))

    n = tq.test(20, Member(skill_type='expert'))

    assert n == 0

    assert tq.hard.error_unidentified == 0
    assert tq.hard.unit_tested == 5
    assert tq.hard.solved == 0
    assert tq.hard.error_identified == 10

    assert tq.easy.unit_tested + tq.easy.error_identified == 5
    assert tq.easy.error_unidentified + tq.easy.solved == 1


def test_tq_fixing():
    tq = TaskQueue(easy=_TaskQueue(error_identified=10))

    n = tq.fix(20, Member(skill_type='junior'))

    assert n == 10

    assert tq.easy.error_identified == 0
    assert tq.easy.unit_tested == 10


def test_complex_scenarios_of_task_queues():
    tq = TaskQueue(
        easy=_TaskQueue(todo=300, error_unidentified=10,
                        solved=10, error_identified=10, unit_tested=0),
        medium=_TaskQueue(todo=10, error_unidentified=0,
                          solved=10, error_identified=10, unit_tested=50),
        hard=_TaskQueue(todo=5, error_unidentified=0, solved=0,
                        error_identified=0, unit_tested=0),
    )

    n = tq.solve(300, Member(skill_type='junior'))
    assert n == 0
    assert tq.easy.todo == 0
    assert tq.easy.done == 320

    n = tq.solve(10, Member(skill_type='expert'))
    assert n == 0
    assert tq.medium.todo == 5
    assert tq.medium.done == 15
    assert tq.hard.todo == 0
    assert tq.hard.done == 5

    n = tq.test(120, Member(skill_type='senior'))
    assert n == 0
    assert tq.total_error_identified > 20
    assert tq.total_tasks_unit_tested > 50

    tested = tq.total_tasks_unit_tested

    errors = tq.total_error_identified

    n = tq.fix(errors, Member(skill_type='expert'))
    assert n == 0
    assert tq.total_tasks_unit_tested == tested + errors


@pytest.fixture
def tq_inner():
    return _TaskQueue(todo=400, solved=25, error_unidentified=5)


def test_inner_tq_gets_initialized():
    tq = _TaskQueue()
    assert tq.todo == 0
    assert tq.solved == 0
    assert tq.error_unidentified == 0
    assert tq.error_identified == 0
    assert tq.unit_tested == 0
    assert tq.done == 0

    tq = _TaskQueue(todo=400, solved=25, error_unidentified=5,
                    error_identified=12, unit_tested=50)
    assert tq.todo == 400
    assert tq.solved == 25
    assert tq.error_unidentified == 5
    assert tq.error_identified == 12
    assert tq.unit_tested == 50
    assert tq.done == tq.solved + tq.error_unidentified


def test_inner_tq_json(tq_inner):
    assert tq_inner.json == {
        'todo': 400,
        'solved': 25,
        'error_unidentified': 5,
        'error_identified': 0,
        'tested': 0,
        'integration_tested': 0,
    }


def test_tq_qualitiy_score():
    tq = TaskQueue(easy=_TaskQueue(todo=0, solved=25, error_unidentified=5, error_identified=12, unit_tested=50),
                   medium=_TaskQueue(
                       todo=0, solved=25, error_unidentified=5, error_identified=12, unit_tested=50),
                   hard=_TaskQueue(todo=0, solved=25, error_unidentified=5, error_identified=12, unit_tested=50))
    er = 5 * 3 + 12 * 3
    ok = 25 * 3 + 50 * 3
    tot = er + ok
    assert tq.quality_score == int(((tot - er) * (1 / tot)) ** 8 * 100)
"""
