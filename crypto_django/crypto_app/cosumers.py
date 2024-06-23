import json
from channels.generic.websocket import AsyncWebsocketConsumer
import logging

logger = logging.getLogger(__name__)

# 웹소켓 관리를 위한 클래스
class TradeConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("trade_updates", self.channel_name)
        await self.accept()
        logger.info("WebSocket 연결 및 그룹 추가")
        
        await self.send_trade_update({'message': 'Test message'})

    async def disconnect(self):
        await self.channel_layer.group_discard("trade_updates", self.channel_name)
        logger.info("WebSocket 연결 해제 및 그룹 삭제")

    async def receive(self):
        pass

    # 클라이언트에게 화폐가 거래 완료됐음을 알림
    async def send_trade_update(self, event):
        message = event['message']
        logger.info(f"미체결 화폐 거래 완료: {message}")
        await self.send(text_data=json.dumps({
            'message': message
        }))
