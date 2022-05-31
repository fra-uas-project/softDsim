from pydantic import BaseModel


class Workpack(BaseModel):
    days: int = 5
    unit_test: bool = False
    integration_test: bool = False
    fix: bool = False
