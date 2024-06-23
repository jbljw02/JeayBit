from django.urls import re_path
from . import cosumers

websocket_urlpatterns = [
    re_path(r'ws/trade_updates/$', cosumers.TradeConsumer.as_asgi()),
]
