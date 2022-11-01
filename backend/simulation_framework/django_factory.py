import os
from random import randint
from app.models.scenario import ScenarioConfig
from app.models.task import Task
from app.models.team import Member, SkillType, Team
from app.models.template_scenario import TemplateScenario
from app.models.user_scenario import ScenarioState, UserScenario
from custom_user.models import User
from simulation_framework.wrappers import FastSecenario, FastTasks

TEMPLATE_ID = 31
USERID = 24


def _make_config():
    conf = os.environ.get("SIMULATION_CONFIG_NAME", "c1")
    return ScenarioConfig.objects.get(name="c1")


def team(u: UserScenario):
    return Team.objects.create(user_scenario=u)


def _get() -> TemplateScenario:
    t = TemplateScenario.objects.get(id=TEMPLATE_ID)
    user = User.objects.get(id=USERID)
    config = _make_config()

    u = UserScenario.objects.create(
        user=user, config=config, template=t, question_points=0, ended=False
    )

    u.team = team(u)
    sk = SkillType.objects.get(id=5)
    members = [
        Member.objects.create(skill_type=sk, team=u.team),
        Member.objects.create(skill_type=sk, team=u.team),
        Member.objects.create(skill_type=sk, team=u.team),
        Member.objects.create(skill_type=sk, team=u.team),
        Member.objects.create(skill_type=sk, team=u.team),
        Member.objects.create(skill_type=sk, team=u.team),
    ]
    u.team.members.set(members)

    state = ScenarioState(user_scenario=u)
    u.sate = state

    return u, members


def _tasks(u):
    tasks = set()
    for _ in range(u.template.management_goal.easy_tasks):
        tasks.add(Task(id=randint(0, 9999999999), difficulty=1, user_scenario=u))
    for _ in range(u.template.management_goal.medium_tasks):
        tasks.add(Task(id=randint(0, 9999999999), difficulty=2, user_scenario=u))
    for _ in range(u.template.management_goal.hard_tasks):
        tasks.add(Task(id=randint(0, 9999999999), difficulty=3, user_scenario=u))
    return FastTasks(tasks)


def get():
    s, m = _get()
    return FastSecenario(
        scenario=s, members=m, tasks=_tasks(s), id=0, config=s.config.name
    )
