from abc import ABC
from dataclasses import dataclass
from typing import List, Optional, Dict

from bson.objectid import ObjectId

from app.src_deprecated.dataObjects import SimulationGoal
from utils import YAMLReader


@dataclass
class Answer:
    label: str
    active: bool = False
    points: int = 0

    @property
    def json(self):
        return {"label": self.label, "active": self.active, "points": self.points}


@dataclass
class TextBlock(object):
    header: str
    content: str

    @property
    def json(self):
        return {"header": self.header, "content": self.content}


class Decision(ABC):
    def __init__(self, **kwargs):
        self.text: List[TextBlock] = kwargs.get("text", None)
        self.continue_text: str = kwargs.get("continue_text", "Continue")
        self.points = kwargs.get("points", 0)
        self.active_actions: List[str] = kwargs.get("active_actions", [])
        self.name = kwargs.get("name", "Decision")

    @property
    def json(self):
        data = {
            "continue_text": self.continue_text,
            "points": self.points,
            "active_actions": self.active_actions,
            "name": self.name,
        }
        if self.text:
            data = {**data, "text": [t.json for t in self.text]}
        return data

    def get_max_points(self):
        pass

    def eval(self, args):
        pass

    def add_text_block(self, header: str, content: str):
        t = TextBlock(header, content)
        if self.text:
            self.text.append(t)
        else:
            self.text = [t]


class AnsweredDecision(Decision):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.actions: List[Action] = [
            a if isinstance(a, Action) else Action(**a)
            for a in kwargs.get("actions", []) or []
        ]

    def add_button_action(
        self, title, answers, id=None, required=False, hover="", restrictions=None
    ):
        if id is None:
            id = str(ObjectId())
        self.actions.append(
            Action(
                id=id,
                title=title,
                typ="button",
                active=True,
                answers=answers,
                required=required,
                hover=hover,
                restrictions=restrictions,
            )
        )

    @property
    def json(self):
        return {**super().json, "actions": [a.full_json for a in self.actions]}

    def eval(self, data):
        """
        Evaluates a decision_models.
        :param data: Vue object that contains user choices.
        :return: None
        """
        user_actions = data["button_rows"]
        for action in self.actions:
            if user_answer_data := next(
                (item for item in user_actions if item["id"] == action.id), None
            ):
                user_answer = next(
                    (
                        item["label"]
                        for item in user_answer_data["answers"]
                        if item["active"] is True
                    ),
                    None,
                )
                p = action.get_points(user_answer)
                self.points += p


class SimulationDecision(Decision):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.goal: SimulationGoal = kwargs.get("goal")
        self.max_points: int = kwargs.get("max_points", 0)

    @property
    def json(self):
        return {**super().json, "goal": self.goal.json, "max_points": self.max_points}

    def set_goal(self, goal: SimulationGoal):
        self.goal = goal

    def get_max_points(self) -> int:
        return self.max_points


class Action:
    def __init__(
        self,
        id,
        title: str,
        typ: str,
        active: bool = False,
        answers=None,
        required=False,
        hover="",
        restrictions=None,
    ):
        self.id = id
        self.title = title
        self.typ = typ
        self.active = active
        self.hover = hover
        self.answers: List[Answer] = []
        self.required: bool = required
        self.restrictions: Dict[str : List[str]] = restrictions
        if answers:
            for answer in answers:
                if isinstance(answer, Answer):
                    self.answers.append(answer)
                else:
                    self.answers.append(Answer(**answer))

    @property
    def json(self):
        return {
            "title": self.title,
            "answers": self.format_answers(),
            "id": self.id,
            "required": self.required,
            "hover": self.hover,
        }

    @property
    def full_json(self):
        return {
            **self.json,
            "id": self.id,
            "typ": self.typ,
            "answers": [a.json for a in self.answers],
            "required": self.required,
            "hover": self.hover,
            "restrictions": self.restrictions,
        }

    def format_answers(self):
        ans = []
        for a in self.answers:
            ans.append({"label": a.label, "active": a.active})
        return ans

    def get_points(self, value: str) -> int:
        """
        Returns the points for a answer. Value must be the string that is also the answers label.
        :param value: str: the answers text.
        :return: int: points for that answer.
        """
        if not value:
            value = ""
        for answer in self.answers:
            if answer.label.lower() == value.lower():
                return answer.points
        return 0

    def get_restrictions(self):
        if self.restrictions:
            return self.restrictions
        return {}


class ActionList:
    def __init__(self, json=None):
        self.actions: List[Action] = []
        if json:
            for action in json:
                self.actions.append(Action(**action))

    @property
    def json(self):
        return [a.full_json for a in self.actions]

    def get(self, id) -> Optional[Action]:
        for action in self.actions:
            if action.id == id:
                return action
        return None

    def scrap_actions(self):
        for id in YAMLReader.read("actions", "button-rows"):
            if id not in [x.id for x in self.actions]:
                data = YAMLReader.read("actions", "button-rows", id)
                a = Action(
                    id,
                    data.get("title"),
                    "button",
                    hover=data.get("hover"),
                    restrictions=data.get("restrictions"),
                )
                for i, label in enumerate(data.get("values")):
                    a.answers.append(Answer(label, i + 1 == (data.get("active"))))
                self.actions.append(a)

    def adjust(self, data):
        if self.get(data.get("id")):
            for answer in self.get(data.get("id")).answers:
                for actual in data.get("answers", []):
                    if actual.get("label") == answer.label:
                        answer.active = actual.get("active")
