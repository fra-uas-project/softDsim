from app.dto.response import QuestionCollectionDTO
from app.models.question_collection import QuestionCollection
from app.serializers.question_collection import QuestionCollectionSerializer


def get_question_collection(scenario):
    question_collections = QuestionCollection.objects.get(
        template_scenario_id=scenario.template_id, index=scenario.state.counter
    )
    serializer = QuestionCollectionSerializer(question_collections)
    return QuestionCollectionDTO(**serializer.data)
