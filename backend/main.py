import boto3
from io import StringIO
from userparameter.set1 import USERPARAMETERS
from simulation_framework.wrappers import FastSecenario, FastTasks
from app.dto.request import SimulationRequest, Workpack
from app.src.simulation import simulate
from app.models.user_scenario import ScenarioState, UserScenario
from app.models.team import Member, SkillType, Team
from app.models.task import Task
from app.models.scenario import ScenarioConfig
from pandas import DataFrame
import numpy as np
from typing import List
from statistics import mean
from random import randint
import os
from dotenv import load_dotenv
import json
import random

print("MAIN SCRIPT")


def check_file_exists(file_path):
    if not os.path.isfile(file_path):
        raise FileNotFoundError(f"The file '{file_path}' does not exist.")


def validate_env_file(file_path):
    required_attributes = ["bucket", "USE_S3",
                           "DATAPATH", "RUNNAME", "NRUNS", "SAVE_EVERY", "NUMBER_OF_SK_PER_TEAM"]
    load_dotenv(file_path)
    missing_attributes = [
        attr for attr in required_attributes if os.getenv(attr) is None]
    if missing_attributes:
        raise ValueError(
            f"Missing attributes in the .env file: {', '.join(missing_attributes)}")


check_file_exists("testparams.env")
validate_env_file("testparams.env")

load_dotenv("testparams.env")

bucket = os.getenv("bucket")
USE_S3 = os.getenv("USE_S3", 'False').lower() in ('true', '1', 't')
DATAPATH = os.getenv("DATAPATH")
RUNNAME = os.getenv("RUNNAME")
NRUNS = int(os.getenv("NRUNS"))
SAVE_EVERY = int(os.getenv("SAVE_EVERY"))
NUMBER_OF_SK_PER_TEAM = int(os.getenv("NUMBER_OF_SK_PER_TEAM"))

Team.objects.create()


def validate_skill_type_data(skill_type_data):
    required_attributes = ['name', 'cost_per_day', 'error_rate', 'throughput', 'management_quality',
                           'development_quality', 'signing_bonus']
    for attribute in required_attributes:
        if attribute not in skill_type_data:
            raise ValueError(
                f"Missing attribute '{attribute}' in skill type data.")

        value = skill_type_data[attribute]

        if attribute == 'name' and not isinstance(value, str):
            raise ValueError(
                f"Invalid value for attribute 'name'. It should be a string.")

        if attribute == 'cost_per_day' and value <= 0:
            raise ValueError(
                "Invalid value for attribute 'cost_per_day'. It should be greater than 0.")

        if attribute == 'error_rate' and (value < 0 or value > 1):
            raise ValueError(
                f"Invalid value for attribute 'error_rate'. It should be a value between 0 and 1.")

        if attribute in ['throughput', 'management_quality', 'development_quality']:
            if value < 0:
                raise ValueError(
                    f"Invalid value for attribute '{attribute}'. It should be greater than or equal to 0.")

        if attribute == 'signing_bonus' and value < 0:
            raise ValueError(
                "Invalid value for attribute 'signing_bonus'. It should be greater than or equal to 0.")


def validate_scenario_config_data(data):
    required_attributes = ['name', 'stress_weekend_reduction', 'stress_overtime_increase', 'stress_error_increase',
                           'done_tasks_per_meeting', 'train_skill_increase_rate']
    for attribute in required_attributes:
        if attribute not in data:
            raise ValueError(
                f"Missing attribute '{attribute}' in scenario config data.")

        value = data[attribute]

        if attribute == 'stress_weekend_reduction' and value >= 0:
            raise ValueError(
                "Invalid value for attribute 'stress_weekend_reduction'. It should be negative.")

        if attribute in ['stress_overtime_increase', 'stress_error_increase',
                         'done_tasks_per_meeting', 'train_skill_increase_rate']:
            if (value < 0 or value > 100):
                raise ValueError(
                    f"Invalid value for attribute '{attribute}'. It should be between 0 and 100.")


def retrieve_skill_types_from_json():
    file_path = "skilltypes.json"
    check_file_exists(file_path)

    with open(file_path, 'r') as json_file:
        data = json.load(json_file)

    skill_types = []
    for skill_type_data in data:
        validate_skill_type_data(skill_type_data)
        name = skill_type_data['name']
        cost_per_day = skill_type_data['cost_per_day']
        error_rate = skill_type_data['error_rate']
        throughput = skill_type_data['throughput']
        management_quality = skill_type_data['management_quality']
        development_quality = skill_type_data['development_quality']
        signing_bonus = skill_type_data['signing_bonus']

        skill_type = {
            'name': name,
            'cost_per_day': cost_per_day,
            'error_rate': error_rate,
            'throughput': throughput,
            'management_quality': management_quality,
            'development_quality': development_quality,
            'signing_bonus': signing_bonus
        }
        skill_types.append(skill_type)

    return skill_types


