import abc
from typing import List
from app.dto.request import Workpack
from simulation_framework.wrappers import FastSecenario


class UserParameter:
    def __init__(self, workpacks: List[Workpack]) -> None:
        self.counter = 0
        self.workpacks = workpacks

    def __len__(self) -> int:
        return len(self.workpacks)

    def next(self, s: FastSecenario = None) -> Workpack:
        return self.workpacks[min(self.counter, len(self.workpacks) - 1)]
