from abc import ABC
from typing import List, Optional
from pydantic import BaseModel


class SkillTypeDTO(BaseModel):
    id: int
    name: str


class MemberDTO(BaseModel):
    id: int
    motivation: float
    familiarity: float
    stress: float
    xp: float
    skill_type: SkillTypeDTO


class AnswerDTO(BaseModel):
    id: int
    label: str
    points: int


class QuestionDTO(BaseModel):
    id: int
    question_index: int  # todo philip: delete index (currently here for developing)
    text: str
    multi: bool
    answers: List[AnswerDTO]


class QuestionCollectionDTO(BaseModel):
    id: int
    index: int  # todo philip: delete index (currently here for developing)
    questions: List[QuestionDTO]


class ScenarioStateDTO(BaseModel):
    component_counter: int
    step_counter: int
    day: int
    cost: float


class TasksStatusDTO(BaseModel):
    tasks_todo: int
    task_done: int
    tasks_unit_tested: int
    tasks_integration_tested: int
    tasks_bug: int


class ActionDTO(BaseModel):
    action: str
    lower_limit: Optional[int] = None
    upper_limit: Optional[int] = None


class ScenarioResponse(BaseModel, ABC):
    """
    This is the abstract response class that provides all data
    required in every step of the simulation. Every specific
    response inherits from this class and add their own specific
    data and also sets the type value.
    """

    type: str
    state: ScenarioStateDTO
    tasks: TasksStatusDTO
    members: List[MemberDTO]


class SimulationResponse(ScenarioResponse):
    type: str = "SIMULATION"
    actions: List[ActionDTO] = []


class QuestionResponse(ScenarioResponse):
    type: str = "QUESTION"
    question_collection: QuestionCollectionDTO


class ModelResponse(ScenarioResponse):
    type: str = "MODEL"
    # ToDo: Add list of models (Issue #243)


class ResultResponse(ScenarioResponse):
    type: str = "RESULT"
    # ToDo: Add result stats (Issue #237)


class ModelSelectionResponse(ScenarioResponse):
    type: str = "MODEL"
    models: List[str]
