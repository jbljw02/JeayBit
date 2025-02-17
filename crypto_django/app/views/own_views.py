from app.models import UserCrypto
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from app.models import UserCrypto

import logging

logger = logging.getLogger(__name__)


@api_view(["GET"])
def get_owned_cryptos(request):
    try:
        user_cryptos = UserCrypto.objects.filter(
            user=request.user, is_owned=True
        ).select_related("crypto")

        owned_cryptos = [
            {
                "name": user_crypto.crypto.name,
                "market": user_crypto.crypto.market,
                "is_owned": True,
                "owned_quantity": float(user_crypto.owned_quantity),
            }
            for user_crypto in user_cryptos
        ]

        return Response(
            {"owned_cryptos": owned_cryptos, "total_count": len(owned_cryptos)},
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        logger.error(f"보유 암호화폐 조회 실패: {str(e)}")
        return Response(
            {"error": "보유 암호화폐 조회 중 오류 발생"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
