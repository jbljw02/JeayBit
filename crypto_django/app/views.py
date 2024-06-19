import json
import math
import time
from django.http import JsonResponse
import requests
from app.models import Crypto, CustomUser, UserCrypto, TradeHistory
from .crpyto_api import (
    candle_per_date_BTC,
    candle_per_week_BTC,
    candle_per_month_BTC,
    closed_price_BTC,
    asking_price_BTC,
)
from rest_framework.decorators import api_view
from rest_framework.response import Response
from requests import get
from decimal import Decimal
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views import View
from .models import UserCrypto


# 1분 기준 차트
@api_view(["GET", "POST"])
def candle_per_minute(request):
    try:
        market = request.data["market"]
        minute = request.data["minute"]

        if minute == "1분":
            minute = 1
        elif minute == "5분":
            minute = 5
        elif minute == "10분":
            minute = 10
        elif minute == "30분":
            minute = 30
        elif minute == "1시간":
            minute = 60
        elif minute == "4시간":
            minute = 240

        if not market:
            return Response({"error ": "market 파라미터 X"}, status=400)

        url = f"https://api.upbit.com/v1/candles/minutes/{minute}?market={market}&count=100"

        response = get(url)
        data = response.json()

        return Response(data, status=200)

    except Exception as e:
        return Response({"error: ": "분/시간당 캔들 호출 실패"}, status=500)


# 1일 기준 차트
@api_view(["GET", "POST"])
def candle_per_date(request):
    try:
        market = request.data["market"]

        if not market:
            return Response({"error": "market 파라미터 X"}, status=500)

        url = f"https://api.upbit.com/v1/candles/days?market={market}&count=100"

        response = get(url)
        data = response.json()

        return Response(data, status=200)

    except Exception as e:
        return Response({"error: ": "1일당 캔들 호출 실패"}, status=500)


# 1주 기준 차트
@api_view(["GET", "POST"])
def candle_per_week(request):
    try:
        market = request.data["market"]

        if not market:
            return Response({"error": "market 파라미터 X"}, status=400)

        url = f"https://api.upbit.com/v1/candles/weeks?market={market}&count=100"

        response = get(url)
        data = response.json()

        return Response(data, status=200)

    except Exception as e:
        return Response({"error: ": "1주당 캔들 호출 실패"}, status=500)


# 1개월 기준 차트
@api_view(["GET", "POST"])
def candle_per_month(request):
    try:
        market = request.data["market"]

        if not market:
            return Response({"error": "market 파라미터 X"}, status=500)

        url = f"https://api.upbit.com/v1/candles/months?market={market}&count=100"

        response = get(url)
        data = response.json()

        return Response(data, status=200)

    except Exception as e:
        return Response({"error: ": "1주당 캔들 호출 실패"}, status=500)


# 호가내역
@api_view(["GET", "POST"])
def asking_price(request):
    print("호가내역 - 요청데이터 : ", request.data)

    try:
        market = request.data["market"]

        if not market:
            return Response({"error": "market 데이터를 받아올 수 없음"}, status=400)

        url = f"https://api.upbit.com/v1/orderbook?markets={market}"

        response = get(url)
        print(response)

        # 업비트 api로부터 데이터 수신 실패
        if response.status_code != 200:
            return Response({"error": "Failed to get data from Upbit"}, status=500)

        data = response.json()

        return Response(data)

    except Exception as e:
        print("error : ", e)


# 체결내역
@api_view(["GET", "POST"])
def closed_price(request):
    try:
        market = request.data["market"]

        if not market:
            return Response({"error": "market 데이터를 받아올 수 없음"}, status=400)

        url = f"https://api.upbit.com/v1/trades/ticks?market={market}&count=50"

        response = get(url)
        print(response)

        # 업비트 api로부터 데이터 수신 실패
        if response.status_code != 200:
            return Response({"error": "Failed to get data from Upbit"}, status=500)

        data = response.json()

        return Response(data)

    except Exception as e:
        print("error : ", e)


