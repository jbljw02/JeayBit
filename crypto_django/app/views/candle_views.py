from rest_framework.decorators import api_view
from rest_framework.response import Response
from requests import get

# 1분 기준 차트
@api_view(["GET", "POST"])
def candle_per_minute(request):
    try:
        market = request.data["market"]
        minute = request.data["minute"]

        if minute == "1분":
            minute = 1
        elif minute == "5분":
            minute = 5
        elif minute == "10분":
            minute = 10
        elif minute == "30분":
            minute = 30
        elif minute == "1시간":
            minute = 60
        elif minute == "4시간":
            minute = 240

        if not market:
            return Response({"error ": "market 파라미터 X"}, status=400)

        url = f"https://api.upbit.com/v1/candles/minutes/{minute}?market={market}&count=100"

        response = get(url)
        data = response.json()

        return Response(data, status=200)

    except:
        return Response({"error: ": "분/시간당 캔들 호출 실패"}, status=500)


# 1일 기준 차트
@api_view(["GET", "POST"])
def candle_per_date(request):
    try:
        market = request.data["market"]

        if not market:
            return Response({"error": "market 파라미터 X"}, status=500)

        url = f"https://api.upbit.com/v1/candles/days?market={market}&count=100"

        response = get(url)
        data = response.json()

        return Response(data, status=200)

    except:
        return Response({"error: ": "1일당 캔들 호출 실패"}, status=500)


# 1주 기준 차트
@api_view(["GET", "POST"])
def candle_per_week(request):
    try:
        market = request.data["market"]

        if not market:
            return Response({"error": "market 파라미터 X"}, status=400)

        url = f"https://api.upbit.com/v1/candles/weeks?market={market}&count=100"

        response = get(url)
        data = response.json()

        return Response(data, status=200)

    except:
        return Response({"error: ": "1주당 캔들 호출 실패"}, status=500)


# 1개월 기준 차트
@api_view(["GET", "POST"])
def candle_per_month(request):
    try:
        market = request.data["market"]

        if not market:
            return Response({"error": "market 파라미터 X"}, status=500)

        url = f"https://api.upbit.com/v1/candles/months?market={market}&count=100"

        response = get(url)
        data = response.json()

        return Response(data, status=200)

    except:
        return Response({"error: ": "1개월당 캔들 호출 실패"}, status=500)