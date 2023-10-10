from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

# 장고 기본 User 모델은 이름과 비밀번호로만 로그인이 가능하기 때문에 이메일, 패스워드로 로그인하기 위해 커스텀
class EmailLogin(ModelBackend):
    
    # authenticate을 오버라이딩하여 이메일로 로그인이 가능하게 함
    def authenticate(self, request, email=None, password=None):
        UserModel = get_user_model()
        try:
            user = UserModel.objects.get(email=email)
        except UserModel.DoesNotExist:
            return None

        if user.check_password(password):
            return user

    def get_user(self, user_id):
        UserModel = get_user_model()  # 프로젝트에 사용된 모델(CustomUser)을 가져옴
        try:
            return UserModel.objects.get(pk=user_id)  # 기본키를 이용하여 유저를 찾음
        except UserModel.DoesNotExist:
            return None