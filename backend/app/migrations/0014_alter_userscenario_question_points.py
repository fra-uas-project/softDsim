# Generated by Django 4.0.5 on 2022-07-10 13:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0013_scenarioconfig_randomness'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userscenario',
            name='question_points',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
    ]
