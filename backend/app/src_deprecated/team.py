import logging
import random

from statistics import mean
from typing import List
from enum import Enum

from bson.objectid import ObjectId

from app.src_deprecated.dataObjects import WorkPackage
from app.src_deprecated.task_queue import TaskQueue
from app.src_deprecated.task import Task
from utils import YAMLReader, probability, value_or_error, min_max_scaling

from numpy.random import poisson

# Config Variables
STRESS_ERROR_INCREASE = YAMLReader.read("stress", "error")
TASK_COMPLETION_COEF = YAMLReader.read("task-completion-coefficient")
TASKS_PER_MEETING = YAMLReader.read("tasks-per-meeting-coefficient")
TRAIN_SKILL_INCREASE_AMOUNT = YAMLReader.read("train-skill-increase-amount")
STRESS_PER_OVERTIME = YAMLReader.read("stress", "overtime")
STRESS_REDUCTION_PER_WEEKEND = YAMLReader.read("stress", "weekend-reduction")
MOTIVATION_INCREASE_PER_WEEKEND = 0.25
WORK_HOUR_MOTIVATION_REDUCTION = 0.0125


class Activity(Enum):
    SOLVE = 1
    TEST = 2
    FIX = 3


def inc(x: float, factor: float = 1.0):
    """
    Increase function for increasing member values (xp, motivation, familiarity). Currently just adds 0.1 with a
    limit of 1. :param x: current value  :return: float - x + 0.1
    """
    return min(
        [x + (0.01 * factor), 1.0]
    )  # ToDo: Find a fitting function that approaches 1


def order_tasks_for_member(tasks: set, skill_type) -> list[Task]:
    tasks = list(tasks)
    if skill_type.name == "junior":
        tasks = sorted(tasks, key=lambda t: t.difficulty.value)
    elif skill_type.name == "expert":
        tasks = sorted(tasks, key=lambda t: t.difficulty.value, reverse=True)
    elif skill_type.name == "senior":
        senior_tasks = []
        other_tasks = []
        for t in tasks:
            if t.difficulty.value == 2:
                senior_tasks.append(t)
            else:
                other_tasks.append(t)
        random.shuffle(other_tasks)
        tasks = senior_tasks + other_tasks

    return tasks


