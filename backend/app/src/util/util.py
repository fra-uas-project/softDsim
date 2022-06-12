import random


def probability(p: float) -> int:
    """
    Returns True with a probability of p and False with probability of 1-p.
    :param p: probability of getting True.
    :return: bool
    """
    return True if random.random() < p else False
