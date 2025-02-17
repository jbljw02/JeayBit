from django.urls import path
from django.contrib import admin

from .views.crypto_views import CryptoListView, get_orderbook, get_tradebook
from .views.auth_views import create_user, AuthView
from .views.trade_views import TradeHistoryView
from .views.candle_views import get_candle_data
from .views.favorite_views import FavoriteCryptoView
from .views.own_views import get_owned_cryptos
from .views.balance_views import UserBalanceView
from .views.home_views import home
from .views.kakao_views import KakaoLoginView

urlpatterns = [
    path("api/user/", create_user),
    path("api/auth/", AuthView.as_view()),
    path("api/user/balance/deposit/", UserBalanceView.as_view()),
    path("api/user/balance/withdraw/", UserBalanceView.as_view()),
    path("api/user/balance/", UserBalanceView.as_view()),
    path("api/candle/", get_candle_data),
    path("api/crypto/", CryptoListView.as_view()),
    path("api/tradebook/", get_tradebook),
    path("api/orderbook/", get_orderbook),
    path("api/user/favorite/", FavoriteCryptoView.as_view()),
    path("oauth/callback/kakao", KakaoLoginView.as_view()),
    path("api/user/crypto/owned/", get_owned_cryptos),
    path("api/user/trade/", TradeHistoryView.as_view()),
    path("", home, name="home"),
]
