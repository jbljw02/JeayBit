# Generated by Django 4.2.1 on 2023-11-12 09:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0012_alter_customuser_balance'),
    ]

    operations = [
        migrations.AddField(
            model_name='tradehistory',
            name='is_signed',
            field=models.BooleanField(default=False),
        ),
    ]
