from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
import requests
from app.models import CustomUser
from django.contrib.auth import login
import logging

logger = logging.getLogger(__name__)

class KakaoLoginView(APIView):
    def get(self, request):
        try:
            code = request.GET.get("code")
            if not code:
                return Response({"error": "인증 코드가 필요"}, status=400)

            return self.process_kakao_login(request, code)
        except Exception as e:
            logger.error(f"카카오 로그인 에러(GET): {str(e)}")
            return Response({"error": str(e)}, status=400)

    def post(self, request):
        try:
            code = request.data.get("code")
            if not code:
                return Response({"error": "인증 코드가 필요"}, status=400)

            return self.process_kakao_login(request, code)
        except Exception as e:
            logger.error(f"카카오 로그인 에러(POST): {str(e)}")
            return Response({"error": str(e)}, status=400)

    def process_kakao_login(self, request, code):
        # 액세스 토큰 받기
        token_req = requests.post(
            "https://kauth.kakao.com/oauth/token",
            data={
                "grant_type": "authorization_code",
                "client_id": settings.KAKAO_CONFIG["KAKAO_REST_API_KEY"],
                "redirect_uri": settings.KAKAO_CONFIG["KAKAO_REDIRECT_URI"],
                "code": code,
                "client_secret": settings.KAKAO_CONFIG["KAKAO_CLIENT_SECRET"],
            },
        )

        token_json = token_req.json()
        access_token = token_json.get("access_token")

        # 사용자 정보 받기
        user_req = requests.get(
            "https://kapi.kakao.com/v2/user/me",
            headers={"Authorization": f"Bearer {access_token}"},
        )

        user_json = user_req.json()
        kakao_account = user_json.get("kakao_account")

        # 이메일이 없는 경우 처리
        if not kakao_account.get("email"):
            return Response({"error": "이메일 제공 동의가 필요"}, status=400)

        email = kakao_account.get("email")
        nickname = kakao_account.get("profile").get("nickname", "")

        # 기존 사용자 확인 또는 새로운 사용자 생성
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            user = CustomUser.objects.create_user(
                username=nickname,
                email=email,
                password=None,  # 소셜 로그인은 패스워드 불필요
            )

        # 로그인 처리
        login(request, user)

        return Response({"email": user.email, "name": user.username})