# 회원가입
@api_view(["POST"])
def sign_up(request):
    try:
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")

        if not username:
            return Response({"error": "이름을 설정하지 않음"}, status=400)

        if not password:
            return Response({"error": "비밀번호를 설정하지 않음"}, status=400)

        if not email:
            return Response({"error": "이메일을 설정하지 않음"}, status=400)

        if CustomUser.objects.filter(email=email).exists():
            return Response({"error": "이미 사용중인 이메일"}, status=400)

        user = CustomUser.objects.create_user(
            username=username, email=email, password=password
        )
        print("회원가입 : ", user)

    except Exception as e:
        print(e)  # 에러 출력
        return Response(
            {"error": str(e)}, status=500
        )  # 클라이언트에게 에러 메시지 반환

    # 사용자 생성 후 성공 메시지 반환
    return Response({"success": "회원가입 성공"}, status=201)


from django.middleware.csrf import get_token


def csrf_token(request):
    return JsonResponse({"csrfToken": get_token(request)})


class LoginView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            email = data.get("email")
            password = data.get("password")

            # CusomterUser.authenticate로 작성하지 않아도 지정해놓은 모델에 대해 인증을 수행
            user = authenticate(request, email=email, password=password)

            if user is not None:
                login(request, user)
                print("키:", request.session.session_key)
                print("로그인 상태 : ", request.user)
                print("이메일 : ", email)
                print("이름 : ", request.user.username)
                return JsonResponse(
                    {"username": request.user.username, "email": email}, status=200
                )
            else:
                return JsonResponse(
                    {"detail": "이메일 혹은 비밀번호가 잘못되었습니다."}, status=400
                )

        except Exception as e:
            print("에러 : ", e)
            return JsonResponse({"detail": f"서버 내부 에러: {str(e)}"}, status=500)


class LogoutView(View):
    def post(self, request):
        print("로그아웃 전 : ", request.session.session_key)
        try:
            logout(request)
            if request.session.session_key is None:
                return JsonResponse({"detail": "로그아웃 성공"}, status=200)
            else:
                request.session.flush()  # 세션 데이터 삭제
                return JsonResponse({"detail": "로그아웃 성공"}, status=200)
        except Exception as e:
            print("에러 : ", e)
            return JsonResponse({"detail": "로그아웃 실패"}, status=500)


# 로그인
@api_view(["POST"])
def logIn(request):
    try:
        data = request.data
        email = data.get("email")
        password = data.get("password")

        user = authenticate(
            request, email=email, password=password
        )  # CusomterUser.authenticate로 작성하지 않아도 지정해놓은 모델에 대해 인증을 수행

        if user is not None:
            login(request, user)
            print("키:", request.session.session_key)
            print("로그인 상태 : ", request.user)
            print("이메일 : ", email)
            print("이름 : ", request.user.username)
            return JsonResponse({"username": request.user.username, "email": email})
        else:
            return JsonResponse(
                {"detail": "이메일 혹은 비밀번호가 잘못되었습니다."}, status=400
            )

    except Exception as e:
        print("에러 : ", e)
        return JsonResponse({"detail": f"서버 내부 에러: {str(e)}"}, status=500)


# 로그아웃
@api_view(["POST"])
def logOut(request):
    print("로그아웃 전 : ", request.session.session_key)

    try:
        logout(request)
        if request.session.session_key is None:
            return JsonResponse({"detail": "로그아웃 성공"}, status=200)
        else:
            request.session.flush()  # 세션 데이터 삭제
            return JsonResponse({"detail": "로그아웃 성공"}, status=200)
    except Exception as e:
        print("에러 : ", e)
        return JsonResponse({"detail": "로그아웃 실패"}, status=500)


