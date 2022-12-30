from django.urls import path

from app.api.security.create_users import UserCreationView
from app.api.security.security import (
    LoginView,
    LogoutView,
    CheckAuthenticatedView,
    RegisterView,
)
from app.api.views.management_goal import ManagementGoalView
from app.api.views.question import QuestionView
from app.api.views.question_collection import QuestionCollectionView
from app.api.views.scenario_config import ScenarioConfigView
from app.api.views.simulation import (
    AdjustMemberView,
    StartUserScenarioView,
    NextStepView,
)
from app.api.views.team import SkillTypeView, TeamViews, MemberView
# all request with /api/ land here (see softDsim/urls.py)
from app.api.views.template_scenario import (
    TemplateScenarioUserListView,
    TemplateScenarioView,
    TemplateScenarioFromStudioView
)
from app.api.views.user import UserView
# from app.api.views.sim_api import ParameterSimulation
from app.api.views.user_scenario import UserScenarioViews
from history.view import HistoryView, ResultView

urlpatterns = [
    # User stuff
    path("login", LoginView.as_view(), name="login"),
    path("logout", LogoutView.as_view(), name="logout"),
    path("authenticated", CheckAuthenticatedView.as_view(), name="authenticated"),
    path("register", RegisterView.as_view(), name="register"),
    path("user", UserView.as_view()),
    path("user/create-many", UserCreationView.as_view()),
    path("user/<str:username>", UserView.as_view()),
    # template scenario
    path("template-scenario", TemplateScenarioView.as_view()),
    path("template-scenario/<str:scenario_id>", TemplateScenarioView.as_view()),
    path("template-overview", TemplateScenarioUserListView.as_view()),
    path("template-overview/<int:scenario_id>", TemplateScenarioUserListView.as_view()),
    # template scenario studio
    path("studio/template-scenario", TemplateScenarioFromStudioView.as_view()),
    path("studio/template-scenario/<str:scenario_id>", TemplateScenarioFromStudioView.as_view()),
    # user scenario
    path("user-scenario", UserScenarioViews.as_view()),
    path("user-scenario/<int:id>", UserScenarioViews.as_view()),
    # just for testing. todo: remove later
    path("question", QuestionView.as_view(), name="question"),
    path("question/<str:id>", QuestionView.as_view(), name="question"),
    path("management-goal/", ManagementGoalView.as_view()),
    path("management-goal/<str:id>", ManagementGoalView.as_view()),
    path(
        "question-collection",
        QuestionCollectionView.as_view(),
        name="question-collection",
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
    # HISTORY Endpoints
    path("history", HistoryView.as_view()),
    path("history/<int:id>", HistoryView.as_view()),
    path("result/<int:id>", ResultView.as_view()),
    # path("sim/param", ParameterSimulation.as_view()),
]
