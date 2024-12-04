from app.models import Crypto, CustomUser, UserCrypto
from rest_framework.decorators import api_view
from rest_framework.response import Response
from app.models import UserCrypto
import logging

logger = logging.getLogger(__name__)

# UserCrypto 테이블에 사용자에 따른 화폐 관심 여부 추가
@api_view(["POST"])
def add_favoriteCrypto_to_user(request):
    data = request.data

    email = data.get("email")
    crypto_name = data.get("crypto_name")

    if not email:
        return Response({"error": "요청에 이메일이 포함되어야 합니다"}, status=400)
    if not crypto_name:
        return Response({"error": "요청에 화폐명이 포함되어야 합니다"}, status=400)

    try:
        # 유저 테이블, 화폐 테이블과 연결하기 위한 외래키
        user = CustomUser.objects.get(email=email)
        crypto = Crypto.objects.get(name=crypto_name)

        # get_or_create는 두 개의 값(조회 혹은 생성된 객체/객체가 새로 생성되었는지 여부)을 반환
        user_crypto, created = UserCrypto.objects.get_or_create(
            user=user, crypto=crypto
        )

        # 해당 화폐에 대한 객체가 이미 생성되어 있다면 관심여부 True
        if created:
            user_crypto.is_favorited = True
        # 해당 화폐에 대한 객체가 생성되어 있지 않다면 관심여부를 반전
        else:
            user_crypto.is_favorited = not user_crypto.is_favorited

        user_crypto.save()

        # 유저의 관심 화폐 목록을 가져옴
        favorite_cryptos = UserCrypto.objects.filter(user=user, is_favorited=True)
        favorite_crypto_names = [uc.crypto.name for uc in favorite_cryptos]

        return Response({"favorite_crypto": favorite_crypto_names}, status=200)
    except CustomUser.DoesNotExist:
        return Response(
            {"error": "해당 이메일의 사용자가 존재하지 않습니다"}, status=400
        )
    except Crypto.DoesNotExist:
        return Response({"error": "해당 이름의 화폐가 존재하지 않습니다"}, status=400)
    except Exception as e:
        logger.error(f"관심 화폐 추가 실패: {e}")
        return Response({"error": "관심 화폐 추가 실패"}, status=500)


# 클라이언트에게 UserCrypto 테이블에 있는 사용자에 따른 화폐의 관심 여부를 전달
@api_view(["POST"])
def get_user_favoriteCrypto(request):
    try:
        email = request.data.get("email")

        # 매개변수로 받은 이메일과 일치하는 값을 테이블에서 찾음
        user = CustomUser.objects.get(email=email)
        # 이메일이 일치하고 관심여부가 True인 행을 찾음
        user_cryptos = UserCrypto.objects.filter(user=user, is_favorited=True)

        data = [
            {
                "crypto_name": user_crypto.crypto.name,
                "is_favorited": user_crypto.is_favorited,
            }
            for user_crypto in user_cryptos
        ]
        # safe=False => 딕셔너리가 아닌 다른 형태도 JSON으로 변환 가능
        return Response(data, status=200)
    except Exception as e:
        logger.error(f"관심 화폐 가져오기 실패: {e}")
        return Response({"error": "관심 화폐 가져오기 실패"}, status=500)
