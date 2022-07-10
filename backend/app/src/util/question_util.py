import logging
from app.cache.scenario import CachedScenario

from app.dto.response import QuestionCollectionDTO
from app.models.answer import Answer
from app.models.question_collection import QuestionCollection
from app.serializers.question_collection import QuestionCollectionSerializer


def get_question_collection(scenario):
    question_collections = QuestionCollection.objects.get(
        template_scenario_id=scenario.template_id,
        index=scenario.state.component_counter,
    )
    serializer = QuestionCollectionSerializer(question_collections)

    # sort questions in question_collection by index of question
    data = serializer.data
    sorted_list = sorted(
        data.get("questions"), key=lambda x: x.get("question_index"), reverse=False
    )
    data.update(questions=sorted_list)

    return QuestionCollectionDTO(**data)


def handle_question_answers(req, session: CachedScenario):
    """Adds points to the user scenario for each question answer."""
    try:
        for q in req.question_collection.questions:
            selected_answers = Answer.objects.filter(
                id__in=[a.id for a in q.answers if a.answer]
            )
            session.scenario.question_points += sum(
                [a.points for a in selected_answers]
            )
    except Exception as e:
        logging.warning(
            f"{e.__class__.__name__} occurred when handling question answers"
        )
