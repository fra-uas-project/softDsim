from django.urls import path

from app.api.views.user_scenario import UserScenarioViews
from app.api.views.team import SkillTypeView, TeamViews, MemberView
from app.api.views.scenario_config import ScenarioConfigView
from app.api.views.decision import DecisionView
from app.api.views.management_goal import ManagementGoalView
from app.api.security.security import (
    LoginView,
    GetCSRFToken,
    LogoutView,
    CheckAuthenticatedView,
    RegisterView,
)


# all request with /api/ land here (see softDsim/urls.py)
from app.api.views.template_scenario import TemplateScenarioView
from app.api.views.user import UserView

import app.api.simulation as sim

urlpatterns = [
    # User stuff
    path("login", LoginView.as_view(), name="login"),
    path("logout", LogoutView.as_view(), name="logout"),
    path("csrf-cookie", GetCSRFToken.as_view(), name="csrf-cookie"),
    path("authenticated", CheckAuthenticatedView.as_view(), name="authenticated"),
    path("register", RegisterView.as_view(), name="register"),
    path("user", UserView.as_view()),
    path("user/<str:username>", UserView.as_view()),
    # template scenario
    path("template-scenario", TemplateScenarioView.as_view()),
    path("template-scenario/<str:scenario_id>", TemplateScenarioView.as_view()),
    # user scenario
    path("user-scenario", UserScenarioViews.as_view()),
    path("user-scenario/<int:id>", UserScenarioViews.as_view()),
    # decision todo: remove maybe later
    path("decision", DecisionView.as_view(), name="decision"),
    path("decision/<str:decision_id>", DecisionView.as_view(), name="decision"),
    path("management-goal/", ManagementGoalView.as_view()),
    path("management-goal/<str:id>", ManagementGoalView.as_view()),
    # team and member
    path("team", TeamViews.as_view()),
    path("team/<int:id>", TeamViews.as_view()),
    path("member", MemberView.as_view()),
    path("member/<int:id>", MemberView.as_view()),
    path("skill-type", SkillTypeView.as_view()),
    path("skill-type/<int:id>", SkillTypeView.as_view()),
    # scenario config
    path("scenario-config", ScenarioConfigView.as_view()),
    path("scenario-config/<str:id>", ScenarioConfigView.as_view()),
    # SIMULATION Endpoints
    path("sim/start", sim.start_new_simulation, name="start_new_scenario"),
    path("sim/next", sim.next_step, name="next_scenario_step"),
    path("sim/team", sim.adjust_team, name="adjust_team"),
    path("sim/team/<int:id>", sim.adjust_team, name="adjust_team"),
]
