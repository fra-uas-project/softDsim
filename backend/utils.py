import statistics
from random import random
from bson.objectid import ObjectId

from pymongo import MongoClient
from yaml import load, FullLoader
import os
from django.conf import settings

from app.src_deprecated.scorecard import ScoreCard


def get_db_handle(db_name, host, port):
    client = MongoClient(host=host,
                         port=int(port)
                         )
    db_handle = client[db_name]
    return db_handle, client


def value_or_error(val, lower: float = 0.0, upper: float = 1.0):
    """
    Used to validate that numeric value is in bound.
    :param val: the value that need to be validated.
    :param lower: lower bound
    :param upper: upper bound
    :return: either value if in bounds or raises ValueError
    """
    if lower <= val <= upper:
        return val
    raise ValueError


def quality(tasks, errors) -> int:
    """
    Calculates a quality score between 0 and 100. The score is calculated using an exponential function.
    :param tasks: Number of total tasks.
    :param errors: Number of tasks with errors.
    :return: quality score.
    """
    if tasks == 0:
        return 100
    return round((((tasks - errors) * (1 / tasks)) ** 8) * 100)


def probability(p: float) -> int:
    """
    Returns 1 with a probability of p and 0 with probability of 1-p.
    :param p: probability of getting 1.
    :return: 1 or 0
    """
    return 1 if random() < p else 0

def weighted(*args):
    data = []
    for arg in args:
        for _ in range(arg[1]):
            data.append(arg[0])
    return statistics.mean(data)


def dots(n: int):
    """
    Returns a string with n dots: •
    :param n: int - number of desired dots
    :return: str - •••
    """
    return "•" * n


def month_to_day(value: float, num_days: int = 1) -> float:
    """
    Turns a value that refers to a timespan of one month to the time in days. Assumes that a month is 20 business
    days long. :param value: e.g. 3000 ($ per month) :param num_days: e.g. 15 (days) :return: 1500 ($ per 15 days)
    """
    return value * (num_days / 20)


def data_get(data, value, attr='title') -> dict:
    """
    Searches in list data for a dict that has a attr 'title' that equals <title>.
    :param attr: The attributes name, default is title.
    :param data: A list of dicts.
    :param value: A string that is the title of the dict that is searched.
    :return: dict
    """
    for obj in data:
        if obj.get(attr) == value:
            return obj
    return {}


def get_active_label(data):
    """
    Searches in a list of answers for the answers that is active == True and returns that answers label.
    :param data: list [{'label': 'A', 'active': False}, {'label': 'B', 'active': True}, {'label': 'C', 'active': False}]
    :return: str 'B'
    """
    return data_get(data, True, attr='active').get('label') or None


def read_button(data, title):
    """Returns the value of the button in data with the given title."""
    return get_active_label(data_get(data['button_rows'], title).get('answers', []))


def min_max_scaling(value, s_min, s_max, v_min=0, v_max=1.0) -> float:
    """Returns the min max scaled value of the given value. 
    Example: 
    We have a % value in the format of 0.0 - 1.0 with a value of 0.4.
    min_max_scaling(0.4, s_min=0, s_max=100, v_min=0, v_max=1.0) -> 40%

    Somtimes we might want to scale a value that is in the range from 0-100 to a range of 100-1000 for som reason.
    min_max_scaling(<value>, s_min=100, s_max=1000, v_min=0, v_max=100) -> <scaled value>

    Args:
        value (float): The value to be scaled
        s_min (float): The min value of the OUTPUT value.
        s_max (float): The max value of the OUTPUT value.
        v_min (float, optional): The min value of the input range the the value lies in. Defaults to 0.
        v_max (float, optional): The max value of the input range the the value lies in. Defaults to 1.0.

    Returns:
        float: The scaled value.
    """
    return s_min + (((value - v_min)*(s_max-s_min)) / (v_max - v_min))


class _YAMLReader:
    def __init__(self, path):
        self.path = path

    def read(self, *args):
        with open(self.path) as y:
            data = load(y, Loader=FullLoader)
            for arg in args:
                data = data[arg]
        return data


YAMLReader = _YAMLReader(path=os.path.join(settings.BASE_DIR, 'parameter.yml'))



def generate_object_id():
    return ObjectId()


def remove_none_values(d):
    """Removes all pairs in dict d that have none as their value."""
    return {k: v for k, v in d.items() if v is not None}


def yaml_to_scorecard(data):
    s = ScoreCard()
    if data is not None:
        if limits := data.get('limits'):
            if d := limits.get('budget'):
                s.budget_limit = int(d)
            if d := limits.get('time'):
                s.time_limit = int(d)
            if d := limits.get('quality'):
                s.quality_limit = int(d)
        if params := data.get('params'):
            if d := params.get('budget_p'):
                s.budget_p = float(d)
            if d := params.get('time_p'):
                s.time_p = float(d)
            if d := params.get('quality_k'):
                s.quality_k = int(d)
    return s

