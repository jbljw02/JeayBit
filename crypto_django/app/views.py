from django.http import JsonResponse
from app.models import CustomUser
from .crpyto_api import price
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


# 1분 기준 차트
@api_view(["GET", "POST"])
def candle_per_minute(request):
    try:
        print("마켓 : ", request.data["market"])
        print("분 : ", request.data["minute"])
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
            return Response({"error": "market 데이터를 받아올 수 없음"}, status=400)

        url = f"https://api.upbit.com/v1/candles/minutes/{minute}?market={market}&count=100"

        response = get(url)
        print(response)

        # 업비트 api로부터 데이터 수신 실패
        if response.status_code != 200:
            return Response({"error": "Failed to get data from Upbit"}, status=500)

        data = response.json()

        return Response(data)

    except Exception as e:
        print("error : ", e)


# 1일 기준 차트
@api_view(["GET", "POST"])
def candle_per_date(request):
    try:
        market = request.data["market"]

        if not market:
            return Response({"error": "market 데이터를 받아올 수 없음"}, status=400)

        url = f"https://api.upbit.com/v1/candles/days?market={market}&count=100"

        response = get(url)
        print(response)

        # 업비트 api로부터 데이터 수신 실패
        if response.status_code != 200:
            return Response({"error": "Failed to get data from Upbit"}, status=500)

        data = response.json()

        return Response(data)

    except Exception as e:
        print("error : ", e)


# 1주 기준 차트
@api_view(["GET", "POST"])
def candle_per_week(request):
    try:
        market = request.data["market"]

        if not market:
            return Response({"error": "market 데이터를 받아올 수 없음"}, status=400)

        url = f"https://api.upbit.com/v1/candles/weeks?market={market}&count=100"

        response = get(url)
        print(response)

        # 업비트 api로부터 데이터 수신 실패
        if response.status_code != 200:
            return Response({"error": "Failed to get data from Upbit"}, status=500)

        data = response.json()

        return Response(data)

    except Exception as e:
        print("error : ", e)


# 1개월 기준 차트
@api_view(["GET", "POST"])
def candle_per_month(request):
    try:
        market = request.data["market"]

        if not market:
            return Response({"error": "market 데이터를 받아올 수 없음"}, status=400)

        url = f"https://api.upbit.com/v1/candles/months?market={market}&count=100"

        response = get(url)
        print(response)

        # 업비트 api로부터 데이터 수신 실패
        if response.status_code != 200:
            return Response({"error": "Failed to get data from Upbit"}, status=500)

        data = response.json()

        return Response(data)

    except Exception as e:
        print("error : ", e)


# 호가내역
@api_view(["GET", "POST"])
def asking_price(request):
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


from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout


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
        return Response({"error": str(e)}, status=500)  # 클라이언트에게 에러 메시지 반환

    # 사용자 생성 후 성공 메시지 반환
    return Response({"success": "회원가입 성공"}, status=201)


# 로그인
@api_view(["POST"])
def logIn(request):
    try:
        print(request.data)
        email = request.data.get("email")
        password = request.data.get("password")

        user = authenticate(
            request, email=email, password=password
        )  # CusomterUser.authenticate로 작성하지 않아도 지정해놓은 모델에 대해 인증을 수행

        if user is not None:
            login(request, user)
            print("키:", request.session.session_key)
            print("로그인 상태 : ", request.user)
            return Response({"detail": f"로그인 성공 : {request.user.username}"})
        else:
            return Response({"detail": "이메일 혹은 비밀번호가 잘못되었습니다."}, status=400)

    except Exception as e:
        print("에러 : ", e)
        return Response({"detail": f"서버 내부 에러: {str(e)}"}, status=500)

import pdb;

# 로그아웃
@api_view(["POST"])
def logOut(request):
    print("로그아웃 리퀘스트 : ", request.data)
    print("로그아웃 전 : ", request.session.session_key)

    try:
        # if request.session.session_key is not None:
        request.session.flush()  # 세션 데이터 삭제
        logout(request)
        return Response({"detail": "로그아웃 성공"})
        # else:
            # return Response({"detail": "세션 키가 존재하지 않습니다."}, status=400)
    except Exception as e:
        print("에러 : ", e)
        return Response({"detail": "로그아웃 실패"})



@api_view(["GET"])
def check_login(request):
    session_id = request.session.session_key
    print(session_id)
    return Response({"is_logged_in": request.user.is_authenticated})


def get_data(request):
    (
        name,
        cur_price,
        unJoin_market,
        change,
        change_rate,
        change_price,
        acc_trade_price_24h,
        acc_trade_volume_24h,
        open_price,
        high_price,
        low_price,
    ) = price()

    candle_btc_date = candle_per_date_BTC()
    closed_price_btc = closed_price_BTC()
    asking_price_btc = asking_price_BTC()

    data = {
        "name": name,
        "price": cur_price,
        "market": unJoin_market,
        "change": change,
        "change_rate": change_rate,
        "change_price": change_price,
        "trade_price": acc_trade_price_24h,
        "trade_volume": acc_trade_volume_24h,
        "open_price": open_price,
        "high_price": high_price,
        "low_price": low_price,
        "candle_btc_date": candle_btc_date,
        "closed_price_btc": closed_price_btc,
        "asking_price_btc": asking_price_btc,
    }

    return JsonResponse(data)