# UserCrypto 테이블에 사용자에 따른 화폐 관심 여부 추가
@api_view(["POST"])
def add_favoriteCrypto_to_user(request):
    data = json.loads(request.body)
    print("관심여부 - 받은 데이터 : ", data)

    email = data.get("email")
    crypto_name = data.get("crypto_name")

    if not email:
        return JsonResponse({"error": "요청에 이메일이 포함되어야 합니다"})
    if not crypto_name:
        return JsonResponse({"error": "요청에 화폐명이 포함되어야 합니다"})

    try:
        # 유저 테이블, 화폐 테이블과 연결하기 위한 외래키
        user = CustomUser.objects.get(email=email)
        crypto = Crypto.objects.get(name=crypto_name)

        # get_or_create는 두 개의 값(조회 혹은 생성된 객체/객체가 새로 생성되었는지 여부)을 반환
        user_crypto, created = UserCrypto.objects.get_or_create(
            user=user, crypto=crypto
        )

        print(user_crypto)
        print(created)

        # 해당 화폐에 대한 객체가 이미 생성되어 있다면 관심여부 True
        if created:
            user_crypto.is_favorited = True
        # 해당 화폐에 대한 객체가 생성되어 있지 않다면 관심여부를 반전
        else:
            user_crypto.is_favorited = not user_crypto.is_favorited

        user_crypto.save()

        return JsonResponse({"is_favorited": "화폐-유저 정보 저장 완료"})
    except CustomUser.DoesNotExist:
        return JsonResponse({"error": "해당 이메일의 사용자가 존재하지 않습니다"})


# 클라이언트에게 UserCrypto 테이블에 있는 사용자에 따른 화폐의 관심 여부를 전달
@api_view(["GET"])
def get_user_favoriteCrypto(request, email):

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
    # ==
    # data = []
    # for user_crypto in user_cryptos:
    #     data.append({
    #         "crypto_name": user_crypto.crypto.name,
    #         "is_favorited": user_crypto.is_favorited
    #     })

    # safe=False => 딕셔너리가 아닌 다른 형태도 JSON으로 변환 가능
    return JsonResponse(data, safe=False)


# 클라이언트에게 UserCrypto 테이블에 있는 사용자에 따른 화폐의 소유 여부를 전달
@api_view(["GET"])
def get_user_ownedCrypto(request, email):

    user = CustomUser.objects.get(email=email)
    user_cryptos = UserCrypto.objects.filter(user=user, is_owned=True)

    data = [
        {
            "crypto_name": user_crypto.crypto.name,
            "is_owned": user_crypto.is_owned,
            "quantity": float(user_crypto.owned_quantity),
        }
        for user_crypto in user_cryptos
    ]

    return JsonResponse(data, safe=False)


# 사용자의 balance 컬럼에 입금량을 추가
@api_view(["POST"])
def add_balance_to_user(request):
    email = request.data.get("email")
    depositAmount = request.data.get("depositAmount")
    print(request.data)

    if email is None:
        return JsonResponse({"error": "이메일이 존재하지 않습니다"})
    if depositAmount is None:
        return JsonResponse({"error": "입금량이 누락되었습니다"})

    try:
        user = CustomUser.objects.get(email=email)
        if user.balance is None:
            user.balance = depositAmount
        else:
            user.balance += depositAmount
        user.save()
        return JsonResponse({"detail": "잔고 업데이트 완료"})
    except CustomUser.DoesNotExist:
        return JsonResponse({"error": "해당 이메일의 사용자가 존재하지 않습니다"})


# 클라이언트로부터 받은 출금량만큼 잔고 줄이기
@api_view(["POST"])
def minus_balance_from_user(request):
    email = request.data.get("email")
    withdrawAmount = request.data.get("withdrawAmount")
    print(request.data)

    if email is None:
        return JsonResponse({"error": "이메일이 존재하지 않습니다"})
    if withdrawAmount is None:
        return JsonResponse({"error": "출금량이 누락되었습니다"})

    try:
        user = CustomUser.objects.get(email=email)
        if user.balance - withdrawAmount < 0:
            return JsonResponse({"error": "출금량이 잔고보다 많습니다"})
        else:
            user.balance -= withdrawAmount
            user.save()
            return JsonResponse({"detail": "잔고 업데이트 완료"})
    except CustomUser.DoesNotExist:
        return JsonResponse({"error": "해당 이메일의 사용자가 존재하지 않습니다"})


