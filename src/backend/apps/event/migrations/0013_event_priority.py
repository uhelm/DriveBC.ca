# Generated by Django 4.2.3 on 2024-02-13 09:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('event', '0012_alter_event_event_sub_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='priority',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
