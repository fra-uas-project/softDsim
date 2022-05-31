from typing import Optional
import time

from mongo_models import ClickHistoryModel


def write(history_id, data, index):
    event = {'decision_index': index, 'user_opts': [], 'timestamp': int(time.time())}
    for answer in data.get('button_rows', []):
        event['user_opts'].append({'title': answer.get('title'),
                                   'answers': [a.get('label') for a in answer.get('answers') if a.get('active')],
                                   'id': answer.get('id')})
    for entry in data.get('numeric_rows', []):
        event['user_opts'].append({'title': entry.get('title'), 'values': entry.get('values'), 'id': entry.get('id')})

    for key in ['meetings', 'tasks_total', 'tasks_done', 'cost', 'current_day', 'actual_cost', 'motivation',
                'familiarity', 'stress']:
        if (value := data.get(key)) is not None:
            event[key] = value
    _write(event, history_id)


def _write(event, id):
    model = ClickHistoryModel()
    model.add_event(id, event)


class UserOption:
    def __init__(self, **kwargs):
        self.id = kwargs.get('id')
        self.title = kwargs.get('title')
        self.answers = kwargs.get('answers')
        self.values = kwargs.get('values')
        self.d_values = {}
        self.changed = False


class Event:
    def __init__(self, **kwargs):
        self.decision_index = kwargs.get('decision_index')
        self.meetings = kwargs.get('meetings')
        self.tasks_done = kwargs.get('tasks_done')
        self.tasks_total = kwargs.get('tasks_total')
        self.cost = kwargs.get('cost')
        self.current_day = kwargs.get('current_day')
        self.actual_cost = kwargs.get('actual_cost')
        self.motivation = kwargs.get('motivation')
        self.familiarity = kwargs.get('familiarity')
        self.stress = kwargs.get('stress')
        self.timestamp = kwargs.get('timestamp')
        self.user_opts = [UserOption(**uo) for uo in kwargs.get('user_opts') or []]
        self.predecessor: Optional[Event] = None

    def set_predecessor(self, pre):
        self.predecessor = pre

        for i in range(0, len(self.user_opts)):
            ou = self.user_opts[i]
            try:
                prou = pre.user_opts[i]
                if ou.values:
                    for key in ou.values:
                        ou.d_values[key] = ou.values.get(key) - prou.values.get(key)
                elif ou.answers:
                    ou.changed = not all([a in prou.answers for a in ou.answers])
            except:
                pass

    @property
    def d_stress(self):
        if self.predecessor:
            return self.stress - self.predecessor.stress
        else:
            return 0

    @property
    def d_tasks_done(self):
        if self.predecessor:
            return self.tasks_done - self.predecessor.tasks_done
        else:
            return 0

    @property
    def d_actual_cost(self):
        if self.predecessor:
            return self.actual_cost - self.predecessor.actual_cost
        else:
            return 0

    @property
    def d_familiarity(self):
        if self.predecessor:
            return self.familiarity - self.predecessor.familiarity
        else:
            return 0

    @property
    def d_cost(self):
        if self.predecessor:
            return self.cost - self.predecessor.cost
        else:
            return 0

    @property
    def d_motivation(self):
        if self.predecessor:
            return self.motivation - self.predecessor.motivation
        else:
            return 0

    @property
    def time(self):
        if self.predecessor:
            return round((self.timestamp - self.predecessor.timestamp), 1)
        else:
            return 0

    @property
    def week(self):
        if self.current_day == None:
            self.current_day = 0
        return int(self.current_day / 5)



class History:
    def __init__(self, **kwargs):
        self.id = kwargs.get('_id')
        self.events = [Event(**e) for e in kwargs.get('events') if e.get('decision_index') >= 0]

        for i in range(1, len(self.events)):
            self.events[i].set_predecessor(self.events[i - 1])

    def total_time(self) -> int:
        return self.events[-1].timestamp - self.events[0].timestamp
