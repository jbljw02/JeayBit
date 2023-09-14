from django.http import JsonResponse
from .crpyto_api import price
from .crpyto_api import candle_per_date_BTC, candle_per_week_BTC, candle_per_month_BTC
from rest_framework.decorators import api_view
from rest_framework.response import Response
from requests import get

# 1분 기준 차트
@api_view(['GET', 'POST'])
def candle_per_minute(request):
    try:
        print("마켓 : ", request.data['market'])
        print("분 : ", request.data['minute'])
        market = request.data['market']
        minute = request.data['minute']

        if minute == '1분':
            minute = 1
        elif minute == '5분':
            minute = 5
        elif minute == '10분':
            minute = 10
        elif minute == '30분':
            minute = 30
        elif minute == '1시간':
            minute = 60
        elif minute == '4시간':
            minute = 240

        if not market:
            return Response({'error': "market 데이터를 받아올 수 없음"}, status=400)

        url = f"https://api.upbit.com/v1/candles/minutes/{minute}?market={market}&count=100"    

        response = get(url)
        print(response)

        # 업비트 api로부터 데이터 수신 실패
        if response.status_code != 200:
            return Response({'error': 'Failed to get data from Upbit'}, status=500)
        
        data = response.json()

        return Response(data)
    
    except Exception as e:  
        print("error : ", e) 

# 1일 기준 차트
@api_view(['GET', 'POST'])
def candle_per_date(request):
    try:
        market = request.data['market']

        if not market:
            return Response({'error': "market 데이터를 받아올 수 없음"}, status=400)

        url = f"https://api.upbit.com/v1/candles/days?market={market}&count=100"
        
        response = get(url)
        print(response)
        
        # 업비트 api로부터 데이터 수신 실패
        if response.status_code != 200:
            return Response({'error': 'Failed to get data from Upbit'}, status=500)
        
        data = response.json()

        return Response(data)
    
    except Exception as e:  
        print("error : ", e)    

# 1주 기준 차트
@api_view(['GET', 'POST'])
def candle_per_week(request):
    try:
        market = request.data['market']

        if not market:
            return Response({'error': "market 데이터를 받아올 수 없음"}, status=400)        

        url = f"https://api.upbit.com/v1/candles/weeks?market={market}&count=100"

        response = get(url)
        print(response)

        # 업비트 api로부터 데이터 수신 실패
        if response.status_code != 200:
            return Response({'error': 'Failed to get data from Upbit'}, status=500)
        
        data = response.json()

        return Response(data)

    except Exception as e:
        print("error : ", e)

# 1개월 기준 차트
@api_view(['GET', 'POST'])
def candle_per_month(request):
    try:
        market = request.data['market']

        if not market:
            return Response({'error': "market 데이터를 받아올 수 없음"}, status=400)        

        url = f"https://api.upbit.com/v1/candles/months?market={market}&count=100"

        response = get(url)
        print(response)

        # 업비트 api로부터 데이터 수신 실패
        if response.status_code != 200:
            return Response({'error': 'Failed to get data from Upbit'}, status=500)
        
        data = response.json()

        return Response(data)

    except Exception as e:
        print("error : ", e)

# 호가내역
@api_view(['GET', 'POST'])
def asking_price(request):
    try:
        market = request.data['market']

        if not market:
            return Response({'error': "market 데이터를 받아올 수 없음"}, status=400) 

        url = f"https://api.upbit.com/v1/orderbook?markets={market}"

        response = get(url)
        print(response)

        # 업비트 api로부터 데이터 수신 실패
        if response.status_code != 200:
            return Response({'error': 'Failed to get data from Upbit'}, status=500)
        
        data = response.json()

        return Response(data)

    except Exception as e:
        print("error : ", e)

# 체결내역
@api_view(['GET', 'POST'])
def closed_price(request):
    try:
        market = request.data['market']

        if not market:
            return Response({'error': "market 데이터를 받아올 수 없음"}, status=400)
        
        url = "https://api.upbit.com/v1/trades/ticks?market=KRW-BTC&count=50"

        response = get(url)
        print(response)

        # 업비트 api로부터 데이터 수신 실패
        if response.status_code != 200:
            return Response({'error': 'Failed to get data from Upbit'}, status=500)

        data = response.json()

        return Response(data)
    
    except Exception as e:
        print("error : ", e)

def get_data(request):
    names, cur_price, unJoin_markets, change, change_rate, change_price, acc_trade_price_24h, acc_trade_volume_24h, opening_price, high_price, low_price = price()
    
    candle_btc_date = candle_per_date_BTC()

    data = {
        'names': names,
        'cur_price' : cur_price,
        'markets' : unJoin_markets,
        'change' : change,
        'change_rate' : change_rate, 
        'change_price' : change_price,
        'trade_price' : acc_trade_price_24h,
        'trade_volume' : acc_trade_volume_24h,
        'opening_price' : opening_price,
        'high_price' : high_price,
        'low_price' : low_price,
        'candle_btc_date' : candle_btc_date,
    }

    return JsonResponse(data)