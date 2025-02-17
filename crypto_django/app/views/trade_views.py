from app.utils.check_price_match import check_price_match
from app.utils.buy_process import buy_process
from app.utils.sell_process import sell_process
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from app.models import Crypto, TradeHistory, UserCrypto, CustomUser
from decimal import Decimal, ROUND_DOWN
import math
import logging
import requests
from crypto_app.authmiddleware import CsrfExemptSessionAuthentication

logger = logging.getLogger(__name__)


class TradeHistoryView(APIView):
    authentication_classes = (CsrfExemptSessionAuthentication,)

    # 거래 내역 조회
    def get(self, request):
        try:
            trade_histories = TradeHistory.objects.filter(
                user=request.user
            ).select_related("crypto")

            data = [
                {
                    "id": history.id,
                    "trade_category": history.trade_category,
                    "trade_time": history.trade_time,
                    "user": request.user.email,
                    "crypto_name": history.crypto.name,
                    "crypto_market": history.crypto_market,
                    "crypto_price": history.crypto_price,
                    "trade_price": history.trade_price,
                    "trade_amount": str(history.trade_amount),
                    "is_signed": history.is_signed,
                }
                for history in trade_histories
            ]

            return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"거래 내역 조회 실패: {str(e)}")
            return Response(
                {"error": "거래 내역 조회 중 오류 발생"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    # 거래 생성
    def post(self, request):
        try:
            if not request.user.is_authenticated:
                return Response(
                    {"error": "로그인이 필요"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            # 필수 필드 검증
            required_fields = [
                "crypto_name",
                "trade_category",
                "trade_time",
                "crypto_market",
                "crypto_price",
                "trade_price",
                "trade_amount",
                "market",
                "is_market_value",
            ]

            if not all(field in request.data for field in required_fields):
                return Response(
                    {"error": f"필수 필드가 누락"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # 가격 매칭 확인
            matched = request.data["is_market_value"] or check_price_match(
                request.data["trade_category"],
                request.data["crypto_price"],
                self._get_orderbook_units(request.data["market"]),
            )

            # 'ALL' 요청 처리
            trade_amount = request.data["trade_amount"]
            if trade_amount == "ALL" and request.data["trade_category"] == "매도":
                # DB에서 최신 보유 수량 조회
                crypto = Crypto.objects.get(name=request.data["crypto_name"])
                user_crypto = UserCrypto.objects.get(
                    user=request.user, 
                    crypto=crypto
                )
                trade_amount = user_crypto.owned_quantity

            # 거래 내역 생성
            crypto = Crypto.objects.get(name=request.data["crypto_name"])
            trade_history = TradeHistory.objects.create(
                user=request.user,
                crypto=crypto,
                trade_category=(
                    "BUY" if request.data["trade_category"] == "매수" else "SELL"
                ),
                trade_time=request.data["trade_time"],
                crypto_market=request.data["crypto_market"],
                crypto_price=float(request.data["crypto_price"]),
                trade_price=math.floor(float(request.data["trade_price"])),
                trade_amount=Decimal(str(trade_amount)),
                is_signed=matched,
            )
            
            # 거래 처리 및 응답 데이터 구성
            response_data = self._process_trade(
                trade_history, request.user, crypto, matched
            )

            return Response(
                response_data,
                status=status.HTTP_200_OK if matched else status.HTTP_202_ACCEPTED,
            )

        except Crypto.DoesNotExist:
            return Response(
                {"error": "존재하지 않는 화폐"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            logger.error(f"거래 생성 실패: {str(e)}")
            return Response(
                {"error": "거래 처리 중 오류가 발생"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    # 주문 취소
    def delete(self, request):
        try:
            ids = request.query_params.getlist("ids[]")
            if not ids:
                return Response(
                    {"error": "취소할 주문 ID 필요"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            result = TradeHistory.objects.filter(
                user=request.user,
                id__in=ids,
                is_signed=False,  # 미체결 주문만 취소 가능
            ).delete()

            if result[0] == 0:
                return Response(
                    {"error": "취소할 주문을 찾을 수 없음"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            return Response(
                {"message": "주문 취소 완료"},
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            logger.error(f"주문 취소 실패: {str(e)}")
            return Response(
                {"error": "주문 취소 중 오류 발생"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    # 호가 조회
    def _get_orderbook_units(self, market):
        response = requests.get(
            f"https://api.upbit.com/v1/orderbook?markets={market}",
            headers={"accept": "application/json"},
        )
        return response.json()[0]["orderbook_units"]

    # 거래 처리 및 응답 데이터 구성
    def _process_trade(self, trade_history, user, crypto, is_signed):
        response_data = {
            "is_signed": is_signed,
            "trade_history": {
                "id": trade_history.id,
                "trade_category": trade_history.trade_category,
                "trade_time": trade_history.trade_time,
                "crypto_market": trade_history.crypto_market,
                "crypto_price": trade_history.crypto_price,
                "trade_price": trade_history.trade_price,
                "trade_amount": trade_history.trade_amount,
                "is_signed": trade_history.is_signed,
            },
        }

        if is_signed:
            if trade_history.trade_category == "BUY":
                buy_process(
                    user,
                    crypto,
                    trade_history.trade_amount,
                    Decimal(trade_history.trade_price),
                )
            else:
                sell_process(
                    user,
                    crypto,
                    trade_history.trade_amount,
                    Decimal(trade_history.trade_price),
                )

            user_crypto = UserCrypto.objects.get(user=user, crypto=crypto)
            response_data.update(
                {
                    "owned_crypto": {
                        "name": crypto.name,
                        "is_owned": user_crypto.is_owned,
                        "owned_quantity": float(user_crypto.owned_quantity),
                    },
                    "balance": user.balance,
                }
            )

        return response_data