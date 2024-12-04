from app.models import CustomUser
from rest_framework.decorators import api_view
from rest_framework.response import Response
import logging

logger = logging.getLogger(__name__)

# 사용자의 balance 컬럼에 입금량을 추가
@api_view(["POST"])
def add_balance_to_user(request):
    try:
        email = request.data.get("email")
        depositAmount = request.data.get("depositAmount")

        if email is None:
            logger.warning("입금 시도: 이메일 누락")
            return Response({"error": "이메일이 존재하지 않습니다"}, status=400)
        if depositAmount is None:
            logger.warning(f"입금 시도: 입금액 누락 (이메일: {email})")
            return Response({"error": "입금량이 누락되었습니다"}, status=400)

        try:
            user = CustomUser.objects.get(email=email)
            if user.balance is None:
                user.balance = depositAmount
            else:
                user.balance += depositAmount
            user.save()
            return Response({"add_balance_to_user": "입금량 추가 완료"}, status=200)
        except CustomUser.DoesNotExist:
            logger.error(f"입금 실패: 존재하지 않는 사용자 {email}")
            return Response({"error": "해당 이메일의 사용자가 존재하지 않습니다"}, status=400)
    except Exception as e:
        logger.error(f"입금 처리 중 오류 발생: {str(e)}")
        return Response({"error": "입금 처리 중 오류가 발생했습니다"}, status=500)


# 클라이언트로부터 받은 출금량만큼 잔고 줄이기
@api_view(["POST"])
def minus_balance_from_user(request):
    try:
        email = request.data.get("email")
        withdrawAmount = request.data.get("withdrawAmount")

        if email is None:
            logger.warning("출금 시도: 이메일 누락")
            return Response({"error": "이메일이 존재하지 않습니다"})
        if withdrawAmount is None:
            logger.warning(f"출금 시도: 출금액 누락 (이메일: {email})")
            return Response({"error": "출금량이 누락되었습니다"})

        try:
            user = CustomUser.objects.get(email=email)
            if user.balance - withdrawAmount < 0:
                logger.warning(f"출금 실패: 잔액 부족 (이메일: {email}, 요청액: {withdrawAmount}, 잔액: {user.balance})")
                return Response({"error": "출금량이 잔고보다 많습니다"})
            else:
                user.balance -= withdrawAmount
                user.save()
                return Response({"minus_balance_from_user": "잔고 업데이트 완료"})
        except CustomUser.DoesNotExist:
            logger.error(f"출금 실패: 존재하지 않는 사용자 {email}")
            return Response({"error": "해당 이메일의 사용자가 존재하지 않습니다"})
    except Exception as e:
        logger.error(f"출금 처리 중 오류 발생: {str(e)}")
        return Response({"error": "출금 처리 중 오류가 발생했습니다"}, status=500)


# 클라이언트에게 잔고량을 제공
@api_view(["POST"])
def get_user_balance(request):
    try:
        email = request.data.get("email")
        user = CustomUser.objects.get(email=email)
        data = {"user_balance": user.balance}
        return Response(data, status=200)
    except CustomUser.DoesNotExist:
        logger.error(f"잔액 조회 실패: 존재하지 않는 사용자 {email}")
        return Response({"error": "해당 사용자가 존재하지 않습니다"}, status=400)
    except Exception as e:
        logger.error(f"잔액 조회 중 오류 발생: {str(e)}")
        return Response({"error": "잔고량 불러오기 실패"}, status=500)
