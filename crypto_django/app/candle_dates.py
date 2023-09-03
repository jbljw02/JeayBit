import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'crypto_django.crypto_app.settings')
django.setup()

from requests import get
from rest_framework.decorators import api_view
from rest_framework.response import Response

# print("Current directory:", os.getcwd())
# print("PYTHONPATH:", os.getenv('PYTHONPATH'))

headers = {"accept" : "application/json"}

# months / weeks / days / minutes + 1,3,5,10,15,30,60,240..

@api_view(['POST'])
def handle_market(request):
    market = request.data['market']
    print(market)

    if not market:
        return Response({'error' : '데이터를 받아올 수 없음'}, status=400)

    url = f"https://api.upbit.com/v1/candles/days?market=KRW-{market}&count=1"
    
    response = get(url)
    
    if response.status_code != 200:
        return Response({'error': 'Failed to get data from Upbit'}, status=500)
    
    data = response.json()

    # API 응답을 그대로 반환합니다. 실제 사용 시에는 필요한 데이터만 추출하여 반환하면 됩니다.
    return Response(data)

handle_market()

def allMarkets():
    url = "https://api.upbit.com/v1/market/all"
    response = get(url, headers=headers)

    markets = [market['market'] for market in eval(response.text) if market['market'].startswith('KRW-')]

    print(markets)
    return markets


def datesCandle():
    url = "https://api.upbit.com/v1/candles/days?market=KRW-BTC&count=200"
    response = get(url, headers=headers)

    dates_candle = []

    for result in eval(response.text):
        # print(f"날짜 : {result['candle_date_time_kst']}")
        # print(f"시가 : {result['opening_price']}")
        # print(f"고가 : {result['high_price']}")
        # print(f"저가 : {result['low_price']}")
        # print(f"종가 : {result['trade_price']}")
        # print(f"거래량 : {result['candle_acc_trade_volume']}")
        # print(f"거래대금 : {result['candle_acc_trade_price']}")
        
        entry = {}

        entry['날짜'] = result['candle_date_time_kst']
        entry['시가'] = result['opening_price']
        entry['고가'] = result['high_price']
        entry['저가'] = result['low_price']
        entry['종가'] = result['trade_price']
        entry['거래량'] = result['candle_acc_trade_volume']
        entry['거래대금'] = result['candle_acc_trade_price']

        dates_candle.append(entry)

    print(dates_candle)
    return dates_candle

def monthsCandle():
    url = "https://api.upbit.com/v1/candles/months?market=KRW-BTC&count=200"
    response = get(url, headers=headers)

    months_candle = []

    for result in eval(response.text):
        # print(f"날짜 : {result['candle_date_time_kst']}")
        # print(f"시가 : {result['opening_price']}")
        # print(f"고가 : {result['high_price']}")
        # print(f"저가 : {result['low_price']}")
        # print(f"종가 : {result['trade_price']}")
        # print(f"거래량 : {result['candle_acc_trade_volume']}")
        # print(f"거래대금 : {result['candle_acc_trade_price']}")

        entry = {}

        entry['날짜'] = result['candle_date_time_kst']
        entry['시가'] = result['opening_price']
        entry['고가'] = result['high_price']
        entry['저가'] = result['low_price']
        entry['종가'] = result['trade_price']
        entry['거래량'] = result['candle_acc_trade_volume']
        entry['거래대금'] = result['candle_acc_trade_price']

        months_candle.append(entry)
    
    print(months_candle)
    return months_candle


def weeksCandle():
    url = "https://api.upbit.com/v1/candles/weeks?market=KRW-BTC&count=200"
    response = get(url, headers=headers)

    weeks_candle = []

    for result in eval(response.text):
        print(f"날짜 : {result['candle_date_time_kst']}")
        print(f"시가 : {result['opening_price']}")
        print(f"고가 : {result['high_price']}")
        print(f"저가 : {result['low_price']}")
        print(f"종가 : {result['trade_price']}")
        print(f"거래량 : {result['candle_acc_trade_volume']}")
        print(f"거래대금 : {result['candle_acc_trade_price']}")

        entry = {}

        entry['날짜'] = result['candle_date_time_kst']
        entry['시가'] = result['opening_price']
        entry['고가'] = result['high_price']
        entry['저가'] = result['low_price']
        entry['종가'] = result['trade_price']
        entry['거래량'] = result['candle_acc_trade_volume']
        entry['거래대금'] = result['candle_acc_trade_price']

        weeks_candle.append(entry)

    print(weeks_candle)
    return weeks_candle
