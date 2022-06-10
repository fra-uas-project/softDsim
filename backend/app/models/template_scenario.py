from django.db import models


class TemplateScenario(models.Model):
    """
    A `TemplateScenario` is a predefined 'Story' that users go through.
    When a user starts a scenario, a UserScenario is created.

    :param management_goal: ManagementGoal with budget, duration, tasks
    :tpe management_goal: `ManagementGoal`

    :param questions: List of questions
    :type questions: List[Questions]

    :param simulation:
    :type simulation: `Simulation`
    """

    id = models.AutoField(primary_key=True)
    name = models.TextField(default="default_scenario_name")
    story = models.TextField(default="", max_length=65536, blank=True)
    # questions: List[Questions] -> ForeignKey Reference in Questions Model
    # simulation = Simulation -> ForeignKey Reference in Simulation Model
