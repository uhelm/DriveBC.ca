# Generated by Django 4.2.11 on 2024-08-30 21:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '0018_alter_advisory_body_alter_bulletin_body'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='advisory',
            options={'verbose_name_plural': 'advisories'},
        ),
        migrations.AlterModelOptions(
            name='ferry',
            options={'verbose_name_plural': 'ferries'},
        ),
    ]
