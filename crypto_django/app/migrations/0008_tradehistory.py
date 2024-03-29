# Generated by Django 4.2.1 on 2023-11-09 06:19

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0007_usercrypto_owned_quantity'),
    ]

    operations = [
        migrations.CreateModel(
            name='TradeHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('trade_time', models.DateTimeField(auto_now_add=True)),
                ('market', models.CharField(max_length=200)),
                ('crypto_price', models.FloatField()),
                ('trade_price', models.DecimalField(decimal_places=8, max_digits=30)),
                ('trade_amount', models.DecimalField(decimal_places=8, max_digits=30)),
                ('crypto', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.crypto')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
