from django.db import models


class TemplateScenario(models.Model):
    """
    A `TemplateScenario` is a predefined 'Story' that users go through.
    When a user starts a scenario, a UserScenario is created.

    :param management_goal: ManagementGoal with budget, duration, tasks
    :tpe management_goal: `ManagementGoal`

    :param decisions: List of decisions
    :type decisions: List[Descision]

    :param simulation:
    :type simulation: `Simulation`
    """

    id = models.AutoField(primary_key=True)
    name = models.TextField(default="default_scenario_name")
    # decisions: List[Decision] -> ForeignKey Reference in Decision Model
    # simulation = Simulation -> ForeignKey Reference in Simulation Model
