import logging

from app.serializers.team import TeamSerializer
from app.src.util.task_util import get_tasks_status_detailed
from app.dto.request import ScenarioRequest

from history.models.history import History
from history.models.question import HistoryQuestion, HistoryAnswer
from history.models.member import HistoryMemberChanges, HistoryMemberStatus


def write_history(scenario, request: ScenarioRequest, response_type):

    # 1 Write basic stats into a new history entry
    try:
        h = History(
            request_type=request.type,
            response_type=response_type,
            user_scenario=scenario,
            component_counter=scenario.state.component_counter,
            step_counter=scenario.state.step_counter,
            day=scenario.state.day,
            cost=scenario.state.cost,
            model=scenario.model,
            **get_tasks_status_detailed(scenario.id),
        )
        # Save history entry to DB
        h.save()
    except Exception as e:
        logging.warning(f"{e.__class__.__name__} occurred when saving basic history")
        return

    try:
        # 2 Write specific fields for question requests
        if request.type == "QUESTION":
            h.question_collection_id = request.question_collection.id
            for question in request.question_collection.questions:
                q = HistoryQuestion(history=h, question_id=question.id)
                q.save()
                for answer in question.answers:
                    HistoryAnswer.objects.create(
                        question=q, answer_id=answer.id, answer_selection=answer.answer
                    )
    except Exception as e:
        logging.warning(f"{e.__class__.__name__} occurred when saving question history")

    try:
        # 3 Write specific fields for simulation requests
        if request.type == "SIMULATION":
            # Save member changes
            for member_change in request.members:
                HistoryMemberChanges.objects.create(
                    history=h,
                    change=member_change.change,
                    skill_type_name=member_change.skill_type,
                )
            # Save user options for actions
            for action_name, value in request.actions:
                h.__setattr__(action_name, value)
    except Exception as e:
        logging.warning(
            f"{e.__class__.__name__} occurred when saving simulation fragment history"
        )

    try:
        # 4 Save Member Stats
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
    except Exception as e:
        logging.warning(
            f"{e.__class__.__name__} occurred when saving member stats history"
        )

    try:
        # Save object after other changes
        h.save()
    except Exception as e:
        logging.warning(
            f"{e.__class__.__name__} occurred when saving history object to database"
        )

    logging.info(
        f"Wrote history (id {h.id}) for scenario with id {scenario.id} (user: {scenario.user.username})"
    )
