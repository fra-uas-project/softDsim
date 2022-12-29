from __future__ import annotations

import logging
from statistics import mean
import time

from deprecated.classic import deprecated
from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator


from app.dto.request import Workpack
from app.dto.response import TeamStatsDTO
from app.models.task import CachedTasks, Task
from app.models.user_scenario import UserScenario
from app.src.util.util import probability

import numpy as np

import logging

# This prevents circular imports, but allows type hinting.
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.cache.scenario import CachedScenario


class Team(models.Model):
    name = models.CharField(max_length=32, default="team")
    user_scenario = models.OneToOneField(
        UserScenario,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="team",
    )

    def num_communication_channels(self, n):
        """Returns the number of communication channels of the team."""
        return (n * (n - 1)) / 2

    def efficiency(self, session):
        """Returns the team's efficiency."""
        c = self.num_communication_channels(len(session.members))
        return 1 / (1 + (c / 20 - 0.05))

    @property
    def management_skill(self):
        """Returns the team's management skill."""
        return 0.5  # TODO: implement

    def motivation(self, members):
        """Returns the team's motivation."""
        if members is None:
            raise TypeError("Attribute members is required")
        if len(members) == 0:
            return 0
        return mean([m.motivation for m in members])

    def familiarity(self, members):
        """Returns the team's familiarity."""
        if members is None:
            raise TypeError("Attribute members is required")
        if len(members) == 0:
            return 0
        return mean([m.familiarity for m in members])

    def stress(self, members=None):
        """Returns the team's stress."""
        if members is None:
            raise TypeError("Attribute members is required")
        if len(members) == 0:
            return 0
        return mean([m.stress for m in members])

    def stats(self, members) -> TeamStatsDTO:
        """Returns all team stats."""
        return TeamStatsDTO(
            motivation=self.motivation(members),
            familiarity=self.familiarity(members),
            stress=self.stress(members),
        )

    # increases familiarity with the project for each member
    def meeting(self, session: CachedScenario, work_hours) -> int:
        solved_tasks = session.tasks.solved()
        for member in session.members:
            tasks_in_meeting = session.scenario.config.done_tasks_per_meeting

            member.familiar_tasks = min(
                member.familiar_tasks + tasks_in_meeting, len(solved_tasks)
            )
            # increase familiarity of member
            member.calculate_familiarity(len(solved_tasks))

        return work_hours - 1

    def training(
        self, session: CachedScenario, work_hours, mean_real_throughput
    ) -> None:

        for member in session.members:
            delta = mean_real_throughput - (
                member.skill_type.throughput * (1 + member.xp)
            )
            if delta > 0:
                xp = (delta * session.scenario.config.train_skill_increase_rate) / (
                    1 + member.xp
                ) ** 2
                member.xp += xp

                member.motivation = min(1, member.motivation + 0.1)

        work_hours -= 1

    # ein tag
    def work(
        self, session: CachedScenario, workpack: Workpack, workpack_status, current_day,
    ):

        # work hours
        NORMAL_WORK_HOUR_DAY: int = 8
        remaining_work_hours = NORMAL_WORK_HOUR_DAY + workpack.overtime
        # start = time.perf_counter()
        # logging.warn(f"Filter Members took {time.perf_counter() - start} secs")
        staff_cost = sum([m.skill_type.cost_per_day for m in session.members])
        # logging.debug(f"staff cost: {staff_cost}")
        session.scenario.state.cost += staff_cost

        # Every 5th day, the stress is reduces by the weekend reduction
        # (5 because we only count workdays)
        if session.scenario.state.day % 5 == 0:
            for member in session.members:
                member.stress = max(
                    0, member.stress - session.scenario.config.stress_weekend_reduction
                )

        # 1. meeting
        for _ in range(workpack_status.meetings_per_day[current_day]):
            remaining_work_hours = self.meeting(session, remaining_work_hours)

        # 2. training
        remaining_trainings_today = workpack_status.remaining_trainings
        if remaining_trainings_today > 0:
            # todo philip: put this in function
            if remaining_trainings_today > remaining_work_hours:
                workpack_status.remaining_trainings = (
                    remaining_trainings_today - remaining_work_hours
                )
                remaining_trainings_today = remaining_work_hours
            else:
                workpack_status.remaining_trainings = 0

            mean_real_throughput_of_team = mean(
                [
                    (member.skill_type.throughput * (1 + member.xp))
                    for member in session.members
                ]
            )
            for _ in range(remaining_trainings_today):
                self.training(
                    session, remaining_work_hours, mean_real_throughput_of_team,
                )

        # If the member has to work overtime hours the extra stress is added
        # This also works for the negative case
        for member in session.members:
            member.stress = min(
                1,
                workpack.overtime * session.scenario.config.stress_overtime_increase
                + member.stress,
            )

        # 3. task work
        # start = time.perf_counter()
        self.task_work(session, remaining_work_hours, workpack)
        # logging.warn(f"Task work took {time.perf_counter() - start} secs")

    # def work(workpack)
    ## 1. meeting (done)
    ## self.meeting(workpack) (zieht Zeit vom tag ab)
    ## 2. training
    ## self.training(workpack) (zieht Zeit vom tag ab)

    ## 3. ab hier geht um tasks
    ## self.task_work()

    def task_work(self, session: CachedScenario, hours: int, workpack: Workpack):
        tasks = session.tasks
        for m in session.members:
            n, poisson_value = m.n_tasks(hours, session)
            session.scenario.state.poisson_sum += poisson_value
            session.scenario.state.poison_counter += 1
            if workpack.unittest:
                tasks_to_test = tasks.done()
                while n and len(tasks_to_test):
                    t: Task = tasks_to_test.pop()
                    t.unit_tested = True
                    n -= 1
            if workpack.bugfix:
                tasks_to_fix = tasks.bug()
                while n and len(tasks_to_fix):
                    t: Task = tasks_to_fix.pop()
                    t.bug = False
                    n -= 1
            tasks_to_do = tasks.todo()
            while n and len(tasks_to_do):
                t: Task = tasks_to_do.pop()
                t.done = True
                error_increase = m.solve_task(t)
                t.bug = probability(
                    (m.skill_type.error_rate + m.stress - error_increase) / 3
                )
                t.correct_specification = probability(self.management_skill)
                t.unit_tested = False
                t.integration_tested = False
                m.familiar_tasks += 1
                if t.bug:
                    m.stress = min(
                        (1, m.stress + self.user_scenario.config.stress_error_increase)
                    )
                n -= 1

    ### 3. unit tests (poisson zahl z.B. *1.3, unit test könnte schneller gehen als task machen)
    #### alle tasks aus db holen die unit tested werden müssen (TaskStatus.done() (sind alle tasks die done sind und jetzt unit tested werden können)
    #### junior skill type würde leichte tasks nehmen, senior schwere (am anfang einfach zufällig)
    #### TaskStatus.done() gibt liste mit done tasks zurück -> holen 12 zufällig raus -> setzen unit_tested auf True
    #### (task hat status unit_tested wenn er unit tested wurde UND bug False; \\ hat status BUG wenn unit_tested true und bug true
    ### 4. integration tests: kann tested werden wenn task den status unit_tested hat (testing, wird vielleicht nur von tester skill type gemacht (später irgendwann, jetzt einfach von developer))
    ### wenn integration tested status -> höchster status den task haben kann (diesen status gibt es nur wenn BUG==False)
    ### 5. bugfix
    ### 6. tasks_machen (macht entwickler fehler oder nicht -> bug True/False)
    ### brauchen fallback, wenn keine unit tests gibt dann sollen die stunden auf andere sachen verteilt werden

    # def meeting(workpack)
    # for m in self.members:
    # workpack.meeting -
    # in scenario config ist definiert wie viele tasks pro meeting besprochen werden können => X
    # m.familiar_tasks = min(total_tasks_done, m.familiar_tasks + X) => rohwert von tasks
    # m.familiarity = proznet wert (HIER NICHT BERECHNEN, wird später automatisch berechnet

    # in scrum team muss man nur familiar sein mit tasks aus seinem team
    # bulk update m.save() (angeben welche felder/oder einfach alle (familiar_tasks, familiarity))

    # def teamevent()


