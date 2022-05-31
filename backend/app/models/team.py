from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator


class Team(models.Model):
    name = models.CharField(max_length=32, default="team")


class SkillType(models.Model):
    name = models.CharField(max_length=32, unique=True)
    salary = models.FloatField(validators=[MinValueValidator(0.0)])
    error_rate = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(1.0)]
    )
    throughput = models.FloatField(validators=[MinValueValidator(0.0)])

    def __str__(self):
        return self.name


class Member(models.Model):
    xp: float = models.FloatField(
        default=0.0, validators=[MinValueValidator(0.0), MaxValueValidator(1.0)]
    )
    motivation = models.FloatField(
        default=0.75, validators=[MinValueValidator(0.0), MaxValueValidator(1.0)]
    )
    stress = models.FloatField(
        default=0.1, validators=[MinValueValidator(0.0), MaxValueValidator(1.0)]
    )
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name="member")
    skill_type = models.ForeignKey(
        SkillType,
        on_delete=models.CASCADE,
        related_name="member",
        blank=True,
        null=True,
    )

    def __str__(self):
        return f"{self.skill_type.name} Member"
