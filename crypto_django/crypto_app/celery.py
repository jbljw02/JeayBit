from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

# 환경 변수에서 Django 설정 모듈을 설정합니다.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'crypto_app.settings')

# Celery 애플리케이션 생성
app = Celery('crypto_app')

# Django의 설정을 사용하도록 Celery 설정을 로드합니다.
app.config_from_object('django.conf:settings', namespace='CELERY')

# task 모듈을 자동으로 로드합니다.
app.autodiscover_tasks()

# 브로커 URL과 결과 백엔드 설정
app.conf.update(
    broker_url='amqp://guest:guest@localhost:5672//',
    result_backend='rpc://',
    broker_connection_retry_on_startup=True,
)
