from abc import ABC
from typing import List
from pydantic import BaseModel


class SkillTypeDTO(BaseModel):
    id: int
    name: str


class MemberDTO(BaseModel):
    id: int
    motivation: float
    stress: float
    xp: float
    skill_type: SkillTypeDTO


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


class ScenarioResponse(BaseModel, ABC):
    """
    This is the abstract response class that provides all data
    required in every step of the simulation. Every specific
    response inherits from this class and add their own specific
    data and also sets the type value.
    """

    type: str
    tasks: TasksStatusDTO
    state: ScenarioStateDTO
    members: List[MemberDTO]


class SimulationResponse(ScenarioResponse):
    type: str = "SIMULATION"
    # ToDo: Add list of actions (Issue #235)


class QuestionResponse(ScenarioResponse):
    type: str = "QUESTION"
    # ToDo: Add question (Issue #234)


class ModelResponse(ScenarioResponse):
    type: str = "MODEL"
    # ToDo: Add list of models (Issue #243)


class ResultResponse(ScenarioResponse):
    type: str = "RESULT"
    # ToDo: Add result stats (Issue #237)
