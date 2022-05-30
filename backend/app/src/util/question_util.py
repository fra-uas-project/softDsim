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


def handle_question_answers(req, scenario):
    """This method is just for developing. It prints the answers of the user."""
    for q in req.question_collection.questions:
        print(f"Question #{q.id}")
        for a in q.answers:
            print(f"For Answer-Option with ID:{a.id}, User selected: {a.answer}")
