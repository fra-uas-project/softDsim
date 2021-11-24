from dataclasses import dataclass, field
from typing import Optional

from bson import ObjectId

from app.src.domain.dataObjects import WorkPackage, WorkResult
from app.src.domain.decision_tree import ActionList, Decision, SimulationDecision
from app.src.domain.team import Team, ScrumTeam
from utils import month_to_day, quality


@dataclass
class Scenario:
    name: str
    budget: int
    scheduled_days: int
    decisions: list = field(default_factory=list)
    id: ObjectId = ObjectId()
    desc: str = ""
    tasks_easy: int = 0
    tasks_medium: int = 0
    tasks_hard: int = 0

    @property
    def tasks_total(self):
        return self.tasks_easy + self.tasks_medium + self.tasks_hard

    def add(self, decision):
        self.decisions.append(decision)

    @property
    def json(self):
        return {'name': self.name,
                'decisions': [dec.json for dec in self.decisions],
                'tasks_total': self.tasks_total,
                'tasks_easy': self.tasks_easy,
                'tasks_medium': self.tasks_medium,
                'tasks_hard': self.tasks_hard,
                'budget': self.budget,
                'scheduled_days': self.scheduled_days,
                '_id': str(self.id),
                'id': str(self.id),
                'desc': self.desc
                }


def create_staff_row(team: Team, title: str = 'staff'):
    return {
        'id': team.id,
        'title': f"{title}",
        'values':
            {
                'junior': team.count('junior'),
                'senior': team.count('senior'),
                'expert': team.count('expert')
            },
        'hover': "Juniors cost 3000/mo, have an error rate of 33% and have a throughput of 3 tasks. Seniors cost 4500/mo, have an error rate of 20% and have a throughput of 7 tasks. Experts cost 7000/mo, have an error rate of 5% and have a throughput of 7 tasks."
    }