class SkillType(models.Model):
    name = models.CharField(max_length=32, unique=True)
    cost_per_day = models.FloatField(validators=[MinValueValidator(0.0)], default=100)
    error_rate = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(1.0)], default=0.05
    )
    throughput = models.FloatField(validators=[MinValueValidator(0.0)], default=1)
    management_quality = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)], default=0
    )
    development_quality = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)], default=100
    )
    signing_bonus = models.FloatField(validators=[MinValueValidator(0.0)], default=0)

    def __str__(self):
        return self.name


class Member(models.Model):
    xp: float = models.FloatField(default=0.0, validators=[MinValueValidator(0.0)])
    motivation = models.FloatField(
        default=0.75, validators=[MinValueValidator(0.0), MaxValueValidator(1.0)]
    )
    familiar_tasks = models.IntegerField(default=0)
    familiarity = models.FloatField(
        default=0.0, validators=[MinValueValidator(0.0), MaxValueValidator(1.0)]
    )
    stress = models.FloatField(
        default=0.1, validators=[MinValueValidator(0.0), MaxValueValidator(1.0)]
    )
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name="members")
    skill_type = models.ForeignKey(
        SkillType,
        on_delete=models.CASCADE,
        related_name="member",
        blank=True,
        null=True,
    )

    def __str__(self):
        return f"{self.skill_type.name} Member"

    @property
    def efficiency(self) -> float:
        """Returns the efficiency of the member"""
        
        def st(s):
            return 1 - (abs(s - 0.2))  # 0.2 is the ideal stress level

        return sum([self.familiarity, self.motivation, st(self.stress)]) / 3

    def calculate_familiarity(self, solved_tasks):
        if solved_tasks > 0:
            self.familiarity = self.familiar_tasks / solved_tasks

    def n_tasks(self, hours: int, session):
        """
        Returns the number of tasks that the member can do in the given hours.
        As a second variable it also returns the poisson value it created.
        """
        mu = (
            hours
            * ((self.efficiency + self.team.efficiency(session)) / 2)
            * (self.skill_type.throughput + self.xp)
        )

        # varying degrees of randomness (none=no randomness, semi=some randomness, full=full randomness)
        if session.scenario.config.randomness == "none":
            return int(mu * 0.2), 0

        poisson = np.random.poisson(mu)
        if session.scenario.config.randomness == "semi":
            return int(np.mean((poisson, mu)) * 0.2), poisson

        return int(poisson * 0.2), poisson

    def solve_task(self, task: Task) -> float:
        """Returns the a likelihood of the member doing making a bug caused by lack of
        development skill. Also adjusts the member's motivation according to the task's
        difficulty and the member's skill."""

        # Get difference between task difficulty and member's skill
        diff = self.skill_type.development_quality - (task.difficulty / 3) * 100

        # If the task difficulty fits the skill type's development quality, motivation goes up
        # If not (too easy or too difficult) motivation goes down
        self.motivation = min(
            self.motivation + round(0.005 - ((abs(diff) / 100) * 0.01), 4), 1
        )

        # If the task is too hard for the member the likelihood of an bug increases
        return min(0, diff / 100)
