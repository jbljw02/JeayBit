from requests import get

from app.utils.camel_case_converter import convert_dict_to_camel_case
from ..models import Crypto, UserCrypto
import json
from django.http import JsonResponse
from django.views import View
from rest_framework.decorators import api_view
from rest_framework.response import Response
from requests import get
import requests
from asgiref.sync import sync_to_async
import aiohttp
import logging
from rest_framework.views import APIView
from rest_framework import status

logger = logging.getLogger(__name__)


def crypto_api():
    try:
        headers = {"accept": "application/json"}
        url = "https://api.upbit.com/v1/market/all?isDetails=true"
        response = get(url, headers=headers)

        market = []
        name = []

        for crypto in json.loads(response.text):
            if (
                crypto["market"].startswith("KRW")
                and crypto.get("market_warning", "NONE") == "NONE"
            ):
                name.append(crypto["korean_name"])
                market.append(crypto["market"])

        unJoin_market = market

        market = "%2C%20".join(market)
        url = f"https://api.upbit.com/v1/ticker?markets={market}"
        response = get(url, headers=headers)

        data = json.loads(response.text)

        cur_price = []  # 종가 및 현재가
        change = []  # 변화여부(상승/유지/하락)
        change_rate = []  # 변화율
        change_price = []  # 변화가격
        acc_trade_price_24h = []  # 24시간 거래대금
        acc_trade_volume_24h = []  # 24시간 거래량
        open_price = []  # 시가
        high_price = []  # 고가
        low_price = []  # 종가

        for i in range(len(data)):

            if data[i]["trade_price"] % 1 == 0:
                cur_price.append(int(data[i]["trade_price"]))
            else:
                cur_price.append(data[i]["trade_price"])

            change.append(data[i]["change"])
            change_rate.append(float(data[i]["change_rate"]))

            if data[i]["change_price"] % 1 == 0:
                change_price.append(int(data[i]["change_price"]))
            else:
                change_price.append(data[i]["change_price"])

            acc_trade_price_24h.append(data[i]["acc_trade_price_24h"])
            acc_trade_volume_24h.append(data[i]["acc_trade_volume_24h"])
            open_price.append(data[i]["opening_price"])
            high_price.append(data[i]["high_price"])
            low_price.append(data[i]["low_price"])

        return (
            name,
            cur_price,
            unJoin_market,
            change,
            change_rate,
            change_price,
            acc_trade_price_24h,
            acc_trade_volume_24h,
            open_price,
            high_price,
            low_price,
        )
    except Exception as e:
        logger.error(f"암호화폐 데이터 가져오기 에러: {e}")
        return None


# Crypto 테이블에 api로부터 받아온 화폐 정보를 업데이트
def update_crypto():
    name, cur_price, _, _, _, _, _, _, _, _, _ = crypto_api()

    for i in range(len(name)):
        # 이미 존재하는 암호화폐인지 확인
        crypto = Crypto.objects.filter(name=name[i]).first()

        # 존재한다면 가격 업데이트, 없다면 새로 생성
        if crypto:
            crypto.price = cur_price[i]
            crypto.save()
        else:
            Crypto.objects.create(name=name[i], price=cur_price[i])


