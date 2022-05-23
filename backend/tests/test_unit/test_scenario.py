from app.src_deprecated.scenario import UserScenario, Scenario


def test_scenario_get_template_id():
    s = Scenario()
    us = UserScenario(template=s)

    assert us.template == s

    assert us.get_template_id() == s.id

    us2 = UserScenario()
    assert us2.get_template_id() is None


def test_json_does_not_contain_none_values():
    us = UserScenario()
    json = us.json
    EMPTY = 3824562934
    assert json.get("template_id", EMPTY) == EMPTY
    assert json.get("current_day", EMPTY) != EMPTY


def test_userscenario_is_scenario():
    s = Scenario()
    us = UserScenario(scenario=s)

    assert isinstance(s, Scenario) is True
    assert isinstance(us, Scenario) is False
    assert isinstance(s, UserScenario) is False
    assert isinstance(us, UserScenario) is True
