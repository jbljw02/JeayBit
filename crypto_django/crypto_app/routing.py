from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'wss/trade_updates/$', consumers.TradeConsumer.as_asgi()),
]
