from typing import List
from pydantic import BaseModel


class MemberDTO(BaseModel):
    id: int
    motivation: float
    stress: float
    xp: float


class ScenarioStateDTO(BaseModel):
    counter: int
    day: int
    cost: float


class TasksStatusDTO(BaseModel):
    tasks_todo: int
    task_done: int
    tasks_unit_tested: int
    tasks_integration_tested: int
    tasks_bug: int


class SimulationResponse(BaseModel):
    tasks: TasksStatusDTO
    state: ScenarioStateDTO
    members: List[MemberDTO]
