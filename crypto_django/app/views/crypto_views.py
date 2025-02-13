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

logger = logging.getLogger(__name__)

def crypto_api():
    try:
        headers = {"accept": "application/json"}
        url = "https://api.upbit.com/v1/market/all?isDetails=true"
        response = get(url, headers=headers)

        market = []
        name = []

        for crypto in json.loads(response.text):
            if crypto["market"].startswith("KRW") and crypto.get("market_warning", "NONE") == "NONE":
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


class GetAllCryptoView(View):
    async def post(self, request):
        try:
            # 비동기적으로 로그인 여부 확인
            is_logged_in = await sync_to_async(lambda: request.user.is_authenticated)()

            headers = {"accept": "application/json"}
            url1 = "https://api.upbit.com/v1/market/all?isDetails=true"
            url2_template = "https://api.upbit.com/v1/ticker?markets={}"

            async with aiohttp.ClientSession() as session:
                async with session.get(url1, headers=headers) as response1:
                    market_data = await response1.json()

                market = [
                    crypto["market"]
                    for crypto in market_data
                    if crypto["market"].startswith("KRW")
                    and crypto.get("market_warning", "NONE") == "NONE"
                ]
                name = [
                    crypto["korean_name"]
                    for crypto in market_data
                    if crypto["market"].startswith("KRW")
                    and crypto.get("market_warning", "NONE") == "NONE"
                ]

                market_str = "%2C%20".join(market)
                url2 = url2_template.format(market_str)
                async with session.get(url2, headers=headers) as response2:
                    data = await response2.json()

            all_crypto = []

            # 로그인된 경우 UserCrypto 데이터를 미리 가져오기
            if is_logged_in:
                user_cryptos = await sync_to_async(list)(
                    UserCrypto.objects.filter(user=request.user, crypto__name__in=name)
                )
                user_crypto_dict = {uc.crypto.name: uc for uc in user_cryptos}
            else:
                user_crypto_dict = {}

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

                if is_logged_in:
                    user_crypto_info = user_crypto_dict.get(name[i])
                    if user_crypto_info:
                        crypto_obj["is_favorited"] = user_crypto_info.is_favorited
                        crypto_obj["is_owned"] = user_crypto_info.is_owned
                        crypto_obj["owned_quantity"] = user_crypto_info.owned_quantity
                    else:
                        crypto_obj["is_favorited"] = False
                        crypto_obj["is_owned"] = False
                        crypto_obj["owned_quantity"] = 0.00

                all_crypto.append(crypto_obj)
        except Exception as e:
            logger.error(f"암호화폐 데이터 가져오기 에러: {e}")
            return JsonResponse({"error": "암호화폐 데이터 가져오기 에러"}, status=500)

        data = {
            "is_logged_in": is_logged_in,
            "all_crypto": all_crypto,
        }

        # 응답 전에 카멜 케이스로 변환
        camel_case_data = convert_dict_to_camel_case(data)
        return JsonResponse(camel_case_data, status=200)


# 호가내역
@api_view(["GET"])
def asking_price(request):
    try:
        market = request.query_params.get("market")
        if not market:
            logger.error("market 파라미터 누락")
            return Response({"error": "market 파라미터 존재 X"}, status=400)

        url = f"https://api.upbit.com/v1/orderbook?markets={market}"

        response = requests.get(url)

        # 업비트 api로부터 데이터 수신 실패
        if response.status_code != 200:
            return Response({"error": "업비트 API로부터 수신 실패"}, status=500)

        data = response.json()

        return Response(data, status=200)

    except Exception as e:
        logger.error(f"호가내역 받아오기 실패: {e}")
        return Response(
            {"error": "호가내역 받아오기 실패", "details": str(e)}, status=500
        )


# 체결내역
@api_view(["GET"])
def closed_price(request):
    try:
        market = request.query_params.get("market")
        if not market:
            logger.error("market 파라미터 누락")
            return Response({"error": "market 파라미터 존재 X"}, status=400)

        url = f"https://api.upbit.com/v1/trades/ticks?market={market}&count=50"

        response = get(url)

        # 업비트 api로부터 데이터 수신 실패
        if response.status_code != 200:
            return Response({"error": "업비트 API로부터 수신 실패"}, status=500)

        data = response.json()

        return Response(data, status=200)

    except Exception as e:
        logger.error(f"체결내역 받아오기 실패: {e}")
        return Response({"error: 체결내역 받아오기 실패"}, status=500)