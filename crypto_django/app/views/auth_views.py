from django.views import View
from django.http import JsonResponse
import json
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from app.models import CustomUser
import logging

logger = logging.getLogger(__name__)

@api_view(["POST"])
def sign_up(request):
    try:
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")

        if not username and not password and not email:
            return Response({"error": "이름, 비밀번호, 이메일 모두 존재하지 않음"}, status=400)
        if not username:
            return Response({"error": "이름이 존재하지 않음"}, status=400)
        if not password:
            return Response({"error": "비밀번호가 존재하지 않음"}, status=400)
        if not email:
            return Response({"error": "이메일이 존재하지 않음"}, status=400)

        if CustomUser.objects.filter(email=email).exists():
            return Response({"error": "이미 사용중인 이메일"}, status=400)

        user = CustomUser.objects.create_user(
            username=username, email=email, password=password
        )
    except Exception as e:
        logger.error(f"회원가입 실패: {str(e)}")
        return Response({"error": "회원가입 실패"}, status=500)

    return Response({"sign_up": "회원가입 성공"}, status=201)


class LoginView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            email = data.get("email")
            password = data.get("password")
            
            if not email and not password:
                return JsonResponse({"error": "이메일, 비밀번호 모두 존재하지 않음"}, status=400)
            if not email:
                return JsonResponse({"error": "이메일이 존재하지 않음"}, status=400)
            if not password:
                return JsonResponse({"error": "비밀번호가 존재하지 않음"}, status=400)
            
            # CustomerUser.authenticate로 작성하지 않아도 지정해놓은 모델에 대해 인증을 수행
            user = authenticate(request, email=email, password=password)

            if user is not None:
                login(request, user)
                return JsonResponse(
                    {"name": request.user.username, "email": email}, status=200
                )
            else:
                return JsonResponse(
                    {"error": "잘못된 이메일 혹은 비밀번호"}, status=400
                )
        except Exception as e:
            logger.error(f"로그인 실패: {str(e)}")
            return JsonResponse({"error": "로그인 실패"}, status=500)


class LogoutView(View):
    def post(self, request):
        try:
            logout(request)
            if request.session.session_key is None:
                return JsonResponse({"logout": "이미 로그아웃 된 사용자"}, status=200)
            else:
                request.session.flush()  # 세션 데이터 삭제
                return JsonResponse({"logout": "로그아웃 성공"}, status=200)
        except Exception as e:
            logger.error(f"로그아웃 실패: {str(e)}")
            return JsonResponse({"error": "로그아웃 실패"}, status=500)


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
                    },
                    status=200,
                )
            if not is_logged_in:
                return JsonResponse(
                    {
                        "is_logged_in": is_logged_in,
                        "name": "",
                        "email": "",
                    },
                    status=200,
                )
        except Exception as e:
            logger.error(f"로그인 체크 에러: {str(e)}")
            return JsonResponse({"error": "로그인 체크 에러"}, status=500)
