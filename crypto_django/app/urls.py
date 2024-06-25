from django.urls import path
from django.contrib import admin

from .all_views import (
    cancel_order,
    GetAllCryptoView,
    get_user_tradeHistory,
    sell_crypto_unSigned,
    add_favoriteCrypto_to_user,
    get_user_favoriteCrypto,
    get_user_ownedCrypto,
    add_balance_to_user,
    minus_balance_from_user,
    get_user_balance,
    buy_crypto,
    buy_crypto_unSigned,
    sell_crypto,
    get_crypto_name,
    get_crypto_market,
)

from .views.auth_views import sign_up, LoginView, LogoutView, CheckLoginView
from .views.asking_views import asking_price, closed_price
from .views.trade_views import add_user_trade_history
from .views.candle_views import candle_per_minute, candle_per_date, candle_per_week, candle_per_month

urlpatterns = [
    path("sign_up/", sign_up),
    path("logIn/", LoginView.as_view()),
    path("logOut/", LogoutView.as_view()),
    path("check_login/", CheckLoginView.as_view()),
    path("asking_price/", asking_price),
    path("closed_price/", closed_price),
    path("add_user_tradeHistory/", add_user_trade_history),
    path("candle_per_minute/", candle_per_minute),
    path("candle_per_date/", candle_per_date),
    path("candle_per_week/", candle_per_week),
    path("candle_per_month/", candle_per_month),
    
    
    path("get_all_crypto/", GetAllCryptoView.as_view()),
    path("add_favoriteCrypto_to_user/", add_favoriteCrypto_to_user),
    path("get_user_favoriteCrypto/<str:email>/", get_user_favoriteCrypto),
    path("get_user_ownedCrypto/<str:email>/", get_user_ownedCrypto),
    path("add_balance_to_user/", add_balance_to_user),
    path("minus_balance_from_user/", minus_balance_from_user),
    path("get_user_balance/<str:email>/", get_user_balance),
    path("buy_crypto/", buy_crypto),
    path("buy_crypto_unSigned/", buy_crypto_unSigned),
    path("sell_crypto/", sell_crypto),
    path("sell_crypto_unSigned/", sell_crypto_unSigned),
    path("get_user_tradeHistory/<str:email>/", get_user_tradeHistory),
    path("get_crypto_name/", get_crypto_name),
    path("get_crypto_market/", get_crypto_market),
    path("cancel_order/", cancel_order),
    # path('admin/', admin.site.urls)
]