# 모든 암호화폐 정보 조회
class CryptoListView(View):
    async def get(self, request):
        try:
            # 비동기적으로 로그인 여부 확인
            is_logged_in = await sync_to_async(lambda: request.user.is_authenticated)()

            headers = {"accept": "application/json"}
            url1 = "https://api.upbit.com/v1/market/all?isDetails=true"
            url2_template = "https://api.upbit.com/v1/ticker?markets={}"

            # 비동기 HTTP 요청 수행
            async with aiohttp.ClientSession() as session:
                # 마켓 정보 조회
                async with session.get(url1, headers=headers) as response1:
                    if response1.status != 200:
                        return JsonResponse(
                            {"error": "업비트 마켓 정보 조회 실패"},
                            status=status.HTTP_502_BAD_GATEWAY,
                        )
                    market_data = await response1.json()

                # KRW 마켓만 필터링
                market = []
                name = []
                for crypto in market_data:
                    if (
                        crypto["market"].startswith("KRW")
                        and crypto.get("market_warning", "NONE") == "NONE"
                    ):
                        market.append(crypto["market"])
                        name.append(crypto["korean_name"])

                # 현재가 정보 조회
                market_str = "%2C%20".join(market)
                url2 = url2_template.format(market_str)
                async with session.get(url2, headers=headers) as response2:
                    if response2.status != 200:
                        return JsonResponse(
                            {"error": "업비트 API 현재가 조회 실패"},
                            status=status.HTTP_502_BAD_GATEWAY,
                        )
                    data = await response2.json()

            # 사용자 암호화폐 정보 조회(로그인된 경우)
            user_crypto_dict = {}
            if is_logged_in:
                user_cryptos = await sync_to_async(list)(
                    UserCrypto.objects.filter(user=request.user, crypto__name__in=name)
                )
                user_crypto_dict = {uc.crypto.name: uc for uc in user_cryptos}

            # 응답 데이터 구성
            all_crypto = []
            for i in range(len(data)):
                trade_price = data[i].get("trade_price")
                change_price = data[i].get("change_price")
                crypto_obj = {
                    "name": name[i],
                    "market": market[i],
                    "price": (
                        int(trade_price)
                        if trade_price and trade_price % 1 == 0
                        else trade_price
                    ),
                    "change": data[i]["change"],
                    "change_rate": float(data[i]["change_rate"]),
                    "change_price": (
                        int(change_price)
                        if change_price and change_price % 1 == 0
                        else change_price
                    ),
                    "trade_price": data[i]["acc_trade_price_24h"],
                    "trade_volume": data[i]["acc_trade_volume_24h"],
                    "open_price": data[i]["opening_price"],
                    "high_price": data[i]["high_price"],
                    "low_price": data[i]["low_price"],
                }

                # 로그인된 사용자의 추가 정보
                if is_logged_in:
                    user_crypto_info = user_crypto_dict.get(name[i])
                    crypto_obj.update(
                        {
                            "is_favorited": (
                                user_crypto_info.is_favorited
                                if user_crypto_info
                                else False
                            ),
                            "is_owned": (
                                user_crypto_info.is_owned if user_crypto_info else False
                            ),
                            "owned_quantity": (
                                user_crypto_info.owned_quantity
                                if user_crypto_info
                                else 0.00
                            ),
                        }
                    )

                all_crypto.append(crypto_obj)

            response_data = {
                "is_logged_in": is_logged_in,
                "all_crypto": all_crypto,
            }

            # 비동기 뷰: JsonResponse
            return JsonResponse(
                convert_dict_to_camel_case(response_data), status=status.HTTP_200_OK
            )
        except Exception as e:
            logger.error(f"암호화폐 데이터 가져오기 에러: {e}")
            return JsonResponse(
                {"error": "암호화폐 데이터 가져오기 에러"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


@api_view(["GET"])
def get_orderbook(request):
    """호가내역 조회
    GET /api/v1/markets/{market}/orderbook/
    """
    try:
        market = request.query_params.get("market")
        if not market:
            logger.error("market 파라미터 누락")
            return Response(
                {"error": "market 파라미터가 필요합니다"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        url = f"https://api.upbit.com/v1/orderbook?markets={market}"
        response = requests.get(url, headers={"accept": "application/json"})

        if response.status_code != 200:
            logger.error(f"Upbit API 호출 실패: status={response.status_code}")
            return Response(
                {"error": "업비트 API 호출 실패"}, status=status.HTTP_502_BAD_GATEWAY
            )

        return Response(response.json(), status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"호가내역 조회 실패: {str(e)}")
        return Response(
            {"error": "호가내역 조회 중 오류가 발생"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
def get_tradebook(request):
    """체결내역 조회
    GET /api/v1/markets/{market}/trades/
    """
    try:
        market = request.query_params.get("market")

        url = f"https://api.upbit.com/v1/trades/ticks?market={market}&count=50"
        response = requests.get(url, headers={"accept": "application/json"})

        if response.status_code != 200:
            logger.error(f"Upbit API 호출 실패: status={response.status_code}")
            return Response(
                {"error": "업비트 API 호출 실패"}, status=status.HTTP_502_BAD_GATEWAY
            )

        return Response(response.json(), status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"체결내역 조회 실패: {str(e)}")
        return Response(
            {"error": "체결내역 조회 중 오류 발생"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )