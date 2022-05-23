from django.urls import path

from app.api.views.question_collection import QuestionCollectionView
from app.api.views.user_scenario import UserScenarioViews
from app.api.views.team import SkillTypeView, TeamViews, MemberView
from app.api.views.scenario_config import ScenarioConfigView
from app.api.views.question import QuestionView
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

from app.api.views.simulation import (
    AdjustMemberView,
    StartUserScenarioView,
    NextStepView,
)


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
    # just for testing. todo: remove later
    path("question", QuestionView.as_view(), name="question"),
    path("question/<str:id>", QuestionView.as_view(), name="question"),
    path("management-goal/", ManagementGoalView.as_view()),
    path("management-goal/<str:id>", ManagementGoalView.as_view()),
    path(
        "question_collection",
        QuestionCollectionView.as_view(),
        name="question_collection",
    ),
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
    path("sim/start", StartUserScenarioView.as_view()),
    path("sim/next", NextStepView.as_view()),
    path("sim/team", AdjustMemberView.as_view()),
    path("sim/team/<int:id>", AdjustMemberView.as_view()),
]
