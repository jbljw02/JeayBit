# Generated by Django 4.2.1 on 2023-11-13 02:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0016_alter_tradehistory_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tradehistory',
            name='id',
            field=models.CharField(max_length=2000, primary_key=True, serialize=False),
        ),
    ]