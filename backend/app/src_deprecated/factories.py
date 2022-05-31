from bson.objectid import ObjectId

from app.src_deprecated.dataObjects import SimulationGoal
from app.src_deprecated.decision_tree import SimulationDecision, AnsweredDecision, ActionList
from app.src_deprecated.scenario import Scenario, UserScenario
from app.src_deprecated.task_queue import TaskQueue
from app.src_deprecated.task import Task
from app.src_deprecated.team import Member, Team

from utils import remove_none_values

from copy import deepcopy


def parse_team(t, s):
    i = t.get('id') or str(ObjectId())
    team = Team(i)
    for m in t.get('staff'):
        member = Member(m.get('skill-type'), xp_factor=m.get('xp'), motivation=m.get('motivation'),
                        stress=m.get('stress'), familiarity=m.get('familiarity'),
                        familiar_tasks=m.get('familiar-tasks', 0), id=m.get('_id'), scenario=s)
        if m.get('halted'):
            member.halt()
        team += member
    return team

def create_task_queue(easy: int, medium: int, hard:int) -> TaskQueue:
    tq = TaskQueue()
    tq.add({Task(difficulty=d) for d in [*[1]*easy, *[2]*medium, *[3]*hard]})
    return tq


class _Factory:

    def deserialize(self, json, typ: str):
        if typ.lower() == "scenario":
            return self._create_scenario(json)
        if typ.lower() == "userscenario":
            return self._create_user_scenario(json)

    def create_user_scenario(self, user: str, template: dict, history_id: ObjectId) -> UserScenario:
        template = self.deserialize(template, 'scenario')
        us = UserScenario(user=user, id=ObjectId(), template=template, decisions=deepcopy(template.decisions), history=history_id,
                          tq=create_task_queue(easy=template.tasks_easy, medium=template.tasks_medium,
                                               hard=template.tasks_hard))
        us.actions.scrap_actions()
        return us

    def _create_scenario(self, data):
        d = deepcopy(data.pop('decisions', []))
        s = Scenario(**data)
        self._add_decisions(d, s)
        return s

    def _create_user_scenario(self, json) -> UserScenario:
        d = deepcopy(json.pop('decisions', []))
        json['actions'] = ActionList(json=json.get('actions'))
        json = remove_none_values(json)
        us = UserScenario(**json)
        if us.model.lower() == "scrum":
            if t := json.get('team'):
                if t := t.get('teams'):
                    for team in t:
                        us.team.teams.append(parse_team(team, us))
        else:
            if t := json.get('team'):
                if t is not None: 
                    us.team = parse_team(t, us)
        self._add_decisions(d, us)

        return us

    def _add_decisions(self, data, s):
        """
        Adds all decisions that are included in the list data in json (dict) format to the scenario typ object s.
        :param data: A list with decisions in json format (as python dicts).
        :param s: A Scenario or UserScenario typ of object.
        """
        for decision in data:
            kwargs = {}
            if ct := decision.get('continue_text'):
                kwargs['continue_text'] = ct
            if aa := decision.get('active_actions'):
                kwargs['active_actions'] = aa
            if n := decision.get('name'):
                kwargs['name'] = n
            if p := decision.get('points'):
                kwargs['points'] = p
            if g := decision.get('goal'):
                d = SimulationDecision(**kwargs, goal=SimulationGoal(tasks=g.get('tasks')), max_points=decision.get('max_points'))
            else:
                d = AnsweredDecision(**kwargs)
                for action in decision.get('actions'):
                    d.add_button_action(title=action.get('title', ''), id=action.get('id', ObjectId()),
                                        answers=[{'label': a['label'], 'active': a['active'], 'points': a['points']} for a in
                                                 action['answers']], required=action.get('required'),
                                        hover=action.get('hover', ""))
            for tb in decision.get('text', []):
                d.add_text_block(tb.get('header', ''), tb.get('content', ''))
            s.add(d)


Factory = _Factory()
