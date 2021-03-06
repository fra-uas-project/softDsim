# Generated by Django 4.0.5 on 2022-06-28 18:09

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0007_merge_20220628_1119'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='event',
            name='effect_type',
        ),
        migrations.RemoveField(
            model_name='event',
            name='effect_value',
        ),
        migrations.RemoveField(
            model_name='event',
            name='has_occurred',
        ),
        migrations.RemoveField(
            model_name='event',
            name='task_difficulty',
        ),
        migrations.CreateModel(
            name='EventStatus',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('event_id', models.IntegerField()),
                ('has_happened', models.BooleanField(default=False)),
                ('state', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='event_status', to='app.scenariostate')),
            ],
        ),
        migrations.CreateModel(
            name='EventEffect',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.TextField(blank=True, max_length=64, null=True)),
                ('value', models.FloatField(blank=True, null=True)),
                ('easy_tasks', models.PositiveIntegerField(blank=True, default=0, null=True)),
                ('medium_tasks', models.PositiveIntegerField(blank=True, default=0, null=True)),
                ('hard_tasks', models.PositiveIntegerField(blank=True, default=0, null=True)),
                ('event', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='effects', to='app.event')),
            ],
        ),
    ]
