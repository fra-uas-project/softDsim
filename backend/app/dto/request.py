from typing import List
from pydantic import BaseModel


class Workpack(BaseModel):
    days: int = 5
    unit_test: bool = False
    integration_test: bool = False
    fix: bool = False


class MemberDTO(BaseModel):
    skill_type: str
    change: int = 0


class SimulationRequest(BaseModel):
    scenario_id: int
    type: str = None
    actions: Workpack
    members: List[MemberDTO] = []
