# admin.py

from django.contrib import admin
from django.contrib.auth.models import User

class CustomUserAdmin(admin.ModelAdmin):
    pass  # 원하는 커스텀 설정을 여기에 추가하세요.

# 기존의 admin.site.register(User) 코드 대신 아래와 같이 작성하세요.
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)