class Member:
    def __init__(
        self,
        skill_type: str = "junior",
        xp_factor: float = 0.0,
        motivation: float = 0.0,
        familiarity: float = 0.1,
        stress: float = 0.3,
        familiar_tasks=0,
        id=None,
        scenario=None,
    ):
        self.skill_type = SkillType(skill_type)
        self.xp_factor = value_or_error(xp_factor, upper=float("inf"))
        self.motivation = value_or_error(motivation)
        self.stress = value_or_error(stress)
        self.familiarity = value_or_error(familiarity)
        self.familiar_tasks = int(value_or_error(familiar_tasks, upper=float("inf")))
        self.halted = False
        self.id = ObjectId() if id is None else ObjectId(id)
        self.scenario = scenario

    def __eq__(self, other):
        if isinstance(other, Member):
            return self.id == other.id
        return False

    @property
    def json(self):
        return {
            "skill-type": self.skill_type.name,
            "xp": self.xp_factor,
            "motivation": self.motivation,
            "stress": self.stress,
            "familiarity": self.familiarity,
            "familiar-tasks": self.familiar_tasks,
            "halted": self.halted,
            "_id": str(self.id),
        }

    @property
    def efficiency(self) -> float:
        """
        Efficiency of a Member. Mean of motivation and familiarity and 1 - stress.
        :return: float
        """
        return mean([self.motivation, self.familiarity])

    def e(self, task: Task):
        if self.skill_type.name == "expert":
            return 0
        v = task.difficulty.value
        if self.skill_type.name == "senior":
            if v > 2:
                return 0.75
            return 0
        if v == 3:
            return 1
        if v == 2:
            return 0.5
        return 0

    def work(self, time: float, activity: Activity = Activity.SOLVE):
        if number_tasks == 0:
            number_tasks = self.get_number_of_tasks(time)

    def solve_tasks(self, time: float, number_tasks=0):
        """
        Simulates a member solving tasks for <time> hours.
        """
        tq = self.scenario.task_queue
        if number_tasks == 0:
            number_tasks = self.get_number_of_tasks(time)

        tqg = tq.get(done=False, n=number_tasks)
        tasks_to_solve = order_tasks_for_member(tqg, self.skill_type)

        for task in tasks_to_solve:
            task.done_by = self.id
            task.bug = bool(
                probability(self.skill_type.error_rate * (self.stress + self.e(task)))
            )
            task.correct_specification = (
                bool(probability(self.scenario.team.specification_p()))
                or not task.correct_specification
            )

            if probability(self.scenario.template.pred_c):
                try:
                    self.pred = random.sample(list(tq.get(done=True)), 1)[0].id
                except:
                    pass
            task.done = True

        m = number_tasks - len(tasks_to_solve)
        self.familiar_tasks += number_tasks - m
        self.update_familiarity(len(tq.get(done=True)))
        self.stress = min(
            1,
            self.stress
            + len([t for t in tasks_to_solve if t.bug]) * STRESS_ERROR_INCREASE,
        )
        self.motivation = max(
            0, self.motivation - (WORK_HOUR_MOTIVATION_REDUCTION * time)
        )

        # If there were less than n tasks in the queue to do the member will go over to testing and fixing
        if m > 0:
            if len(tq.get(done=True, unit_tested=False)):
                self.test_tasks(time=0, number_tasks=m)
            elif len(tq.get(done=True, bug=True, unit_tested=True)):
                self.fix_errors(time=0, number_tasks=m)

    def fix_errors(self, time: float, number_tasks=0):
        """
        Simulates a member fixing errors for <time> hours.
        """
        tq = self.scenario.task_queue
        if number_tasks == 0:
            number_tasks = self.get_number_of_tasks(time)
        tasks_to_fix = order_tasks_for_member(
            tq.get(done=True, bug=True, unit_tested=True, n=number_tasks),
            self.skill_type,
        )

        for task in tasks_to_fix:
            p = 1  # Todo: Calculate probability of fixing bug
            task.bug = bool(probability(1 - p))

        m = number_tasks - len(tasks_to_fix)
        self.motivation = max(
            0, self.motivation - (WORK_HOUR_MOTIVATION_REDUCTION * time)
        )

        # If there were less than n tasks in the queue to fix the member will go over to solving and testing
        if m > 0:
            if len(tq.get(done=False)):
                self.solve_tasks(time=0, number_tasks=m)
            elif len(tq.get(done=True, unit_tested=False)):
                self.test_tasks(time=0, number_tasks=m)

    def test_tasks(self, time: float, number_tasks=0):
        """
        Simulates a member testing tasks for <time> hours.
        """
        tq = self.scenario.task_queue
        if number_tasks == 0:
            number_tasks = self.get_number_of_tasks(time)
        tasks_to_test = order_tasks_for_member(
            tq.get(done=True, unit_tested=False, n=number_tasks), self.skill_type
        )

        for task in tasks_to_test:
            task.unit_tested = True

        m = number_tasks - len(tasks_to_test)
        self.motivation = max(
            0, self.motivation - (WORK_HOUR_MOTIVATION_REDUCTION * time)
        )

        # If there were less than n tasks in the queue to test the member will go over to solving and fixing
        if m > 0:
            if len(tq.get(done=False)):
                self.solve_tasks(time=0, number_tasks=m)
            elif len(tq.get(done=True, bug=True, unit_tested=True)):
                self.fix_errors(time=0, number_tasks=m)

    def get_number_of_tasks(self, time, coeff=TASK_COMPLETION_COEF):
        """Returns the number of tasks that a member can solve/test/fix for <time> hours."""
        if self.halted:
            raise MemberIsHalted()
        mu = (
            time
            * mean([self.efficiency, self.efficiency, self.scenario.team.efficiency])
            * (self.skill_type.throughput + self.xp_factor)
            * coeff
        )
        number_tasks = poisson(mu)
        return number_tasks

    def train(self, hours=1, delta=0):
        """
        Training a member increases it's xp factor.
        :return: float - new xp factor value
        """
        self.xp_factor += (hours * delta * TRAIN_SKILL_INCREASE_AMOUNT) / (
            (1 + self.xp_factor) ** 2
        )  # Divide by xp_factor^2 to make it grow less with increasing xp factor
        self.motivation = min(1, self.motivation + 0.1 * hours)
        return self.xp_factor

    def halt(self):
        """
        Sets halted value to True.
        :return: True - halted value
        """
        self.halted = True
        return self.halted

    def get_id(self) -> ObjectId:
        return self.id

    def update_familiarity(self, total_tasks_done):
        if self.familiar_tasks == 0 or total_tasks_done == 0:
            self.familiarity = 0
        else:
            self.familiarity = min(self.familiar_tasks / total_tasks_done, 1)

    def increase_stress(self, amount):
        self.stress = max(min(self.stress + amount, 1), 0)


class Team:
    def __init__(self, id: str):
        self.staff: List[Member] = []
        self.id = id

    def __iadd__(self, member: Member):
        self.staff.append(member)
        return self

    def __isub__(self, member: Member):
        try:
            self.staff.remove(member)
        except ValueError:
            pass  # Maybe find a good solution for what to do here.
        return self

    def __contains__(self, member: Member):
        return member in self.staff

    def __len__(self):
        return len(self.staff)

    @property
    def json(self):
        return {"staff": [m.json for m in self.staff], "id": self.id}

    @property
    def motivation(self) -> float:
        """
        The teams motivation. Is considered to be the average (mean) of each team members motivation. 0 if team has
        no staff. :return: float
        """
        return mean([m.motivation for m in self.staff] or [0])

    @property
    def familiarity(self) -> float:
        """
        The teams familiarity. Is considered to be the average (mean) of each team members familiarity. 0 if team has
        no staff. :return: float
        """
        return mean([m.familiarity for m in self.staff] or [0])

    @property
    def stress(self) -> float:
        """
        The teams stress. Is considered to be the average (mean) of each team members stress. 0 if team has
        no staff. :return: float
        """
        return mean([m.stress for m in self.staff] or [0])

    @property
    def salary(self):
        """
        The teams total monthly salary expenditures. The sum of all members' salary.
        :return: int
        """
        return sum([m.skill_type.salary for m in self.staff] or [0])

    def solve_tasks(self, time, tq):
        for member in self.staff:
            if not member.halted:
                member.solve_tasks(time)

    def fix_errors(self, time, tq):
        for member in self.staff:
            if not member.halted:
                member.fix_errors(time)

    def test_tasks(self, time, tq):
        for member in self.staff:
            if not member.halted:
                member.test_tasks(time)

    def calculate_integration_test_duration(self, n):
        return 1 if n < 300 else 2

    def work(
        self, wp: WorkPackage, tq, integration_test=False, social=False, daily_call=None
    ):
        total_meeting_h = wp.meeting_hours
        total_training_h = wp.training_hours
        overhead_duration = 1 if social else 0
        if integration_test:
            overhead_duration += self.calculate_integration_test_duration(
                len(tq.get(done=True, unit_tested=True, integration_test=False))
            )
        for day in range(wp.days - overhead_duration):
            if daily_call:
                daily_call()
            if day % 5 == 0:  # Reduce stress on the weekends
                self.increase_stress(STRESS_REDUCTION_PER_WEEKEND)
                self.increase_motivation(MOTIVATION_INCREASE_PER_WEEKEND)
            day_hours = wp.day_hours
            if total_training_h > 0:
                self.train(total_training_h)
                day_hours -= total_training_h
                total_training_h = 0
            if total_meeting_h > 0 and day_hours > 0:
                if total_meeting_h > day_hours:
                    self.meeting(day_hours, tq.size(done=True))
                    total_meeting_h -= day_hours
                    day_hours = 0
                else:
                    self.meeting(total_meeting_h, tq.size(done=True))
                    day_hours -= total_meeting_h
                    total_meeting_h = 0
            if day_hours > 0 and wp.error_fixing and not wp.quality_check:
                self.fix_errors(day_hours, tq)
            elif day_hours > 0 and wp.quality_check and not wp.error_fixing:
                self.test_tasks(day_hours, tq)
            elif day_hours > 0 and wp.error_fixing and wp.quality_check:
                td = day_hours // 2
                self.fix_errors(day_hours - td, tq)
                self.test_tasks(td, tq)
            elif day_hours > 0:
                self.solve_tasks(day_hours, tq)
            self.increase_stress((wp.day_hours - 8) * STRESS_PER_OVERTIME)
        if integration_test:
            self.integration_test(tq)
        if social:
            self.social_event()

    def integration_test(self, tq: TaskQueue, n=None):

        logging.debug("Start integration test.")
        tasks = list(tq.get(done=True, unit_tested=True, integration_tested=False))[:n]
        for task in tasks:
            if task.correct_specification:
                task.integration_tested = True
            else:
                tq.reset_cascade(task=task)

    def meeting(self, time, total_tasks_done):
        """
        A meeting increases the number of familiar tasks for every member.
        :return: None
        """
        for member in self.staff:
            missing = total_tasks_done - member.familiar_tasks
            new_familiar_tasks = min((TASKS_PER_MEETING * time), missing)
            member.familiar_tasks += new_familiar_tasks
            member.update_familiarity(total_tasks_done)

    def social_event(self):
        """Reduces stress of all members."""
        for member in self.staff:
            member.stress /= 2
            member.motivation = min(1, member.motivation + 0.5)

    def get_member(self, _id: ObjectId) -> Member:
        for m in self.staff:
            if m.get_id() == _id:
                return m
        raise ValueError

    def count(self, skill_type_name):
        """
        Returns the number of
        :param skill_type_name:
        :return:
        """
        c = 0
        for m in self.staff:
            if m.skill_type.name == skill_type_name:
                c += 1
        return c

    def remove_weakest(self, skill_type_name: str):
        w = None
        for m in self.staff:
            if m.skill_type.name == skill_type_name and (
                w is None or w.efficiency > m.efficiency
            ):
                w = m
        self.__isub__(w)

    def adjust(self, staff_data, s):
        for t in ["junior", "senior", "expert"]:
            while self.count(t) > staff_data.get(t):
                self.remove_weakest(t)
            while self.count(t) < staff_data.get(t):
                self.staff.append(Member(t, scenario=s, motivation=0.9))

    @property
    def num_communication_channels(self):
        """Returns number of communication channels."""
        n = len(self.staff)
        return (n * (n - 1)) / 2

    @property
    def efficiency(self):
        """Returns the team's efficiency. Which increases as the number of communication channels grows."""
        c = self.num_communication_channels
        return 1 / (1 + (c / 20 - 0.05))

    def train(self, total_training_h):
        m = mean(
            [member.skill_type.throughput for member in self.staff if not member.halted]
        )
        for member in self.staff:
            delta = m - member.skill_type.throughput
            if delta > 0:
                member.train(total_training_h, delta)

    def increase_stress(self, amount: float):
        """Increases the stress of all members by the given amount. The stress level of each member lies within the interval [0,1] with 1 being the highest stress level."""
        for member in self.staff:
            member.increase_stress(amount)

    def increase_motivation(self, amount: float):
        """Increases the motivation of all members by the given amount. The motivation level of each member lies within the interval [0,1] with 1 being the highest motivation level."""
        for member in self.staff:
            member.motivation = min(1, member.motivation + amount)

    def specification_p(self):
        """Return the probability of which a task is correctly specified."""
        # TODO: How should this be determined for waterfall? Should it be a fixed constant? Should it be set in the scenario template, should it depend on the team?
        return min_max_scaling(self.efficiency, 0.5, 0.9)


