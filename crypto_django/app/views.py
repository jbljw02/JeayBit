from django.http import JsonResponse
from .crpyto_api import price
from rest_framework.decorators import api_view
from rest_framework.response import Response
from requests import get

@api_view(['POST'])
def handle_market(request):
    try:
        market = request.data['market']

        if not market:
            return Response({'error': "데이터를 받아올 수 없음"}, status=400)

        url = f"https://api.upbit.com/v1/candles/days?market=KRW-{market}&count=1"
        
        response = get(url)
        
        if response.status_code != 200:
            return Response({'error': 'Failed to get data from Upbit'}, status=500)
        
        data = response.json()

        # API 응답을 그대로 반환합니다. 실제 사용 시에는 필요한 데이터만 추출하여 반환하면 됩니다.
        return Response(data)
    
    except Exception as e:  # 모든 예외를 잡아서 출력합니다.
        print("error : ", e)

def get_data(request):
    names, cur_price, unJoin_markets, change, change_rate, change_price, acc_trade_price_24h, acc_trade_volume_24h, opening_price, high_price, low_price = price()

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
    }

    return JsonResponse(data)


