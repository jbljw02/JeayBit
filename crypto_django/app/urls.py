from django.urls import path
from django.contrib import admin

from .views.crypto_views import asking_price, closed_price, GetAllCryptoView
from .views.auth_views import sign_up, LoginView, LogoutView, CheckLoginView
from .views.trade_views import add_user_trade_history, cancel_order, get_user_tradeHistory
from .views.candle_views import candle_per_minute, candle_per_date, candle_per_week, candle_per_month
from .views.favorite_views import add_favoriteCrypto_to_user, get_user_favoriteCrypto
from .views.own_views import get_user_ownedCrypto
from .views.balance_views import add_balance_to_user, minus_balance_from_user, get_user_balance
from .views.home_views import home
from .views.kakao_views import KakaoLoginView

urlpatterns = [
    path("sign-up/", sign_up),
    path("login/", LoginView.as_view()),
    path("logout/", LogoutView.as_view()),
    path("check-login/", CheckLoginView.as_view()),
    path("asking-price/", asking_price),
    path("closed-price/", closed_price),
    path("add-user-trade-history/", add_user_trade_history),
    path("get-user-trade-history/", get_user_tradeHistory),
    path("cancel-order/", cancel_order),
    path("candle-per-minute/", candle_per_minute),
    path("candle-per-date/", candle_per_date),
    path("candle-per-week/", candle_per_week),
    path("candle-per-month/", candle_per_month),
    path("add-favorite-crypto-to-user/", add_favoriteCrypto_to_user),
    path("get-user-favorite-crypto/", get_user_favoriteCrypto),
    path("get-user-owned-crypto/", get_user_ownedCrypto),
    path("add-balance-to-user/", add_balance_to_user),
    path("minus-balance-from-user/", minus_balance_from_user),
    path("get-user-balance/", get_user_balance),
    path("get-all-crypto/", GetAllCryptoView.as_view()),
    path("oauth/callback/kakao", KakaoLoginView.as_view()),
    path('', home, name='home'),
]