# 클라이언트에게 잔고량을 제공
@api_view(["GET"])
def get_user_balance(request, email):
    user = CustomUser.objects.get(email=email)
    data = {"user_balance": user.balance}

    return JsonResponse(data)


# 화폐 매수 및 소유 여부 추가
@api_view(["POST"])
def buy_crypto(request):
    data = json.loads(request.body)
    print("매수 - 받은 데이터: ", data)

    email = data.get("email")
    crypto_name = data.get("crypto_name")
    crypto_quantity = data.get("crypto_quantity")
    buy_total = data.get("buy_total")

    if not email:
        return Response({"error": "요청에 이메일이 포함되어야 합니다"}, status=400)
    if not crypto_name:
        return Response({"error": "요청에 화폐명이 포함되어야 합니다"}, status=400)
    if not crypto_quantity:
        return Response(
            {"error": "요청된 화폐 수량은 0이 아니어야 합니다"}, status=400
        )
    if not buy_total:
        return Response(
            {"error": "요청에 구매 금액이 포함되어야 합니다"}, status=400
        )

    try:
        user = CustomUser.objects.get(email=email)
        crypto = Crypto.objects.get(name=crypto_name)

        # 객체가 없어서 새로 생성해야 할 경우 초기 수량을 0, 소유 여부는 False로 지정함으로써 DoseNotExist 방지
        user_crypto, created = UserCrypto.objects.get_or_create(
            user=user,
            crypto=crypto,
            defaults={"owned_quantity": Decimal(0), "is_owned": False},
        )

        # 보다 정밀한 계산을 위해선 Decimal 타입이 권장됨 / 효율이 더 중요하다면 flaot
        crypto_quantity = Decimal(str(crypto_quantity))
        buy_total = Decimal(str(buy_total))

        # 잔고량보다 주문 총액이 큰 경우
        if user.balance < buy_total:
            return Response({"error": "잔액이 부족합니다"}, status=400)

        # 잔고량 업데이트
        user.balance -= buy_total
        user.save()

        user_crypto.owned_quantity += (
            crypto_quantity  # 기존 화폐 수량에 구매한 수량 추가
        )
        user_crypto.is_owned = True  # 소유 여부를 True로 전환

        user_crypto.save()

        return Response({"buy_crypto": "화폐 매수 및 소유 여부 업데이트 완료"})
    except CustomUser.DoesNotExist:
        return Response({"error": "해당 이메일의 사용자가 존재하지 않습니다"})


# 화폐 매수 및 소유 여부 추가(체결되지 않았던 화폐들에 대해)
@api_view(["POST"])
def buy_crypto_unSigned(request):
    data = json.loads(request.body)
    print("매수 - 받은 데이터: ", data)

    key = data.get("key")
    email = data.get("email")
    crypto_name = data.get("crypto_name")
    crypto_quantity = data.get("crypto_quantity")
    buy_total = data.get("buy_total")

    if not key:
        return JsonResponse(
            {"error": "요청에 고유 key가 포함되어야 합니다"}, status=400
        )
    if not email:
        return JsonResponse({"error": "요청에 이메일이 포함되어야 합니다"}, status=400)
    if not crypto_name:
        return JsonResponse({"error": "요청에 화폐명이 포함되어야 합니다"}, status=400)
    if not crypto_quantity:
        return JsonResponse(
            {"error": "요청된 화폐 수량은 0이 아니어야 합니다"}, status=400
        )
    if not buy_total:
        return JsonResponse(
            {"error": "요청에 구매 금액이 포함되어야 합니다"}, status=400
        )

    try:
        user = CustomUser.objects.get(email=email)
        crypto = Crypto.objects.get(name=crypto_name)
        trade_history = TradeHistory.objects.filter(user__email=email)

        # 잔고량보다 주문 총액이 큰 경우
        if user.balance < buy_total:
            return JsonResponse({"error": "잔액이 부족합니다"}, status=400)

        for b in trade_history:
            print("b.id : ", b.id)
            if key == str(b.id):
                print("a : ", key)
                print("일치함")
                b.is_signed = True
                b.save()

        # 객체가 없어서 새로 생성해야 할 경우 초기 수량을 0, 소유 여부는 False로 지정함으로써 DoseNotExist 방지
        user_crypto, created = UserCrypto.objects.get_or_create(
            user=user,
            crypto=crypto,
            defaults={"owned_quantity": Decimal(0), "is_owned": False},
        )

        # 보다 정밀한 계산을 위해선 Decimal 타입이 권장됨 / 효율이 더 중요하다면 flaot
        crypto_quantity = Decimal(str(crypto_quantity))
        buy_total = Decimal(str(buy_total))

        # 잔고량 업데이트
        user.balance -= buy_total
        user.save()

        user_crypto.owned_quantity += (
            crypto_quantity  # 기존 화폐 수량에 구매한 수량 추가
        )
        user_crypto.is_owned = True  # 소유 여부를 True로 전환

        user_crypto.save()

        return JsonResponse(
            {"buy_crypto_unSigned": "화폐 매수 및 소유 여부 업데이트 완료"}
        )
    except CustomUser.DoesNotExist:
        return JsonResponse({"error": "해당 이메일의 사용자가 존재하지 않습니다"})


