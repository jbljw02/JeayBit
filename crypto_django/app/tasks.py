from celery import shared_task
from .models import TradeHistory
from .utils.check_price_match import check_price_match
import requests
import logging
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from celery.result import AsyncResult
from concurrent.futures import ThreadPoolExecutor, as_completed

logger = logging.getLogger(__name__)


def fetch_orderbook(trade_history):
    url = f"https://api.upbit.com/v1/orderbook?markets={trade_history.crypto_market}"
    response = requests.get(url)
    json_data = response.json()

    # 호가 데이터를 가져옴
    orderbook_units = json_data[0]["orderbook_units"]

    # check_price_match 함수를 사용하여 가격 매칭 여부를 확인
    matched = check_price_match(
        trade_history.trade_category, trade_history.crypto_price, orderbook_units
    )

    if matched:
        trade_history.is_signed = True
        trade_history.save()

        # 웹소켓으로 메시지 보내기
        channel_layer = get_channel_layer()

        message = {
            "trade_time": trade_history.trade_time.isoformat(),
            "crypto_name": trade_history.crypto.name,
            "trade_category": trade_history.trade_category,
            "crypto_price": trade_history.crypto_price,
        }

        try:
            async_to_sync(channel_layer.group_send)(
                "trade_updates",
                {
                    "type": "send_trade_update",
                    "message": message,
                },
            )
            logger.info(f"WebSocket 메시지 전송 성공: {message}")
        except Exception as e:
            logger.error(f"WebSocket 메시지 전송 실패: {e}")
    return trade_history


@shared_task
def check_trade_history():
    trade_histories = TradeHistory.objects.filter(is_signed=False)

    if not trade_histories.exists():
        logger.info(trade_histories)
        return "미체결 화폐가 없습니다."

    with ThreadPoolExecutor() as executor:
        futures = [
            executor.submit(fetch_orderbook, trade_history)
            for trade_history in trade_histories
        ]
        for future in as_completed(futures):
            try:
                future.result()
            except Exception as e:
                logger.error(f"작업 처리 중 오류 발생: {e}")

    return f"미체결 화폐 검사 완료: {trade_histories}"


@shared_task
def cleanup_task_results(max_results=100):
    total_results = AsyncResult.objects.count()

    if total_results > max_results:
        excess_results = total_results - max_results
        results_to_delete = AsyncResult.objects.order_by("date_done")[:excess_results]
        results_to_delete.delete()


@shared_task
def keep_server_awake():
    try:
        response = requests.get("https://jeaybit.onrender.com")
        if response.status_code == 200:
            logger.info("서버 실행중")
        else:
            logger.error(f"서버 Health Check 실패: {response.status_code}")
    except Exception as e:
        logger.error(f"서버 Health Check 도중 에러: {e}")
