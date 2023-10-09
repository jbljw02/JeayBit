from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

# 기본 User 모델에 대한 관리자 인터페이스를 정의하고 있는 UserAdmin을 상속받아서 클래스 정의
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    # 관리자 사이트에서 보여줄 항목들을 지정(비밀번호는 해시화되어 저장되긴 하지만 해시화 된 값 자체도 예민한 값이기 때문에 지정X)
    list_display = ['email', 'username', ] 

admin.site.register(CustomUser, CustomUserAdmin)