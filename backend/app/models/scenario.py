from django.db import models


class ScenarioConfig(models.Model):
    name = models.CharField(max_length=32, unique=True)
    stress_error_optimum = models.FloatField(default=0.2)
    stress_weekend_reduction = models.FloatField(default=-0.15)
    stress_overtime_increase = models.FloatField(default=0.05)
    stress_error_increase = models.FloatField(default=0.02)
    task_completion_coefficient = models.FloatField(default=1.0)
    error_completion_coefficient = models.FloatField(default=1.5)
    done_tasks_per_meeting = models.IntegerField(default=50)
    done_tasks_familiarity_factor = models.FloatField(default=10)
    train_skill_increase_rate = models.FloatField(default=0.1)
    cost_member_team_event = models.FloatField(default=500.0)
    randomness = models.TextField(default="full")  # 'full', 'semi', 'none'
