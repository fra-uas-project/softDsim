def check_indexes(data):

    index_list = []
    for question_collection in data.get("question_collections"):
        index_list.append(question_collection.get("index"))

    for simulation_fragment in data.get("simulation_fragments"):
        index_list.append(simulation_fragment.get("index"))

    return index_list