# 화폐 매도 및 잔고 업데이트
@api_view(["POST"])
def sell_crypto(request):
    data = json.loads(request.body)
    print("매도 - 받은 데이터: ", data)

    email = data.get("email")
    crypto_name = data.get("crypto_name")
    crypto_quantity = data.get("crypto_quantity")
    sell_total = data.get("sell_total")

    if not email:
        return JsonResponse({"error": "요청에 이메일이 포함되어야 합니다"}, status=400)
    if not crypto_name:
        return JsonResponse({"error": "요청에 화폐명이 포함되어야 합니다"}, status=400)
    if not crypto_quantity:
        return JsonResponse(
            {"error": "요청된 화폐 수량은 0이 아니어야 합니다"}, status=400
        )
    if not sell_total:
        return JsonResponse(
            {"error": "요청에 구매 금액이 포함되어야 합니다"}, status=400
        )

    try:
        user = CustomUser.objects.get(email=email)
        crypto = Crypto.objects.get(name=crypto_name)

        user_crypto = UserCrypto.objects.get(user=user, crypto=crypto)

        crypto_quantity = Decimal(str(crypto_quantity))
        sell_total = Decimal(str(sell_total))

        # 사용자가 보유한 화폐의 수량보다 매도하려는 수량이 클 경우
        if user_crypto.owned_quantity < crypto_quantity:
            return JsonResponse(
                {"error": "보유한 수량보다 매도수량이 큽니다"}, status=400
            )

        # 잔고량 업데이트
        user.balance += sell_total
        user.save()

        user_crypto.owned_quantity -= Decimal(crypto_quantity)

        # 사용자의 화폐 보유량이 0이 될 경우에는 보유량을 False로 변경
        if user_crypto.owned_quantity == 0:
            user_crypto.is_owned = False

        user_crypto.save()

        return JsonResponse({"sell_crypto": "화폐 매도 및 소유랑 업데이트 완료"})
    except CustomUser.DoesNotExist:
        return JsonResponse({"error": "해당 이메일의 사용자가 존재하지 않습니다"})


