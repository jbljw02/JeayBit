from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from app.models import Crypto, UserCrypto
import logging
from app.utils.camel_case_converter import convert_dict_to_camel_case
from crypto_app.authmiddleware import CsrfExemptSessionAuthentication
from django.http import JsonResponse

logger = logging.getLogger(__name__)


class FavoriteCryptoView(APIView):
    authentication_classes = (CsrfExemptSessionAuthentication,)

    # 관심 화폐 조회
    def get(self, request):
        try:
            user_cryptos = UserCrypto.objects.filter(
                user=request.user, is_favorited=True
            )

            favorite_cryptos = [
                {
                    "name": user_crypto.crypto.name,
                    "market": user_crypto.crypto.market,
                    "is_favorited": True,
                }
                for user_crypto in user_cryptos
            ]

            return Response(
                {"favorites": convert_dict_to_camel_case(favorite_cryptos)},
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            logger.error(f"관심 화폐 조회 실패: {str(e)}")
            return Response(
                {"error": "관심 화폐 조회 실패"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    # 관심 화폐 추가/제거 (토글)
    def post(self, request):
        try:
            crypto_name = request.data.get("crypto_name")
            if not crypto_name:
                return Response(
                    {"error": "화폐명 누락"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            try:
                crypto = Crypto.objects.get(name=crypto_name)
            except Crypto.DoesNotExist:
                return Response(
                    {"error": "존재하지 않는 화폐"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            # 관심 상태 토글
            user_crypto, created = UserCrypto.objects.get_or_create(
                user=request.user, crypto=crypto, defaults={"is_favorited": True}
            )

            if not created:
                user_crypto.is_favorited = not user_crypto.is_favorited
                user_crypto.save()

            # 업데이트된 관심 화폐 목록 반환
            favorite_cryptos = UserCrypto.objects.filter(
                user=request.user, is_favorited=True
            )

            return Response(
                {
                    "is_favorited": user_crypto.is_favorited,
                    "favorites": [
                        uc.crypto.name
                        for uc in convert_dict_to_camel_case(favorite_cryptos)
                    ],
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            logger.error(f"관심 화폐 상태 변경 실패: {str(e)}")
            return Response(
                {"error": "관심 화폐 상태 변경 실패"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
