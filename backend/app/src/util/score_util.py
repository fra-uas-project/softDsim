from typing import List
from app.models.score_card import ScoreCard
from app.models.task import CachedTasks
from app.models.management_goal import ManagementGoal
from app.models.user_scenario import UserScenario


def calc_scores(scenario: UserScenario, tasks: CachedTasks) -> dict:
    score: ScoreCard = scenario.template.score_card
    goal: ManagementGoal = scenario.template.management_goal

    quality_score = calc_quality_score(
        len(tasks.tasks), len(tasks.rejected()), score.quality_limit, score.quality_k
    )

    time_score = calc_time_score(
        scenario.state.day, goal.duration, score.time_limit, score.time_p
    )
    budget_score = calc_budget_score(
        scenario.state.cost, goal.budget, score.budget_limit, score.budget_p
    )
    question_score = 25  # todo: get question score

    return {
        "quality_score": quality_score,
        "time_score": time_score,
        "budget_score": budget_score,
        "question_score": question_score,
        "total_score": quality_score + time_score + budget_score + question_score,
    }


def calc_time_score(actual_time, scheduled_time, limit, p) -> int:
    if scheduled_time == 0:
        return 0
    if actual_time <= scheduled_time:
        return limit
    exceed_ratio = ((actual_time / scheduled_time) - 1) * 100
    return max(0, int(100 - exceed_ratio ** p)) * limit / 100


def calc_budget_score(cost, budget, limit, p) -> int:
    if budget == 0:
        return 0
    if cost <= budget:
        return 1 * limit
    exceed_ratio = ((cost / budget) - 1) * 100
    return max(0, int(100 - exceed_ratio ** p)) * limit / 100


def calc_quality_score(tasks, err, limit, k) -> int:
    if tasks == 0:
        return 0
    return int((1 - (err / tasks)) ** k * limit)

