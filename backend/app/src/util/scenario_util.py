def check_indexes(data) -> bool:

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