def retrieve_scenario_config_from_json():
    file_path = "scenario_config.json"
    check_file_exists(file_path)

    with open(file_path, 'r') as json_file:
        data = json.load(json_file)

    validate_scenario_config_data(data)

    name = data['name']
    stress_weekend_reduction = data['stress_weekend_reduction']
    stress_overtime_increase = data['stress_overtime_increase']
    stress_error_increase = data['stress_error_increase']
    done_tasks_per_meeting = data['done_tasks_per_meeting']
    train_skill_increase_rate = data['train_skill_increase_rate']
    cost_member_team_event = data["cost_member_team_event"]
    randomness = data["randomness"]

    scenario_config = ScenarioConfig(
        name=name,
        stress_weekend_reduction=stress_weekend_reduction,
        stress_overtime_increase=stress_overtime_increase,
        stress_error_increase=stress_error_increase,
        done_tasks_per_meeting=done_tasks_per_meeting,
        train_skill_increase_rate=train_skill_increase_rate,
    )

    scenario_config.cost_member_team_event = cost_member_team_event
    scenario_config.randomness = randomness

    return scenario_config


def init_scenario() -> UserScenario:
    us = UserScenario.objects.create()
    state = ScenarioState.objects.create(user_scenario=us)
    team = Team.objects.create(user_scenario=us)
    return us, state, team


def init_config():
    ScenarioConfig.objects.all().delete()
    return ScenarioConfig.objects.create(name="c1")


def init_skill_types():
    skill_types_data = retrieve_skill_types_from_json()

    SkillType.objects.all().delete()

    created_skill_types = []
    for skill_type_data in skill_types_data:
        name = skill_type_data['name']
        cost_per_day = skill_type_data['cost_per_day']
        error_rate = skill_type_data['error_rate']
        throughput = skill_type_data['throughput']
        management_quality = skill_type_data['management_quality']
        development_quality = skill_type_data['development_quality']
        signing_bonus = skill_type_data['signing_bonus']

        skill_type = SkillType.objects.create(
            name=name,
            cost_per_day=cost_per_day,
            error_rate=error_rate,
            throughput=throughput,
            management_quality=management_quality,
            development_quality=development_quality,
            signing_bonus=signing_bonus
        )
        created_skill_types.append(skill_type)

    return created_skill_types


def init_members(skill_types):
    members = []
    for sk in skill_types:
        for _ in range(NUMBER_OF_SK_PER_TEAM):
            members.append(Member.objects.create(skill_type=sk, team_id=1))
    return members


def run_simulation(scenario, config, members, tasks, skill_types, rec, UP, UP_n):
    scenario.config = config
    s = FastSecenario(scenario, members, tasks, 1, 1)
    r = SimulationRequest(scenario_id=0, type="SIMULATION", actions=UP)
    simulate(r, s)
    rec.add(s, config, skill_types, UP, UP_n)


def set_config(config: ScenarioConfig):
    scenario_config = retrieve_scenario_config_from_json()

    config.stress_weekend_reduction = scenario_config.stress_weekend_reduction
    config.stress_overtime_increase = scenario_config.stress_overtime_increase
    config.stress_error_increase = scenario_config.stress_error_increase
    config.done_tasks_per_meeting = scenario_config.done_tasks_per_meeting
    config.train_skill_increase_rate = scenario_config.train_skill_increase_rate
    config.cost_member_team_event = scenario_config.cost_member_team_event
    config.randomness = scenario_config.randomness


def set_skill_types(skill_types: List[SkillType]):
    skill_types_data = retrieve_skill_types_from_json()
    for i in range(len(skill_types)):
        skill_types[i].throughput = skill_types_data[i]['throughput']
        skill_types[i].error_rate = skill_types_data[i]['error_rate']


def set_tasks(u):
    TOTAL = 200
    tasks = set()
    for _ in range(int(TOTAL * 0.25)):
        tasks.add(Task(id=randint(0, 9999999999),
                  difficulty=1, user_scenario=u))
    for _ in range(int(TOTAL * 0.5)):
        tasks.add(Task(id=randint(0, 9999999999),
                  difficulty=2, user_scenario=u))
    for _ in range(int(TOTAL * 0.25)):
        tasks.add(Task(id=randint(0, 9999999999),
                  difficulty=3, user_scenario=u))
    return FastTasks(tasks)


