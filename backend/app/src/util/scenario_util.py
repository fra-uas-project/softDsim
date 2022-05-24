def check_indexes(data) -> bool:

    index_list = []
    for question_collection in data.get("question_collections"):
        index_list.append(question_collection.get("index"))

    for simulation_fragment in data.get("simulation_fragments"):
        index_list.append(simulation_fragment.get("index"))

    sorted_index_list = sorted(index_list)
    for i in range(0, len(sorted_index_list)):
        if i != sorted_index_list[i]:
            return False

    return True