@api_view(["POST"])
def sell_crypto_unSigned(request):
    data = json.loads(request.body)
    print("매도 - 받은 데이터: ", data)

    key = data.get("key")
    email = data.get("email")
    crypto_name = data.get("crypto_name")
    crypto_quantity = data.get("crypto_quantity")
    sell_total = data.get("sell_total")

    if not key:
        return JsonResponse(
            {"error": "요청에 고유 key가 포함되어야 합니다"}, status=400
        )
    if not email:
        return JsonResponse({"error": "요청에 이메일이 포함되어야 합니다"}, status=400)
    if not crypto_name:
        return JsonResponse({"error": "요청에 화폐명이 포함되어야 합니다"}, status=400)
    if not crypto_quantity:
        return JsonResponse(
            {"error": "요청된 화폐 수량은 0이 아니어야 합니다"}, status=400
        )
    if not sell_total:
        return JsonResponse(
            {"error": "요청에 매도 금액이 포함되어야 합니다"}, status=400
        )

    try:
        user = CustomUser.objects.get(email=email)
        crypto = Crypto.objects.get(name=crypto_name)
        user_crypto = UserCrypto.objects.get(user=user, crypto=crypto)
        trade_history = TradeHistory.objects.filter(user__email=email)

        # 사용자가 보유한 화폐의 수량보다 매도하려는 수량이 클 경우
        if user_crypto.owned_quantity < crypto_quantity:
            return JsonResponse(
                {"error": "보유한 수량보다 매도수량이 큽니다"}, status=400
            )

        for b in trade_history:
            print("b.id : ", b.id)
            if key == str(b.id):
                print("a : ", key)
                print("일치함")
                b.is_signed = True
                b.save()

        # 잔고량 업데이트
        user.balance += sell_total
        user.save()

        user_crypto.owned_quantity -= Decimal(crypto_quantity)

        # 사용자의 화폐 보유량이 0이 될 경우에는 보유량을 False로 변경
        if user_crypto.owned_quantity == 0:
            user_crypto.is_owned = False

        user_crypto.save()

        return JsonResponse(
            {"sell_crypto_unSigned": "화폐 매도 및 소유랑 업데이트 완료"}
        )
    except CustomUser.DoesNotExist:
        return JsonResponse({"error": "해당 이메일의 사용자가 존재하지 않습니다"})


# 사용자, 화폐별 거래내역을 추가
@api_view(["POST"])
def add_user_tradeHistory(request):
    data = request.data
 
    email = data.get("email")
    crypto_name = data.get("crypto_name")
    trade_category = data.get("trade_category")
    trade_time = data.get("trade_time")
    crypto_market = data.get("crypto_market")
    crypto_price = data.get("crypto_price")
    trade_price = data.get("trade_price")
    trade_amount = data.get("trade_amount")
    is_signed = data.get("is_signed")

    if not email:
        return Response({"error": "요청에 이메일이 포함되어야 합니다"}, status=400)
    if not crypto_name:
        return Response({"error": "요청에 화폐명이 포함되어야 합니다"}, status=400)
    if not trade_category:
        return Response(
            {"error": "요청에 거래가 '매수'인지 '매도'인지 포함되어야 합니다"}
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
            trade_price=math.floor(trade_price),
            trade_amount=Decimal(trade_amount),
            is_signed=True if is_signed == True else False,
        )

        return Response({"add_user_tradingHistory": "화폐 거래내역 업데이트 완료"})

    except CustomUser.DoesNotExist:
        return Response({"error": "해당 이메일의 사용자가 존재하지 않습니다"})
    except Crypto.DoesNotExist:
        return Response({"error": "해당 화폐명을 가진 화폐가 존재하지 않습니다"})


# 거래내역을 클라이언트로 전송
@api_view(["POST"])
def get_user_tradeHistory(request, email):
    try:
        user = CustomUser.objects.get(email=email)
    except CustomUser.DoesNotExist:
        return Response({"error": "요청에 이메일이 포함되어야 합니다"}, status=400)

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

    return Response({"trade_history": data})


# 모든 화폐명을 클라이언트로 전달
@api_view(["GET"])
def get_crypto_name(requst):

    crypto_names = Crypto.objects.values_list("name", flat=True)

    return Response({"detail": crypto_names})


# 모든 마켓명을 클라이언트로 전달
@api_view(["GET"])
def get_crypto_market():

    url = "https://api.upbit.com/v1/market/all?isDetails=true"

    headers = {"accept": "application/json"}

    response = requests.get(url, headers=headers)

    markets = []

    for crypto in json.loads(response.text):
        markets.append(crypto["market"])

    return Response({"markets": markets})


