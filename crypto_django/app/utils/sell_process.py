from decimal import Decimal, ROUND_DOWN
from app.models import UserCrypto

def sell_process(user, crypto, crypto_quantity, sell_total):
    try:
        user_crypto = UserCrypto.objects.get(user=user, crypto=crypto)

        # 정밀도를 8자리로 통일
        SATOSHI = Decimal('0.00000001')  # 8자리 정밀도
        crypto_quantity = Decimal(str(crypto_quantity)).quantize(SATOSHI, rounding=ROUND_DOWN)
        user_crypto.owned_quantity = user_crypto.owned_quantity.quantize(SATOSHI, rounding=ROUND_DOWN)
        sell_total = Decimal(str(sell_total))

        # 사용자가 보유한 화폐의 수량보다 매도하려는 수량이 클 경우
        if user_crypto.owned_quantity < crypto_quantity:
            return {"error": "보유한 수량보다 매도수량이 큽니다"}, 400

        # 잔고량 업데이트
        user.balance += sell_total
        user.save()

        # 사용자의 화폐 보유량 업데이트
        user_crypto.owned_quantity -= crypto_quantity
        user_crypto.owned_quantity = user_crypto.owned_quantity.quantize(SATOSHI, rounding=ROUND_DOWN)

        # 사용자의 화폐 보유량이 0이 될 경우에는 보유량을 False로 변경
        if user_crypto.owned_quantity == 0:
            user_crypto.is_owned = False

        user_crypto.save()

        return {"sell_crypto": "화폐 매도 및 소유량 업데이트 완료"}, 200

    except UserCrypto.DoesNotExist:
        return {"error": "사용자가 해당 화폐를 보유하고 있지 않습니다"}, 400

    except Exception as e:
        return {"error": str(e)}, 500
