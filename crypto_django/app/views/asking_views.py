from rest_framework.decorators import api_view
from rest_framework.response import Response
from requests import get

# 호가내역
@api_view(["GET", "POST"])
def asking_price(request):
    try:
        market = request.data.get("market")

        if not market:
            return Response({"error": "market 파라미터 존재 X"}, status=400)

        url = f"https://api.upbit.com/v1/orderbook?markets={market}"

        response = get(url)

        # 업비트 api로부터 데이터 수신 실패
        if response.status_code != 200:
            return Response({"error": "업비트 API로부터 수신 실패"}, status=500)

        data = response.json()

        return Response(data, status=200)

    except:
        return Response({"error: 호가내역 받아오기 실패"}, status=500)

# 체결내역
@api_view(["GET", "POST"])
def closed_price(request):
    try:
        market = request.data.get("market")

        if not market:
            return Response({"error": "market 파라미터 존재 X"}, status=400)

        url = f"https://api.upbit.com/v1/trades/ticks?market={market}&count=50"

        response = get(url)

        # 업비트 api로부터 데이터 수신 실패
        if response.status_code != 200:
            return Response({"error": "업비트 API로부터 수신 실패"}, status=500)

        data = response.json()

        return Response(data, status=200)

    except:
        return Response({"error: 호가내역 받아오기 실패"}, status=500)