from rest_framework.test import APIClient
import pytest
from app.src_deprecated.scenario import Scenario
from mongo_models import ScenarioMongoModel
from app.src_deprecated.dataObjects import SimulationGoal
from app.src_deprecated.decision_tree import (
    Action,
    Decision,
    Answer,
    AnsweredDecision,
    SimulationDecision,
    TextBlock,
)

from bson.objectid import ObjectId
from custom_user.models import User

PASSWORD = "supersecret"


@pytest.fixture
def api_client() -> APIClient:
    return APIClient()


@pytest.fixture
def user():
    user = User.objects.create_user(
        username="peterson", email="peterson@frauas.de", password=PASSWORD
    )
    return user


@pytest.mark.django_db
def test_index_redirect_to_login(api_client: APIClient, user):
    response = api_client.get("/")
    assert response.status_code == 302


@pytest.mark.django_db
def test_index_when_logged_in(api_client: APIClient, user):
    api_client.login(username=user.username, password=PASSWORD)
    response = api_client.get("/")
    assert response.status_code == 200


@pytest.fixture
def decisions():
    d1 = AnsweredDecision(
        text=[TextBlock("Header1", "Content1")],
        points=200,
        active_actions=["A", "B"],
        name="D1",
        actions=[
            Action(
                id=ObjectId(),
                title="A",
                typ="button",
                active=True,
                required=False,
                hover="ABC",
                restrictions={"a": ["b", "c"]},
                answers=[Answer(label="L", active=True, points=3)],
            )
        ],
    )
    d2 = SimulationDecision(
        text=[TextBlock("Header2", "Content2"), TextBlock("Header3", "Content3")],
        points=21,
        name="D2",
        goal=SimulationGoal(300),
        max_points=200,
    )
    return [d1, d2]


@pytest.mark.django_db
def test_load_scenario(api_client: APIClient, user, decisions):
    mongo = ScenarioMongoModel()
    s = Scenario(
        name="Test Scenario",
        budget=123,
        tasks_easy=12,
        tasks_hard=123,
        tasks_medium=54,
        decisions=decisions,
    )
    mid = mongo.save(s)

    api_client.login(username=user.username, password=PASSWORD)
    response = api_client.get(f"/new/{mid}")
    assert response.status_code == 302
    assert response.url[0:3] == "/s/"

    usid = response.url[3:]

    assert response.url == f"/s/{usid}"

    response = api_client.get(f"/continue/{usid}")
    assert response.status_code == 200
    response = api_client.get(f"/continue/{usid}")
    assert response.status_code == 200

    us = mongo.get(usid)
    assert us.template.id == s.id
