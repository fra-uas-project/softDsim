from app.models.team import SkillType
from django.db import models
from history.models.history import History


class HistoryMemberStatus(models.Model):
    history = models.ForeignKey(
        History, on_delete=models.CASCADE, related_name="members"
    )
    member_id = models.PositiveBigIntegerField()
    motivation = models.FloatField()
    stress = models.FloatField()
    xp = models.FloatField()
    skill_type = models.ForeignKey(SkillType, on_delete=models.SET_NULL, null=True)
    skill_type_name = models.TextField(max_length=64)


class HistoryMemberChanges(models.Model):
    history = models.ForeignKey(
        History, on_delete=models.CASCADE, related_name="member_changes"
    )
    change = models.IntegerField()
    skill_type = models.ForeignKey(SkillType, on_delete=models.SET_NULL, null=True)
    skill_type_name = models.TextField(max_length=64)
