# Generated by Django 4.2.1 on 2023-06-13 23:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('webcam', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='webcam',
            name='highway_description',
            field=models.CharField(blank=True, max_length=128, null=True),
        ),
        migrations.AlterField(
            model_name='webcam',
            name='orientation',
            field=models.CharField(blank=True, choices=[('N', 'North'), ('NE', 'North East'), ('E', 'East'), ('SE', 'South East'), ('S', 'South'), ('SW', 'South West'), ('W', 'West'), ('NW', 'North West'), ('NULL', 'null')], max_length=32, null=True),
        ),
    ]
