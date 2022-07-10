from abc import ABC
from typing import List
from pydantic import BaseModel


class Workpack(BaseModel):
    days: int = 5
    bugfix: bool = False
    unittest: bool = False
    integrationtest: bool = False
    meetings: int = 0
    training: int = 0
    teamevent: bool = False
    salary: int = 1  # default ?
    overtime: int = 1


class MemberDTO(BaseModel):
    skill_type: str
    change: int = 0


class AnswerRequestDTO(BaseModel):
    id: int
    answer: bool


class QuestionRequestDTO(BaseModel):
    id: int
    answers: List[AnswerRequestDTO]


class QuestionCollectionRequestDTO(BaseModel):
    """
    DTO for QuestionCollection in the REQUEST from the client.
    This QuestionCollection contains the Questions with information
    about the answers the client selected.
    """

    id: int
    questions: List[QuestionRequestDTO]


class ScenarioRequest(BaseModel, ABC):
    """Base Class for Requests"""

    scenario_id: int
    type: str = None


class SimulationRequest(ScenarioRequest):
    actions: Workpack = None
    members: List[MemberDTO] = []


class QuestionRequest(ScenarioRequest):
    question_collection: QuestionCollectionRequestDTO = None


class ModelRequest(ScenarioRequest):
    model: str


class StartRequest(ScenarioRequest):
    """
    Currently StartRequest only needs the fields it inherits from Scenario Request.
    In the future we might need more fields.
    """


class EventRequest(ScenarioRequest):
    """
    Currently EventRequest only needs the fields it inherits from Scenario Request.
    In the future we might need more fields.
    """


class EndRequest(ScenarioRequest):
    """
    Currently EndRequest only needs the fields it inherits from Scenario Request.
    In the future we might need more fields.
    """