class UserScenario:
    def __init__(self, **kwargs):
        self.identified_errors = int(kwargs.get('identified_errors', 0) or 0)
        self.tasks_easy_done = int(kwargs.get('tasks_easy_done', 0) or 0)
        self.tasks_medium_done = int(kwargs.get('tasks_medium_done', 0) or 0)
        self.tasks_hard_done = int(kwargs.get('tasks_hard_done', 0) or 0)
        self.errors = int(kwargs.get('errors', 0) or 0)
        self.actual_cost = int(kwargs.get('actual_cost', 0) or 0)
        self.current_day = int(kwargs.get('current_day', 0) or 0)
        self.counter = int(kwargs.get('counter', -1))
        self.decisions = kwargs.get('decisions', []) or []
        self.id = ObjectId(kwargs.get('id')) or ObjectId()
        self.actions = kwargs.get('actions') or ActionList()
        self.user = kwargs.get('user')
        self.template: Scenario = kwargs.get('scenario')
        self.perform_quality_check = False
        self.error_fixing = False
        self.model = kwargs.get('model', 'waterfall') or ""
        self.history_id: ObjectId = kwargs.get('history')
        self.current_wr = None
        if self.model.lower() == 'scrum':
            self.team = ScrumTeam()
        else:
            self.team = Team(str(ObjectId()))

    def __iter__(self):
        return self

    def __next__(self) -> Decision:
        self._eval_counter()
        if self.counter >= len(self.decisions):
            raise StopIteration
        return self.decisions[self.counter]

    def __len__(self) -> int:
        return len(self.decisions)

    def __eq__(self, other):
        if isinstance(other, Scenario):
            return self.id == other.id
        return False

    @property
    def tasks_done(self) -> int:
        return self.tasks_easy_done + self.tasks_medium_done + self.tasks_hard_done

    @property
    def json(self):
        d = {'tasks_done': self.tasks_done,
             'tasks_easy_done': self.tasks_easy_done,
             'tasks_medium_done': self.tasks_medium_done,
             'tasks_hard_done': self.tasks_hard_done,
             'errors': self.errors,
             'identified_errors': self.identified_errors,
             'decisions': [dec.json for dec in self.decisions],
             'actual_cost': self.actual_cost,
             'counter': self.counter,
             'current_day': self.current_day,
             'team': self.team.json,
             '_id': str(self.id),
             'id': str(self.id),
             'user': self.user,
             'actions': self.actions.json,
             'template_id': str(self.template.id),
             'model': self.model,
             'history': self.history_id
             }
        return d

    def add(self, decision: Decision):
        self.decisions.append(decision)

    def remove(self, index: int):
        del self.decisions[index]

    @property
    def button_rows(self):
        json = []
        d = self.decisions[self.counter]
        if isinstance(d, SimulationDecision):
            for a in d.active_actions or []:
                if (action := self.actions.get(a)) is not None and self.action_is_applicable(action):
                    json.append(action.json)
        else:
            for action in d.actions or []:
                json.append(action.json)
        return json

    @property
    def numeric_rows(self):
        json = []
        d = self.decisions[self.counter]
        for aa in d.active_actions:
            if aa == 'staff-pick':  # ToDo: Make this quick and dirty solution dynamic.
                if isinstance(self.team, Team):
                    json.append(create_staff_row(team=self.team))
                elif isinstance(self.team, ScrumTeam):
                    json.append({
                        'title': "Scrum Management",
                        'values':
                            {
                                'Junior Scrum Master': self.team.junior_master,
                                'Senior Scrum Master': self.team.senior_master,
                                'Product Owner': self.team.po
                            }
                    })
                    for i, team in enumerate(self.team.teams):
                        t = create_staff_row(team=team, title='Scrum Team')
                        json.append(t)

        return json

    def get_max_points(self) -> int:
        return sum([d.get_max_points() for d in self.decisions])

    def work(self, days, meeting, training):
        wp = WorkPackage(days=days, meeting_hours=meeting, training_hours=training,
                         quality_check=self.perform_quality_check,
                         error_fixing=self.error_fixing, tasks_easy=self.template.tasks_easy - self.tasks_easy_done,
                         tasks_medium=self.template.tasks_medium - self.tasks_medium_done,
                         tasks_hard=self.template.tasks_hard - self.tasks_hard_done,
                         unidentified_errors=self.errors, identified_errors=self.identified_errors,
                         total_tasks_done=self.tasks_done)
        wr = self.team.work(wp)
        self.current_wr = wr
        self._apply_work_result(wr)
        self.actual_cost += month_to_day(self.team.salary, days)
        self.current_day += days

    def _apply_work_result(self, wr: WorkResult):
        self.tasks_easy_done += wr.tasks_easy_completed
        self.tasks_medium_done += wr.tasks_medium_completed
        self.tasks_hard_done += wr.tasks_hard_completed
        self.identified_errors += wr.identified_errors
        self.identified_errors -= wr.fixed_errors
        self.errors += wr.unidentified_errors
        self.errors -= wr.identified_errors

    def get_id(self) -> str:
        return str(self.id)

    def _eval_counter(self):
        """
        Increases the value of the counter by one of the current decision is done.
        """
        if self.counter == -1:
            self.counter = 0
        else:
            d = self.decisions[self.counter]
            if (not isinstance(d, SimulationDecision)) or (
                    isinstance(d, SimulationDecision) and d.goal.reached(tasks=self.tasks_done)):
                self.counter += 1

    def get_decision(self, nr: int = None) -> Optional[Decision]:
        if nr is None:
            nr = self.counter
        if nr < 0:
            return None
        return self.decisions[nr]

    def get_answered_decisions(self):
        return [d for d in self.decisions if not isinstance(d, SimulationDecision)]

    def total_score(self) -> int:
        p = 0
        for d in self.decisions:
            p += d.points
        p += self.time_score()
        p += self.budget_score()
        p += self.quality_score()
        return p

    def time_score(self) -> int:
        # ToDo: use a defined factor instead of 100.
        # ToDo: the factor should have a weight that can be defined when create the scenario.
        return round((self.template.scheduled_days / self.current_day) * 100)

    def budget_score(self) -> int:
        return round((self.template.budget / self.actual_cost) * 100)

    def quality_score(self) -> int:
        return quality(self.tasks_done, self.errors)

    def action_is_applicable(self, action):
        """Returns True if an action is applicable. Actions can have restrictions, e.g. model must be scrum or kanban.
        This function checks whether the action's restrictions are applicable in this scenario."""
        applicable = True
        if self.model.lower() not in [x.lower() for x in action.get_restrictions().get('model-pick', [self.model])]:
            applicable = False
        return applicable
