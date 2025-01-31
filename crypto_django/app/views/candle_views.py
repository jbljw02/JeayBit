import logging
from rest_framework.decorators import api_view
from rest_framework.response import Response
from requests import get
import requests

logger = logging.getLogger(__name__)

# 1분 기준 차트
@api_view(["GET"])
def candle_per_minute(request):
    try:
        market = request.query_params.get("market")
        minute = request.query_params.get("minute")

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
        else:
            logger.error(f"유효하지 않은 minute 값: {minute}")
            return Response({"error": "유효하지 않은 minute 값"}, status=400)

        if not market:
            logger.error("market 파라미터 누락")
            return Response({"error": "market 파라미터 X"}, status=400)
        
        url = f"https://api.upbit.com/v1/candles/minutes/{minute}?market={market}&count=100"

        response = requests.get(url)
        if response.status_code != 200:
            logger.error(f"Upbit API 호출 실패: status={response.status_code}, market={market}, minute={minute}")
        data = response.json()

        return Response(data, status=200)

    except Exception as e:
        logger.error(f"분/시간당 캔들 호출 실패: {str(e)}")
        return Response(
            {"error": "분/시간당 캔들 호출 실패", "details": str(e)}, status=500
        )


# 1일 기준 차트
@api_view(["GET"])
def candle_per_date(request):
    try:
        market = request.query_params.get("market")

        if not market:
            logger.error("market 파라미터 누락")
            return Response({"error": "market 파라미터 X"}, status=400)

        url = f"https://api.upbit.com/v1/candles/days?market={market}&count=100"
        response = get(url)

        if response.status_code != 200:
            logger.error(f"Upbit API 호출 실패: status={response.status_code}, market={market}")
            return Response({"error": "업비트 API 호출 실패"}, status=response.status_code)

        data = response.json()
        return Response(data, status=200)

    except Exception as e:
        logger.error(f"1일당 캔들 호출 실패: {str(e)}")
        return Response({"error": f"1일당 캔들 호출 실패: {str(e)}"}, status=500)


# 1주 기준 차트
@api_view(["GET"])
def candle_per_week(request):
    try:
        market = request.query_params.get("market")

        if not market:
            logger.error("market 파라미터 누락")
            return Response({"error": "market 파라미터 X"}, status=500)

        url = f"https://api.upbit.com/v1/candles/weeks?market={market}&count=100"

        response = requests.get(url)
        if response.status_code != 200:
            logger.error(f"Upbit API 호출 실패: status={response.status_code}, market={market}")
        data = response.json()

        return Response(data, status=200)

    except Exception as e:
        logger.error(f"1주당 캔들 호출 실패: {str(e)}")
        return Response(
            {"error": "1주당 캔들 호출 실패", "details": str(e)}, status=500
        )


# 1개월 기준 차트
@api_view(["GET"])
def candle_per_month(request):
    try:
        market = request.query_params.get("market")

        if not market:
            logger.error("market 파라미터 누락")
            return Response({"error": "market 파라미터 X"}, status=500)

        url = f"https://api.upbit.com/v1/candles/months?market={market}&count=100"

        response = requests.get(url)
        if response.status_code != 200:
            logger.error(f"Upbit API 호출 실패: status={response.status_code}, market={market}")
        data = response.json()

        return Response(data, status=200)

    except Exception as e:
        logger.error(f"1개월당 캔들 호출 실패: {str(e)}")
        return Response(
            {"error": "1개월당 캔들 호출 실패", "details": str(e)}, status=500
        )