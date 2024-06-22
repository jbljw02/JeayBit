from celery import shared_task
from .models import TradeHistory
from .utils.check_price_match import check_price_match  # check_price_match 함수를 임포트
import requests

@shared_task
def check_trade_history():
    # is_signed가 False인 거래 내역을 가져옴
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
        

    return "Trade histories checked and updated."
