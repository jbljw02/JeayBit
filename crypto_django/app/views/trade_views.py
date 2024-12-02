from rest_framework.decorators import api_view
from rest_framework.response import Response
from app.models import Crypto, CustomUser, TradeHistory
from rest_framework.decorators import api_view
from rest_framework.response import Response
from requests import get
from decimal import Decimal
from app.utils.buy_process import buy_process
from app.utils.check_price_match import check_price_match
from app.utils.sell_process import sell_process
import math
import logging

logger = logging.getLogger(__name__)

# 사용자, 화폐별 거래내역을 추가 및 매수/매도 처리
@api_view(["POST"])
def add_user_trade_history(request):
    data = request.data

    email = data.get("email")
    crypto_name = data.get("crypto_name")
    trade_category = data.get("trade_category")
    trade_time = data.get("trade_time")
    crypto_market = data.get("crypto_market")
    crypto_price = data.get("crypto_price")
    trade_price = data.get("trade_price")
    trade_amount = data.get("trade_amount")
    market = data.get("market")
    isMarketValue = data.get("isMarketValue")

    if not email:
        return Response({"error": "요청에 이메일이 포함되어야 합니다"}, status=400)
    if not crypto_name:
        return Response({"error": "요청에 화폐명이 포함되어야 합니다"}, status=400)
    if not trade_category:
        return Response(
            {"error": "요청에 거래가 '매수'인지 '매도'인지 포함되어야 합니다"},
            status=400,
        )
    if not trade_time:
        return Response({"error": "요청에 현재 시간이 포함되어야 합니다"}, status=400)
    if not crypto_market:
        return Response({"error": "요청에 화폐 마켓이 포함되어야 합니다."}, status=400)
    if not crypto_price:
        return Response({"error": "요청에 화폐 가격이 포함되어야 합니다."}, status=400)
    if not trade_price:
        return Response({"error": "요청에 거래 가격이 포함되어야 합니다."}, status=400)
    if not trade_amount:
        return Response({"error": "요청에 거래 수량이 포함되어야 합니다."}, status=400)

    url = f"https://api.upbit.com/v1/orderbook?markets={market}"
    response = get(url)
    json_data = response.json()

    # 호가 데이터를 가져옴
    orderbook_units = json_data[0]["orderbook_units"]

    matched = False
    if isMarketValue:
        matched = True
    else:
        matched = check_price_match(trade_category, crypto_price, orderbook_units)

    # 체결이 된다면 True, 되지 않는다면 False
    is_signed = matched

    try:
        user = CustomUser.objects.get(email=email)
        crypto = Crypto.objects.get(name=crypto_name)

        trade_history = TradeHistory.objects.create(
            user=user,
            crypto=crypto,
            trade_category="BUY" if trade_category == "매수" else "SELL",
            trade_time=trade_time,
            crypto_market=crypto_market,
            crypto_price=float(crypto_price),
            trade_price=math.floor(float(trade_price)),
            trade_amount=Decimal(trade_amount),
            is_signed=is_signed,
        )

        # 가격이 매치될 경우 즉시 매수 및 매도 처리
        if is_signed:
            if trade_category == "매수":
                buy_total = Decimal(trade_price)

                response_data, status_code = buy_process(
                    user, crypto, trade_amount, buy_total
                )
                return Response(response_data, status=status_code)
            elif trade_category == "매도":
                sell_total = Decimal(trade_price)

                response_data, status_code = sell_process(
                    user, crypto, trade_amount, sell_total
                )
                return Response(response_data, status=status_code)
        # 일치하지 않을 경우 대기
        else:
            return Response({'trade': '거래 내역 추가 및 구매 대기'}, status=202)

    except CustomUser.DoesNotExist:
        return Response(
            {"error": "해당 이메일의 사용자가 존재하지 않습니다"}, status=500
        )
    except Crypto.DoesNotExist:
        return Response(
            {"error": "해당 화폐명을 가진 화폐가 존재하지 않습니다"}, status=500
        )
    except Exception as e:
        logger.error(f"거래내역 추가 실패: {e}")
        return Response({"error": "거래내역 추가 실패"}, status=500)


# 거래내역을 클라이언트로 전송
@api_view(["POST"])
def get_user_tradeHistory(request):
    try:
        email = request.data.get("email")
        user = CustomUser.objects.get(email=email)
    except CustomUser.DoesNotExist:
        return Response({"error": "요청에 이메일이 포함되어야 합니다"}, status=400)

    try:
        trade_historys = TradeHistory.objects.filter(user=user)

        data = [
            {
                "id": trade_history.id,
                "trade_category": trade_history.trade_category,
                "trade_time": trade_history.trade_time,
                "user": user.email,
                "crypto_name": trade_history.crypto.name,
                "crypto_market": trade_history.crypto_market,
                "crypto_price": trade_history.crypto_price,
                "trade_price": trade_history.trade_price,
                "trade_amount": trade_history.trade_amount,
                "is_signed": trade_history.is_signed,
            }
            for trade_history in trade_historys
        ]

        return Response(data, status=200)
    except Exception as e:
        logger.error(f"거래내역 받아오기 실패: {e}")
        return Response({"error:": "거래내역 받아오기 실패"}, status=500)


@api_view(["POST"])
def cancel_order(request):
    data = request.data
    ids = data.get("ids")
    email = data.get("email")

    if not email:
        return Response({"error": "요청에 이메일이 포함되어야 합니다"}, status=400)
    if not ids:
        return Response(
            {"error": "취소할 주문의 id가 요청에 포함되어야 합니다"}, status=400
        )

    try:
        user = CustomUser.objects.get(email=email)

        # ids 배열과 튜플의 id 필드 사이 일치하는 부분이 있으면 삭제
        trade_history = TradeHistory.objects.filter(user=user, id__in=ids).delete()

        return Response({"cancel_order": "주문 취소 성공"}, status=200)
    except CustomUser.DoesNotExist:
        return Response({"error": "해당 이메일의 사용자가 존재하지 않습니다"}, status=500)
    except Exception as e:
        logger.error(f"주문 취소 실패: {e}")
        return Response({"error": "주문 취소 실패"}, status=500)