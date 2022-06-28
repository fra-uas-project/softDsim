import logging
from typing import List
from app.models.task import CachedTasks
from app.models.team import Member
from app.models.user_scenario import UserScenario

from time import perf_counter


class CachedScenario:
    scenario: UserScenario
    members: List[Member]
    tasks: CachedTasks

    def __init__(self, scenario_id: int) -> None:
        start_counter = perf_counter()
        self.scenario: UserScenario = UserScenario.objects.get(id=scenario_id)
        self.members: List[Member] = Member.objects.filter(team=self.scenario.team)
        self.tasks: CachedTasks = CachedTasks(self.scenario.id)
        logging.info(
            f"Initializing CachedScenario took {perf_counter() - start_counter} seconds"
        )

    def save(self) -> None:
        start = perf_counter()
        self.update_internals()
        self.scenario.save()
        Member.objects.bulk_update(
            self.members,
            fields=["familiar_tasks", "familiarity", "xp", "stress", "motivation"],
        )
        self.tasks.save()
        logging.info(f"Saving CachedScenario took {perf_counter() - start} seconds")

    def update_internals(self):
        # 1. Update members familiarity
        for member in self.members:
            member.calculate_familiarity(len(self.tasks.solved()))
