# Generated by Django 4.0.5 on 2022-06-25 13:41

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("app", "0004_merge_20220619_1608"),
    ]

    operations = [
        migrations.CreateModel(
            name="Event",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("text", models.TextField()),
                (
                    "trigger_type",
                    models.TextField(blank=True, max_length=64, null=True),
                ),
                ("trigger_value", models.FloatField(blank=True, null=True)),
                (
                    "trigger_comparator",
                    models.TextField(blank=True, max_length=2, null=True),
                ),
                ("effect_type", models.TextField(blank=True, max_length=64, null=True)),
                ("effect_value", models.FloatField(blank=True, null=True)),
                (
                    "task_difficulty",
                    models.PositiveSmallIntegerField(default=1, blank=True, null=True),
                ),
                ("has_occurred", models.BooleanField(default=False)),
                (
                    "template_scenario",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="events",
                        to="app.templatescenario",
                    ),
                ),
            ],
        ),
    ]
