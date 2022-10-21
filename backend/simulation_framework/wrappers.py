from __future__ import annotations
from typing import List, Set
from app.cache.scenario import CachedScenario
from app.models.task import CachedTasks, Task
from app.models.team import Member
from app.models.user_scenario import UserScenario

from app.models.task import CachedTasks, Task
from app.models.user_scenario import UserScenario

# This prevents circular imports, but allows type hinting.
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.cache.scenario import CachedScenario


class FastTasks(CachedTasks):
    def __init__(self, tasks: Set[Task]):
        self.tasks = tasks


class FastSecenario(CachedScenario):
    def __init__(
        self,
        scenario: UserScenario,
        members: List[Member],
        tasks: FastTasks,
        id: int,
        config: int,
    ) -> None:
        self.id = id
        self.scenario = scenario
        self.members = members
        self.tasks = tasks
        self.config = config
