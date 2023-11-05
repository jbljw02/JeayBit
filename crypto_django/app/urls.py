from django.urls import path
from django.contrib import admin
from .views import (
    get_data,
    candle_per_date,
    candle_per_week,
    candle_per_month,
    candle_per_minute,
    asking_price,
    closed_price,
    sign_up,
    logIn,
    logOut,
    check_login,
    add_favoriteCrypto_to_user,
    get_user_favoriteCrypto,
    add_balance_to_user,
    minus_balance_from_user,
    get_user_balance,
    LoginView,
    LogoutView,
    buy_crypto,
)

urlpatterns = [
    path("get_data/", get_data),
    path("candle_per_minute/", candle_per_minute),
    path("candle_per_date/", candle_per_date),
    path("candle_per_week/", candle_per_week),
    path("candle_per_month/", candle_per_month),
    path("asking_price/", asking_price),
    path("closed_price/", closed_price),
    path("sign_up/", sign_up),
    path("logIn/", LoginView.as_view()),
    path("logOut/", LogoutView.as_view()),
    path("check_login/", check_login),
    path("add_favoriteCrypto_to_user/", add_favoriteCrypto_to_user),
    path("get_user_favoriteCrypto/<str:email>/", get_user_favoriteCrypto),
    path("add_balance_to_user/", add_balance_to_user),
    path("minus_balance_from_user/", minus_balance_from_user),
    path("get_user_balance/<str:email>/", get_user_balance),
    path("buy_crypto/", buy_crypto),
    # path('admin/', admin.site.urls)
]
