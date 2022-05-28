import logging

from app.serializers.team import TeamSerializer
from app.src.util.task_util import get_tasks_status_detailed
from app.dto.request import ScenarioRequest

from history.models.history import History
from history.models.question import HistoryQuestion, HistoryAnswer
from history.models.member import HistoryMemberChanges, HistoryMemberStatus


def write_history(scenario, request: ScenarioRequest):
    h = History(
        type=request.type,
        user_scenario=scenario,
        counter=scenario.state.counter,
        day=scenario.state.day,
        cost=scenario.state.cost,
        model=scenario.model,
        **get_tasks_status_detailed(scenario.id),
    )
    h.save()
    if request.type == "QUESTION":
        h.question_collection_id = request.question_collection.id
        for question in request.question_collection.questions:
            q = HistoryQuestion(history=h, question_id=question.id)
            q.save()
            for answer in question.answers:
                HistoryAnswer.objects.create(
                    question=q, answer_id=answer.id, answer_selection=answer.answer
                )

    elif request.type == "SIMULATION":
        # Save member changes
        request
        for member_change in request.members:
            HistoryMemberChanges.objects.create(
                history=h,
                change=member_change.change,
                skill_type_name=member_change.skill_type,
            )

    # Save Member Stats
    for member in TeamSerializer(scenario.team).data.get("member"):
        HistoryMemberStatus.objects.create(
            history=h,
            member_id=member.get("id"),
            motivation=member.get("motivation", -1),
            stress=member.get("stress", -1),
            xp=member.get("xp", -1),
            skill_type_id=member.get("skill_type", {}).get("id", -1),
            skill_type_name=member.get("skill_type", {}).get("name", "undefined"),
        )

    h.save()
    logging.info(
        f"Wrote history (id {h.id}) for scenario with id {scenario.id} (user: {scenario.user.username})"
    )
