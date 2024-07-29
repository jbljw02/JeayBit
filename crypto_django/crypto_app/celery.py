from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from celery.schedules import crontab
from dotenv import load_dotenv

dotenv_path = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(dotenv_path)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "crypto_app.settings")

# 비동기 작업 큐 정의
app = Celery("crypto_app")

app.config_from_object("django.conf:settings", namespace="CELERY")

app.autodiscover_tasks()

redis_url = os.getenv("REDIS_URL")

app.conf.update(
    broker_url=redis_url,
    broker_use_ssl={"ssl_cert_reqs": "none"},
)

# 주기적으로 실행할 작업 스케줄링
app.conf.beat_schedule = {
    # 미체결 화폐 호가 비교
    "check-trade-history-5-seconds": {
        "task": "app.tasks.check_trade_history",
        "schedule": 5.0,  # 5초 주기로 task를 실행
    },
    # celery 결과 정리
    "cleanup-task-results": {
        "task": "app.tasks.cleanup_task_results",
        "schedule": crontab(hour=0, minute=0),  # 매일 자정에 실행
    },
      "keep-server-awake": {
        "task": "app.tasks.keep_server_awake",
        "schedule": crontab(minute="*/5"),  # 5분마다 실행
    },
}