def np_record(
    s: FastSecenario,
    config: ScenarioConfig,
    skill_types: List[SkillType],
    workpack: Workpack,
    UP_n,
) -> np.array:
    return np.array(
        [
            config.stress_weekend_reduction,
            config.stress_overtime_increase,
            config.stress_error_increase,
            config.done_tasks_per_meeting,
            config.train_skill_increase_rate,
            len(s.members),
            skill_types[0].name,
            skill_types[0].throughput,
            skill_types[0].error_rate,
            skill_types[0].cost_per_day,
            skill_types[0].management_quality,
            skill_types[0].development_quality,
            skill_types[0].signing_bonus,
            UP_n,
            workpack.days,
            workpack.bugfix,
            workpack.unittest,
            workpack.integrationtest,
            workpack.meetings,
            workpack.training,
            workpack.teamevent,
            workpack.salary,
            workpack.overtime,
            s.scenario.state.cost,
            s.scenario.state.day,
            mean([m.efficiency for m in s.members]),
            mean([m.familiarity for m in s.members]),
            mean([m.stress for m in s.members]),
            mean([m.xp for m in s.members]),
            mean([m.motivation for m in s.members]),
            len(s.tasks.accepted()),
            len(s.tasks.rejected()),
        ]
    )


class NpRecord:
    def __init__(self):
        self.data = None

    def add(self, s: FastSecenario, *args):
        if self.data is None:
            self.data = np.array([np_record(s, *args)])
        else:
            self.data = np.vstack((self.data, np.array([np_record(s, *args)])))

    def clear(self):
        self.data = None

    def df(self):
        return DataFrame(
            self.data,
            columns=[
                "c_swr",
                "c_soi",
                "c_sei",
                "c_dtm",
                "c_tsi",
                "s_number_of_sk",
                "s_name",
                "s_throughput",
                "s_error_rate",
                "s_cost_per_day",
                "s_management_quality",
                "s_development_quality",
                "s_signing_bonus",
                "UP",
                "days",
                "bugfix",
                "unittest",
                "integrationtest",
                "meetings",
                "training",
                "teamevent",
                "salary",
                "overtime",
                "Cost",
                "Day",
                "Eff",
                "Fam",
                "Str",
                "XP",
                "Mot",
                "Acc",
                "Rej",
            ],
        )


def set_members(members: List[Member]):
    for member in members:
        member.familiar_tasks = 0
        member.familiarity = 0
        member.motivation = 0.75
        member.stress = 0.15
        member.xp = 0


def set_scenario(scenario: UserScenario, state: ScenarioState):
    state.cost = 0
    state.day = 0


def random_boolean() -> bool:
    return bool(random.getrandbits(1))


def random_number(start: int, end: int) -> int:
    if (start > end):
        tmp = end
        end = start
        start = tmp

    return random.randint(start, end)


def generate_user_params() -> Workpack:
    wp: Workpack = Workpack()

    wp.bugfix = random_boolean()
    wp.teamevent = random_boolean()
    wp.integrationtest = random_boolean()
    wp.unittest = random_boolean()
    wp.meetings = random_number(0, 5)
    wp.training = random_number(0, 5)
    wp.salary = random_number(0, 2)
    wp.overtime = random_number(-1, 2)

    return wp


def main():
    print("Started")
    rec = NpRecord()
    scenario, state, team = init_scenario()
    config = init_config()
    skill_types = init_skill_types()
    members = init_members(skill_types)

    for x in range(1, NRUNS + 1):
        set_config(config)
        set_skill_types(skill_types)
        # generate a userparameter randomly
        user_params: List = [generate_user_params() for _ in range(8)]

        for n, UP in enumerate(user_params):

            set_scenario(scenario, state)
            set_members(members)
            tasks = set_tasks(scenario)
            run_simulation(scenario, config, members,
                           tasks, skill_types, rec, UP, n)
            # print(f"{len(tasks.done())} \t {mean([m.efficiency for m in members])}")

        if x % SAVE_EVERY == 0:
            print(f"{x} of {NRUNS}")
            if USE_S3:
                print("Saving in S3")
                csv_buffer = StringIO()
                rec.df().to_csv(csv_buffer)
                s3_resource = boto3.resource("s3")
                s3_resource.Object(
                    bucket, f"{RUNNAME}_ID{randint(10000000,99999999)}file{int(x / SAVE_EVERY)}.csv"
                ).put(Body=csv_buffer.getvalue())
            else:
                if not os.path.exists(DATAPATH):
                    os.mkdir(DATAPATH)

                fullname = os.path.join(
                    DATAPATH, f"{RUNNAME}_ID{randint(10000000,99999999)}file{int(x / SAVE_EVERY)}.csv")

                rec.df().to_csv(fullname)
            rec.clear()


main()
