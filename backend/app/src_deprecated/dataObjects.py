from dataclasses import dataclass


@dataclass(frozen=True)
class WorkPackage:
    days: int
    day_hours: int
    meeting_hours: int
    training_hours: int
    quality_check: bool
    error_fixing: bool


@dataclass(frozen=False)
class WorkResult:
    unidentified_errors: int = 0
    identified_errors: int = 0
    fixed_errors: int = 0

    def __add__(self, other):
        self.unidentified_errors += other.unidentified_errors
        self.identified_errors += other.identified_errors
        self.fixed_errors += other.fixed_errors
        return self


@dataclass(frozen=True)
class SimulationGoal:
    tasks: int = None

    @property
    def json(self):
        return {'tasks': self.tasks}

    def reached(self, tasks: int = 0):
        if self.tasks and self.tasks > tasks:
            return False
        return True
