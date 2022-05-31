from dataclasses import dataclass


@dataclass
class ScoreCard:
    budget_limit: int = 100
    time_limit: int = 100
    quality_limit: int = 100
    budget_p: float = 1.0
    time_p: float = 1.0
    quality_k: int = 8

    @property
    def json(self):
        return {
        'budget_limit': self.budget_limit,
        'time_limit': self.time_limit,
        'quality_limit': self.quality_limit,
        'budget_p': self.budget_p,
        'time_p': self.time_p,
        'quality_k': self.quality_k
    }