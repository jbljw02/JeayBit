from app.models import CustomUser, UserCrypto
from rest_framework.decorators import api_view
from rest_framework.response import Response
from app.models import UserCrypto
from django.core.exceptions import ObjectDoesNotExist


# 클라이언트에게 UserCrypto 테이블에 있는 사용자에 따른 화폐의 소유 여부를 전달
@api_view(["POST"])
def get_user_ownedCrypto(request):
    try:
        email = request.data.get("email")
        
        if not email:
            return Response({"error": "이메일이 존재하지 않음"}, status=400)

        try:
            user = CustomUser.objects.get(email=email)
        except ObjectDoesNotExist:
            return Response({"error": "사용자를 찾을 수 없음"}, status=404)

        user_cryptos = UserCrypto.objects.filter(user=user, is_owned=True)

        data = [
            {
                "name": user_crypto.crypto.name,
                "is_owned": user_crypto.is_owned,
                "owned_quantity": float(user_crypto.owned_quantity),
            }
            for user_crypto in user_cryptos
        ]

        return Response(data, status=200)
    except Exception as e:
        return Response({"error": "소유 화폐 가져오기 실패"}, status=500)