from asyncio import tasks
import logging
import random
from statistics import mean
from typing import List

from deprecated.classic import deprecated
from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

from app.dto.request import Workpack
from app.models.task import TaskStatus, CachedTasks, Task
from app.models.user_scenario import UserScenario
from app.src.util.util import probability

import numpy as np

import logging


class Team(models.Model):
    name = models.CharField(max_length=32, default="team")
    user_scenario = models.OneToOneField(
        UserScenario,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="team",
    )

    @property
    def num_communication_channels(self):
        """Returns the number of communication channels of the team."""
        n = Member.objects.filter(team_id=self.id).count()
        return (n * (n - 1)) / 2

    @property
    def efficiency(self):
        """Returns the team's efficiency."""
        c = self.num_communication_channels
        return 1 / (1 + (c / 20 - 0.05))

    @property
    def management_skill(self):
        """Returns the team's management skill."""
        return 0.5  # TODO: implement

    # increases familiarity with the project for each member
    def meeting(self, scenario, members, work_hours) -> int:
        solved_tasks = TaskStatus.solved(scenario.id)
        for member in members:
            tasks_in_meeting = scenario.config.done_tasks_per_meeting

            member.familiar_tasks = min(
                member.familiar_tasks + tasks_in_meeting, len(solved_tasks)
            )
            # increase familiarity of member
            member.calculate_familiarity(len(solved_tasks))
        # save members
        # todo: wir können überlegen ob man member auch in der work methode in einem bulk update mit anderen Sachen speichern kann
        Member.objects.bulk_update(members, fields=["familiar_tasks", "familiarity"])

        return work_hours - 1

    @deprecated
    def training_without_recursion(
        self, scenario, members, work_hours, mean_real_throughput
    ) -> int:

        for member in members:
            delta = mean_real_throughput - (
                member.skill_type.throughput * (1 + member.xp)
            )
            if delta > 0:
                xp = (delta * scenario.config.train_skill_increase_rate) / (
                    1 + member.xp
                ) ** 2
                member.xp += xp

                member.motivation = min(1, member.motivation + 0.1)
        Member.objects.bulk_update(members, fields=["xp", "motivation"])

        return work_hours - 1

    def training(self, scenario, members, work_hours, mean_real_throughput) -> None:

        for member in members:
            delta = mean_real_throughput - (
                member.skill_type.throughput * (1 + member.xp)
            )
            if delta > 0:
                xp = (delta * scenario.config.train_skill_increase_rate) / (
                    1 + member.xp
                ) ** 2
                member.xp += xp

                member.motivation = min(1, member.motivation + 0.1)

        work_hours -= 1

    # ein tag
    def work(
        self,
        workpack: Workpack,
        scenario,
        workpack_status,
        current_day,
        cached_tasks: CachedTasks,
    ):

        # work hours
        NORMAL_WORK_HOUR_DAY: int = 8
        remaining_work_hours = NORMAL_WORK_HOUR_DAY + workpack.overtime

        members = Member.objects.filter(team_id=scenario.team.id)
        staff_cost = sum([m.skill_type.cost_per_day for m in members])
        logging.debug(f"staff cost: {staff_cost}")
        scenario.state.cost += staff_cost

        # 1. meeting
        for _ in range(workpack_status.meetings_per_day[current_day]):
            remaining_work_hours = self.meeting(
                scenario, members, remaining_work_hours, cached_tasks
            )

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
                [(member.skill_type.throughput * (1 + member.xp)) for member in members]
            )
            for _ in range(remaining_trainings_today):
                self.training(
                    scenario,
                    members,
                    remaining_work_hours,
                    mean_real_throughput_of_team,
                )
            Member.objects.bulk_update(members, fields=["xp", "motivation"])

        # 3. task work
        self.task_work(
            cached_tasks,
            remaining_work_hours,
            members,
            workpack.bugfix,
            workpack.unittest,
        )

    # def work(workpack)
    ## 1. meeting (done)
    ## self.meeting(workpack) (zieht Zeit vom tag ab)
    ## 2. training
    ## self.training(workpack) (zieht Zeit vom tag ab)

    ## 3. ab hier geht um tasks
    ## self.task_work()

    def task_work(self, tasks, hours, members, bugfix, unittest):
        for m in members:
            n = m.n_tasks(hours)
            if unittest:
                tasks_to_test = tasks.done()
                while n and len(tasks_to_test):
                    t: Task = tasks_to_test.pop()
                    t.unit_tested = True
                    n -= 1
            if bugfix:
                tasks_to_fix = tasks.bug()
                while n and len(tasks_to_fix):
                    t: Task = tasks_to_fix.pop()
                    t.bug = False
                    n -= 1
            tasks_to_do = tasks.todo()
            while n and len(tasks_to_do):
                t: Task = tasks_to_do.pop()
                t.done = True
                t.bug = probability((m.skill_type.error_rate + m.stress) / 2)
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
    cost_per_day = models.FloatField(validators=[MinValueValidator(0.0)])
    error_rate = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(1.0)]
    )
    throughput = models.FloatField(validators=[MinValueValidator(0.0)])

    def __str__(self):
        return self.name


class Member(models.Model):
    xp: float = models.FloatField(default=0.0, validators=[MinValueValidator(0.0)])
    motivation = models.FloatField(
        default=0.75, validators=[MinValueValidator(0.0), MaxValueValidator(1.0)]
    )
    familiar_tasks = models.PositiveIntegerField(default=0)
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
        return sum([self.familiarity, self.motivation, self.stress]) / 3

    def calculate_familiarity(self, solved_tasks):
        self.familiarity = self.familiar_tasks / solved_tasks

    def n_tasks(self, hours) -> int:
        """Returns the number of tasks that the member can do in the given hours"""
        mu = (
            hours
            * ((self.efficiency + self.team.efficiency) / 2)
            * (self.skill_type.throughput + self.xp)
        )
        return np.random.poisson(mu)
