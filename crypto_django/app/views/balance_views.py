from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
import logging
from crypto_app.authmiddleware import CsrfExemptSessionAuthentication

logger = logging.getLogger(__name__)


class UserBalanceView(APIView):
    authentication_classes = (CsrfExemptSessionAuthentication,)

    # 잔고 조회
    def get(self, request):
        try:
            if not request.user.is_authenticated:
                return Response(
                    {"error": "로그인이 필요"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            data = {"balance": request.user.balance}
            return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"잔액 조회 중 오류 발생: {str(e)}")
            return Response(
                {"error": "잔고 조회 중 오류 발생"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    # 입금
    def post(self, request):
        try:
            if not request.user.is_authenticated:
                return Response(
                    {"error": "로그인이 필요"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            deposit_amount = request.data.get("amount")
            if deposit_amount is None:
                return Response(
                    {"error": "입금액 누락"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user = request.user
            user.balance = user.balance or 0
            user.balance += deposit_amount
            user.save()

            return Response(
                {"balance": user.balance},
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            logger.error(f"입금 처리 중 오류 발생: {str(e)}")
            return Response(
                {"error": "입금 처리 중 오류 발생"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    # 출금
    def delete(self, request):
        try:
            if not request.user.is_authenticated:
                return Response(
                    {"error": "로그인이 필요"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            withdraw_amount = request.data.get("amount")
            if withdraw_amount is None:
                return Response(
                    {"error": "출금액 누락"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user = request.user
            if user.balance < withdraw_amount:
                return Response(
                    {"error": "잔액이 부족"}, status=status.HTTP_400_BAD_REQUEST
                )

            user.balance -= withdraw_amount
            user.save()

            return Response(
                {"balance": user.balance},
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            logger.error(f"출금 처리 중 오류 발생: {str(e)}")
            return Response(
                {"error": "출금 처리 중 오류 발생"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
