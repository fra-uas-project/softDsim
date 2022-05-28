from app.dto.response import QuestionCollectionDTO
from app.models.question_collection import QuestionCollection
from app.serializers.question_collection import QuestionCollectionSerializer


def get_question_collection(scenario):
    question_collections = QuestionCollection.objects.get(
        template_scenario_id=scenario.template_id, index=scenario.state.counter
    )
    serializer = QuestionCollectionSerializer(question_collections)

    # sort questions in question_collection by index of question
    data = serializer.data
    sorted_list = sorted(
        data.get("questions"), key=lambda x: x.get("question_index"), reverse=False
    )
    data.update(questions=sorted_list)

    return QuestionCollectionDTO(**data)
