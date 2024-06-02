from requests import get
from .models import Crypto
import json
from django.http import JsonResponse


def check_login(self, request):
    try:
        is_logged_in = request.user.is_authenticated
        return JsonResponse({"is_logged_in": is_logged_in})
    except Exception as e:
        print(f"로그인 체크 에러: {e}")
        return JsonResponse({"error": "로그인 체크 에러"}, status=500)


# def all_data(request):
#     print("아: ", request)
#     try:
#         headers = {"accept": "application/json"}
#         url = "https://api.upbit.com/v1/market/all?isDetails=true"
#         response = get(url, headers=headers)

#         market_data = json.loads(response.text)
#         market = []
#         name = []

#         user = check_login(request)

#         for crypto in market_data:
#             if (
#                 crypto["market"].startswith("KRW")
#                 and crypto["market_warning"] == "NONE"
#             ):
#                 name.append(crypto["korean_name"])
#                 market.append(crypto["market"])

#         unJoin_market = market
#         market_str = "%2C%20".join(market)
#         url = f"https://api.upbit.com/v1/ticker?markets={market_str}"
#         response = get(url, headers=headers)
#         data = json.loads(response.text)

#         all_crypto = []

#         for i in range(len(data)):
#             crypto_obj = {
#                 "name": name[i],
#                 "market": unJoin_market[i],
#                 "price": (
#                     int(data[i]["trade_price"])
#                     if data[i]["trade_price"] % 1 == 0
#                     else data[i]["trade_price"]
#                 ),
#                 "change": data[i]["change"],
#                 "change_rate": float(data[i]["change_rate"]),
#                 "change_price": (
#                     int(data[i]["change_price"])
#                     if data[i]["change_price"] % 1 == 0
#                     else data[i]["change_price"]
#                 ),
#                 "trade_price": data[i]["acc_trade_price_24h"],
#                 "trade_volume": data[i]["acc_trade_volume_24h"],
#                 "open_price": data[i]["opening_price"],
#                 "high_price": data[i]["high_price"],
#                 "low_price": data[i]["low_price"],
#             }
#             all_crypto.append(crypto_obj)

#         return all_crypto

    # except Exception as e:
    #     raise Exception(f"get_all_crypto error: {str(e)}")


# Crypto 테이블에 api로부터 받아온 화폐 정보를 업데이트
def update_crypto():
    all_crypto = all_data()  # price 함수로부터 암호화폐 정보 배열을 받음

    for crypto in all_crypto:
        # 이미 존재하는 암호화폐인지 확인
        crypto_obj = Crypto.objects.filter(name=crypto["name"]).first()

        # 존재한다면 가격 업데이트, 없다면 새로 생성
        if crypto_obj:
            crypto_obj.price = crypto["price"]
            crypto_obj.save()
        else:
            Crypto.objects.create(name=crypto["name"], price=crypto["price"])


def candle_per_date_BTC():
    headers = {"accept": "application/json"}
    url = "https://api.upbit.com/v1/candles/days?market=KRW-BTC&count=100"
    response = get(url, headers=headers)

    candle_btc_date = response.json()

    return candle_btc_date


def candle_per_week_BTC():
    headers = {"accept": "application/json"}
    url = "https://api.upbit.com/v1/candles/weeks?market=KRW-BTC&count=100"
    response = get(url, headers=headers)

    candle_btc_date = response.json()

    return candle_btc_date


def candle_per_month_BTC():
    headers = {"accept": "application/json"}
    url = "https://api.upbit.com/v1/candles/months?market=KRW-BTC&count=100"
    response = get(url, headers=headers)

    candle_btc_date = response.json()

    return candle_btc_date


def closed_price_BTC():
    headers = {"accept": "application/json"}
    url = "https://api.upbit.com/v1/trades/ticks?market=KRW-BTC&count=50"
    response = get(url, headers=headers)

    closed_price_btc = response.json()

    return closed_price_btc


def asking_price_BTC():
    headers = {"accept": "application/json"}
    url = "https://api.upbit.com/v1/orderbook?markets=KRW-BTC"
    response = get(url, headers=headers)

    asking_price_btc = response.json()

    return asking_price_btc
