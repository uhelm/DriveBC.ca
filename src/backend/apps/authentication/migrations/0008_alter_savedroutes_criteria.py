# Generated by Django 4.2.16 on 2024-11-05 20:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0007_savedroutes_searchtimestamp'),
    ]

    operations = [
        migrations.AlterField(
            model_name='savedroutes',
            name='criteria',
            field=models.CharField(choices=[('fastest', 'fastest'), ('shortest', 'shortest')],
                                   default='fastest', max_length=100),
        ),
    ]
