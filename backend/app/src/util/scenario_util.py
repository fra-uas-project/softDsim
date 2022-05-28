from app.dto.request import (
    ScenarioRequest,
    SimulationRequest,
    QuestionRequest,
    ModelRequest,
)


def check_indexes(data) -> bool:
    """checks if indexes of template scenario are correct."""
    index_list = []
    for component_type in [
        "question_collections",
        "simulation_fragments",
        "model_selections",
    ]:
        for component_data in data.get(component_type):
            index_list.append(component_data.get("index"))

    sorted_index_list = sorted(index_list)
    for i in range(0, len(sorted_index_list)):
        if i != sorted_index_list[i]:
            return False

    return True


def create_correct_request_model(request) -> ScenarioRequest:
    """
    Creates object of the right request model, depending on the request type.
    (If type of request is QUESTION -> will create QuestionRequest object.)
    """
    request_types = {
        "SIMULATION": SimulationRequest,
        "QUESTION": QuestionRequest,
        "MODEL": ModelRequest,
    }
    for key, value in request_types.items():
        if request.data.get("type") == key:
            a = value(**request.data)
            return a


def handle_question_answers(question_collection):
    """This method is just for developing. It prints the answers of the user."""
    for q in question_collection.questions:
        print(f"Question #{q.id}")
        for a in q.answers:
            print(f"For Answer-Option with ID:{a.id}, User selected: {a.answer}")