@api_view(["POST"])
def cancel_order(request):
    data = request.data
    ids = data.get("ids")
    email = data.get("email")

    if not email:
        return {"error": "요청에 이메일이 포함되어야 합니다"}
    if not ids:
        return Response(
            {"error": "취소할 주문의 id가 요청에 포함되어야 합니다"}, status=400
        )

    try:
        user = CustomUser.objects.get(email=email)

        # ids 배열과 튜플의 id 필드 사이 일치하는 부분이 있으면 삭제
        trade_history = TradeHistory.objects.filter(user=user, id__in=ids).delete()

        return Response({"success": "주문 취소 성공"})
    except CustomUser.DoesNotExist:
        Response({"error": "해당 이메일의 사용자가 존재하지 않습니다"})


def check_login(self, request):
    try:
        is_logged_in = request.user.is_authenticated
        return JsonResponse({"is_logged_in": is_logged_in})
    except Exception as e:
        print(f"로그인 체크 에러: {e}")
        return JsonResponse({"error": "로그인 체크 에러"}, status=500)


class CheckLoginView(View):
    def post(self, request):
        try:
            is_logged_in = request.user.is_authenticated
            if is_logged_in:
                return JsonResponse(
                    {
                        "is_logged_in": is_logged_in,
                        "name": request.user.username,
                        "email": request.user.email,
                    }
                )
        except Exception as e:
            return JsonResponse({"error": "로그인 체크 에러"}, status=500)


class GetAllCryptoView(View):
    def post(
        self,
        request,
    ):
        try:
            # 로그인 여부 확인
            is_logged_in = request.user.is_authenticated
            print("두번째: ", is_logged_in)

            headers = {"accept": "application/json"}
            url = "https://api.upbit.com/v1/market/all?isDetails=true"
            response = get(url, headers=headers)

            market_data = json.loads(response.text)
            market = []
            name = []

            for crypto in market_data:
                if (
                    crypto["market"].startswith("KRW")
                    and crypto["market_warning"] == "NONE"
                ):
                    name.append(crypto["korean_name"])
                    market.append(crypto["market"])

            unJoin_market = market
            market_str = "%2C%20".join(market)
            url = f"https://api.upbit.com/v1/ticker?markets={market_str}"
            response = get(url, headers=headers)
            data = json.loads(response.text)

            all_crypto = []

            for i in range(len(data)):
                crypto_obj = {
                    "name": name[i],
                    "market": unJoin_market[i],
                    "price": (
                        int(data[i]["trade_price"])
                        if data[i]["trade_price"] % 1 == 0
                        else data[i]["trade_price"]
                    ),
                    "change": data[i]["change"],
                    "change_rate": float(data[i]["change_rate"]),
                    "change_price": (
                        int(data[i]["change_price"])
                        if data[i]["change_price"] % 1 == 0
                        else data[i]["change_price"]
                    ),
                    "trade_price": data[i]["acc_trade_price_24h"],
                    "trade_volume": data[i]["acc_trade_volume_24h"],
                    "open_price": data[i]["opening_price"],
                    "high_price": data[i]["high_price"],
                    "low_price": data[i]["low_price"],
                }

                # 로그인된 경우 사용자 정보 추가
                if is_logged_in:
                    user_crypto_info = UserCrypto.objects.filter(
                        user=request.user,
                        crypto__name=name[i],  # Crypto 모델의 name 필드와 매칭
                    ).first()
                    if user_crypto_info:
                        crypto_obj["is_favorited"] = user_crypto_info.is_favorited
                        crypto_obj["is_owned"] = user_crypto_info.is_owned
                        crypto_obj["owned_quantity"] = user_crypto_info.owned_quantity
                    else:
                        crypto_obj["is_favorited"] = False
                        crypto_obj["is_owned"] = False
                        crypto_obj["owned_quantity"] = 0.00

                all_crypto.append(crypto_obj)
        except Exception as e:
            print(f"암호화폐 데이터 가져오기 에러: {e}")
            return JsonResponse({"error": "암호화폐 데이터 가져오기 에러"}, status=500)

        data = {
            "is_logged_in": is_logged_in,
            "all_crypto": all_crypto,
        }

        return JsonResponse(data)