class ScrumTeam:
    def __init__(self, junior: int = 0, senior: int = 0, po: int = 0):
        self.teams: List[Team] = []
        self.junior_master = junior
        self.senior_master = senior
        self.po = po
        self.po_hours = 0

    def __len__(self):
        return (
            sum([len(t.staff) for t in self.teams])
            + self.po
            + self.junior_master
            + self.junior_master
        )

    @property
    def json(self):
        return {
            "teams": [t.json for t in self.teams],
            "junior_master": self.junior_master,
            "senior_master": self.senior_master,
            "po": self.po,
        }

    @property
    def salary(self):
        sal = sum([t.salary for t in self.teams])
        y = YAMLReader.read("manager")
        sal += y.get("junior").get("salary") * self.junior_master
        sal += y.get("senior").get("salary") * self.senior_master
        sal += y.get("po").get("salary") * self.po * self.po_hours
        return sal

    @property
    def motivation(self):
        return sum([t.motivation for t in self.teams])

    @property
    def familiarity(self):
        return mean([t.familiarity for t in self.teams] or [0])

    @property
    def stress(self):
        return mean([t.stress for t in self.teams] or [0])

    @property
    def efficiency(self):
        effs = [t.efficiency for t in self.teams] or [0]
        if self.junior_master or self.senior_master:
            return mean(effs)
        return min(effs) / 2

    def daily(self):
        if self.junior_master:
            pass
        elif self.senior_master:
            pass

    def work(self, wp: WorkPackage, tq, **kwargs):
        for team in self.teams:
            team.work(
                wp,
                tq,
                integration_test=False,
                daily_call=self.daily,
                social=kwargs.get("social", False),
            )

            # If the team has a PO, the PO will do in integration test
            if self.po:
                tph = 50  # Task that the PO can integration test per hour.
                nt = tq.size(done=True, unit_tested=True, integration_tested=False)
                hours = min(8 * 3, nt / tph)
                self.po_hours += hours
                team.integration_test(tq, n=int(hours * tph))

    def get_team(self, id):
        for t in self.teams:
            if t.id == id:
                return t
        return None

    def adjust(self, data, s):
        for team_data in data:
            team = self.get_team(team_data.get("id"))
            if team:
                team.adjust(team_data.get("values"), s)
            else:
                id = str(ObjectId())
                new_team = Team(id)
                team_data["id"] = id
                new_team.adjust(team_data.get("values"), s)
                self.teams.append(new_team)

        for team in self.teams:
            if team.id not in [t.get("id") for t in data]:
                self.teams.remove(team)

    def specification_p(self):
        """Return the probability of which a task is correctly specified."""
        # TODO: How should this be determined for scrum? Good like this?
        if self.po:
            return 0.9
        return 0.5


class SkillType:
    """
    Represents a level of skill that a member can have. (Junior, Senior, Expert). A skill type object contains all
    relevant information on a particular skill type.
    """

    def __init__(self, name: str):
        self.name = name
        try:
            data = YAMLReader.read("skill-levels", self.name)
        except KeyError:
            raise NotAValidSkillTypeException
        self.salary = data["salary"]
        self.error_rate = data["error-rate"]
        self.throughput = data["throughput"]

    def __str__(self):
        return "SkillType: " + self.name

    def __eq__(self, other):
        if isinstance(other, SkillType):
            return other.name == self.name
        return False


class NotAValidSkillTypeException(Exception):
    """Exception raised when a skill type is created with an invalid name."""


class MemberIsHalted(Exception):
    """Exception raised when a halted member is called to work."""
