from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator


# todo philip: maybe change class name? amount of tasks is probably not a management goal anymore

from app.models.template_scenario import TemplateScenario


class ManagementGoal(models.Model):
    """A `ManagementGoal` is the part of a `TemplateScenario` that describes
    what the goals, set by management, are. Including:
    duration: How many days are scheduled?
    budget: how many dollars can be spent?
    easy_task: how many easy tasks
    medium_task: how many medium tasks
    hard_task: how many hard tasks
    tasks_predecessor_p: Probability of a task having a predecessor
    :type predecessor_p: float [0 <= p <= 1]
    template_scenario: OneToOne Relationship to TemplateScenario Model (references ID of TemplateScenario)
    """

    id = models.AutoField(primary_key=True)
    budget = models.FloatField()
    duration = models.PositiveIntegerField()
    easy_tasks = models.PositiveIntegerField()
    medium_tasks = models.PositiveIntegerField()
    hard_tasks = models.PositiveIntegerField()
    tasks_predecessor_p = models.FloatField(
        default=0.1,
        validators=[MinValueValidator(0.0), MaxValueValidator(1.0)],
    )

    template_scenario = models.OneToOneField(
        TemplateScenario, on_delete=models.CASCADE, related_name="management_goal"
    )
