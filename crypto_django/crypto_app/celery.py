from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'crypto_app.settings')

app = Celery('crypto_app')

app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()

app.conf.beat_schedule = {
    'my-task-every-5-seconds': {
        'task': 'app.tasks.check_trade_history',
        'schedule': 2.0, # 5초 주기로 task를 실행
        'args': (), # 작업에 전달할 인자
    },
}