# Generated by Django 4.0.5 on 2022-06-19 13:29

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("app", "0002_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="skilltype",
            name="development_quality",
            field=models.PositiveSmallIntegerField(
                default=50,
                validators=[
                    django.core.validators.MinValueValidator(0),
                    django.core.validators.MaxValueValidator(100),
                ],
            ),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="skilltype",
            name="management_quality",
            field=models.PositiveSmallIntegerField(
                default=10,
                validators=[
                    django.core.validators.MinValueValidator(0),
                    django.core.validators.MaxValueValidator(100),
                ],
            ),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="skilltype",
            name="signing_bonus",
            field=models.FloatField(
                default=2000, validators=[django.core.validators.MinValueValidator(0.0)]
            ),
            preserve_default=False,
        ),
    ]
