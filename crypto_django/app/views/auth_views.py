from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from app.models import CustomUser
import logging
from app.utils.camel_case_converter import convert_dict_to_camel_case
from crypto_app.authmiddleware import CsrfExemptSessionAuthentication

logger = logging.getLogger(__name__)


# 회원가입
@api_view(["POST"])
def create_user(request):
    try:
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")

        # 필수 필드 검증
        if not all([username, email, password]):
            missing_fields = []
            if not username:
                missing_fields.append("이름")
            if not email:
                missing_fields.append("이메일")
            if not password:
                missing_fields.append("비밀번호")
            return Response(
                {"error": f"필수 필드 누락: {', '.join(missing_fields)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if CustomUser.objects.filter(email=email).exists():
            return Response(
                {"error": "이미 사용중인 이메일"}, status=status.HTTP_409_CONFLICT
            )

        user = CustomUser.objects.create_user(
            username=username, email=email, password=password
        )
        return Response({"message": "회원가입 성공"}, status=status.HTTP_201_CREATED)

    except Exception as e:
        logger.error(f"회원가입 실패: {str(e)}")
        return Response(
            {"error": "회원가입 처리 중 오류 발생"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


# 인증 세션 관리
class AuthView(APIView):
    authentication_classes = (CsrfExemptSessionAuthentication,)

    # 로그인
    def post(self, request):
        try:
            email = request.data.get("email")
            password = request.data.get("password")

            if not all([email, password]):
                missing_fields = []
                if not email:
                    missing_fields.append("이메일")
                if not password:
                    missing_fields.append("비밀번호")
                return Response(
                    {"error": f"필수 필드 누락: {', '.join(missing_fields)}"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user = authenticate(request, email=email, password=password)
            if user is not None:
                login(request, user)
                return Response(
                    {"name": user.username, "email": user.email},
                    status=status.HTTP_200_OK,
                )

            return Response(
                {"error": "잘못된 이메일 혹은 비밀번호"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        except Exception as e:
            logger.error(f"로그인 실패: {str(e)}")
            return Response(
                {"error": "로그인 처리 중 오류 발생"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    # 로그아웃
    def delete(self, request):
        try:
            if not request.user.is_authenticated:
                return Response(
                    {"message": "이미 로그아웃된 상태"}, status=status.HTTP_200_OK
                )

            logout(request)
            request.session.flush()
            return Response({"message": "로그아웃 성공"}, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"로그아웃 실패: {str(e)}")
            print(e)
            return Response(
                {"error": "로그아웃 처리 중 오류 발생"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    # 로그인 상태 확인
    def get(self, request):
        try:
            is_logged_in = request.user.is_authenticated
            data = {
                "is_logged_in": is_logged_in,
                "name": request.user.username if is_logged_in else "",
                "email": request.user.email if is_logged_in else "",
            }
            return Response(convert_dict_to_camel_case(data), status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"로그인 상태 확인 실패: {str(e)}")
            return Response(
                {"error": "로그인 상태 확인 중 오류 발생"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
