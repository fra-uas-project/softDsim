from app.src_deprecated.scorecard import ScoreCard
from utils import _YAMLReader, get_active_label, weighted, generate_object_id, yaml_to_scorecard
from bson.objectid import ObjectId


def test_get_active_label():
    a = get_active_label([{'label': 'Agile', 'active': False}, {'label': 'Incremental', 'active': False},
                          {'label': 'Iterative', 'active': False}, {'label': 'Predictive', 'active': True}])
    assert a == "Predictive"

    a = get_active_label([{'label': 'Agile', 'active': True}, {'label': 'Incremental', 'active': False},
                          {'label': 'Iterative', 'active': False}])
    assert a == "Agile"

    a = get_active_label([])
    assert a is None

    a = get_active_label(
        [{'label': 'A', 'active': False}, {'label': 'B', 'active': False}, {'label': 'C', 'active': False}])
    assert a is None

def test_weighted():
    assert 0.36 < weighted((0.5, 2), (0.1, 1)) < 0.37



def test_generate_object_id_returns_object_id():
    assert isinstance(generate_object_id(), ObjectId) is True

def test_generate_object_id_returns_different_ids():
    id1 = generate_object_id()
    id2 = generate_object_id()
    id1a = id1
    assert id1a == id1
    assert id1 != id2
    id3 = generate_object_id()
    assert id3 != id1

def test_scorecard_reader_all_values():
    YAMLReader = _YAMLReader('tests/test_unit/test_scorecard1.yaml')
    data = YAMLReader.read()
    scorecard = yaml_to_scorecard(data.get('scores'))

    assert scorecard == ScoreCard(200, 50, 150, 1.2, 1.01, 4)

def test_scorecard_reader_some_values():
    YAMLReader = _YAMLReader('tests/test_unit/test_scorecard2.yaml')
    data = YAMLReader.read()
    scorecard = yaml_to_scorecard(data.get('scores'))

    assert scorecard == ScoreCard(budget_limit=223, time_limit=1, budget_p=14, quality_k=1)

def test_scorecard_reader_no_values():
    YAMLReader = _YAMLReader('tests/test_unit/test_scorecard3.yaml')
    data = YAMLReader.read()
    scorecard = yaml_to_scorecard(data.get('scores'))

    assert scorecard == ScoreCard()
