from decimal import Decimal
from ..models import UserCrypto

def buy_process(user, crypto, crypto_quantity, buy_total):
    try:
        user_crypto, created = UserCrypto.objects.get_or_create(
            user=user,
            crypto=crypto,
            defaults={"owned_quantity": Decimal(0), "is_owned": False},
        )

        buy_total = Decimal(buy_total)

        # 잔고량보다 주문 총액이 큰 경우
        if user.balance < buy_total:
            return {"error": "잔액이 부족합니다"}, 400

        # 잔고량 업데이트
        user.balance -= buy_total
        user.save()

        user_crypto.owned_quantity += Decimal(crypto_quantity)
        user_crypto.is_owned = True
        user_crypto.save()

        return {"buy_crypto": "화폐 매수 및 소유 여부 업데이트 완료"}, 200
    
    except UserCrypto.DoesNotExist:
        return {"error": "사용자가 해당 화폐를 보유하고 있지 않습니다"}, 400

    except Exception as e:
        return {"error": str(e)}, 500