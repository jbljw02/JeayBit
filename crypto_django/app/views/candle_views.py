from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import requests
import logging

logger = logging.getLogger(__name__)

# 캔들 데이터 조회
@api_view(["GET"])
def get_candle_data(request):
    try:
        market = request.query_params.get("market")
        interval = request.query_params.get("interval")  # 캔들의 기준 시간/일수
        unit = request.query_params.get("unit")  # 캔들의 분 단위

        # interval 유효성 검사
        if interval not in ["minutes", "days", "weeks", "months"]:
            logger.error(f"유효하지 않은 interval 값: {interval}")
            return Response(
                {"error": "유효하지 않은 interval 값"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 분 단위 요청이라면 유효성 검사
        if interval == "minutes":
            valid_units = ["1", "5", "10", "30", "60", "240"]
            if unit not in valid_units:
                logger.error(f"유효하지 않은 unit 값: {unit}")
                return Response(
                    {"error": "유효하지 않은 unit 값"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            url = f"https://api.upbit.com/v1/candles/{interval}/{unit}?market={market}&count=100"
        else:
            url = (
                f"https://api.upbit.com/v1/candles/{interval}?market={market}&count=100"
            )

        response = requests.get(url, headers={"accept": "application/json"})

        if response.status_code != 200:
            logger.error(
                f"Upbit API 호출 실패: status={response.status_code}, market={market}"
            )
            return Response(
                {"error": "업비트 API 호출 실패"}, status=response.status_code
            )

        return Response(response.json(), status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"캔들 데이터 조회 실패: {str(e)}")
        return Response(
            {"error": "캔들 데이터 조회 중 오류 발생"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )