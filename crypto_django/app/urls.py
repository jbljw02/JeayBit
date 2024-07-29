from django.urls import path
from django.contrib import admin

from .views.crypto_views import GetAllCryptoView, asking_price, closed_price
from .views.auth_views import sign_up, LoginView, LogoutView, CheckLoginView
from .views.trade_views import add_user_trade_history, cancel_order, get_user_tradeHistory
from .views.candle_views import candle_per_minute, candle_per_date, candle_per_week, candle_per_month
from .views.favorite_views import add_favoriteCrypto_to_user, get_user_favoriteCrypto
from .views.own_views import get_user_ownedCrypto
from .views.balance_views import add_balance_to_user, minus_balance_from_user, get_user_balance
from .views.home_views import home

urlpatterns = [
    path("sign_up/", sign_up),
    path("logIn/", LoginView.as_view()),
    path("logOut/", LogoutView.as_view()),
    path("check_login/", CheckLoginView.as_view()),
    path("asking_price/", asking_price),
    path("closed_price/", closed_price),
    path("add_user_tradeHistory/", add_user_trade_history),
    path("get_user_tradeHistory/", get_user_tradeHistory),
    path("cancel_order/", cancel_order),
    path("candle_per_minute/", candle_per_minute),
    path("candle_per_date/", candle_per_date),
    path("candle_per_week/", candle_per_week),
    path("candle_per_month/", candle_per_month),
    path("add_favoriteCrypto_to_user/", add_favoriteCrypto_to_user),
    path("get_user_favoriteCrypto/", get_user_favoriteCrypto),
    path("get_user_ownedCrypto/", get_user_ownedCrypto),
    path("add_balance_to_user/", add_balance_to_user),
    path("minus_balance_from_user/", minus_balance_from_user),
    path("get_user_balance/", get_user_balance),
    path("get_all_crypto/", GetAllCryptoView.as_view()),
    path('', home, name='home'),
    # path('admin/', admin.site.urls)
]
