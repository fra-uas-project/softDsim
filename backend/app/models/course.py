from django.db import models
from app.models.template_scenario import TemplateScenario
from custom_user.models import User


class Course(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, unique=True)
    scenarios = models.ManyToManyField(TemplateScenario)
    users = models.ManyToManyField(User)
