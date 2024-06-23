from celery import shared_task
from .models import TradeHistory
from .utils.check_price_match import check_price_match  # check_price_match 함수를 임포트
import requests
import logging
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

logger = logging.getLogger(__name__)

# Celery 작업 정의 - 미체결 화폐들을 호가와 지속적으로 비교
@shared_task
def check_trade_history():
    # 체결 여부가 False인 거래 내역을 가져옴
    trade_histories = TradeHistory.objects.filter(is_signed=False)

    for trade_history in trade_histories:
        url = f"https://api.upbit.com/v1/orderbook?markets={trade_history.crypto_market}"
        response = requests.get(url)
        json_data = response.json()
        
        # 호가 데이터를 가져옴
        orderbook_units = json_data[0]["orderbook_units"]
        
        # check_price_match 함수를 사용하여 가격 매칭 여부를 확인
        matched = check_price_match(trade_history.trade_category, trade_history.crypto_price, orderbook_units)
        
        if matched:
            trade_history.is_signed = True
            trade_history.save()
            
            # 웹소켓으로 메시지 보내기
            channel_layer = get_channel_layer()
            message = f"Trade {trade_history.id} has been signed."
            try:
                logger.info("Attempting to send message through channel layer")
                async_to_sync(channel_layer.group_send)(
                    'trade_updates',
                    {
                        'type': 'send_trade_update',
                        'message': message,
                    }
                )
                logger.info("WebSocket 메시지 전송 성공")
            except Exception as e:
                logger.error(f"WebSocket 메시지 전송 실패: {e}")
            
    
    return "Trade histories checked and updated."
