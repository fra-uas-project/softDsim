import abc
from app.dto.request import Workpack


class SuiteGoal(abc.ABC):
    @abc.abstractmethod
    def is_met(self) -> bool:
        pass


class BudgetGoal(SuiteGoal):
    def __init__(self, budget: int):
        self.budget = budget

    def is_met(self, user) -> bool:
        return self.budget >= 0


class SuiteComponent:
    def __init__(self, goal, members, workpack: Workpack):
        pass


class RunSuite:
    def __init__(self, components) -> None:
        self.components = components
