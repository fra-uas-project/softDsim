from app.src_deprecated.scorecard import ScoreCard


def test_initialize_score_card():
    sc = ScoreCard(1, 2, 3, 0.3, 1.12, 7)

    assert sc.budget_limit == 1
    assert sc.time_limit == 2
    assert sc.quality_limit == 3
    assert sc.budget_p == 0.3
    assert sc.quality_k == 7
    assert sc.time_p == 1.12

def test_initialize_score_card_default_values():
    sc = ScoreCard()

    assert sc.budget_limit == 100
    assert sc.time_limit == 100
    assert sc.quality_limit == 100
    assert sc.budget_p == 1.0
    assert sc.quality_k == 8
    assert sc.time_p == 1.0


def test__scorecard_to_json():
    sc = ScoreCard(1, 2, 3, 0.3, 1.12, 7)

    assert sc.json == {
        'budget_limit': 1,
        'time_limit': 2,
        'quality_limit': 3,
        'budget_p': 0.3,
        'time_p': 1.12,
        'quality_k': 7
    }