from django.urls import path
from django.contrib import admin
from .views import get_data, candle_per_date, candle_per_week, candle_per_month, candle_per_minute, asking_price, closed_price, sign_up, logIn, logOut, check_login
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('get_data/', get_data),
    path('candle_per_minute/', candle_per_minute),
    path('candle_per_date/', candle_per_date),
    path('candle_per_week/', candle_per_week),
    path('candle_per_month/', candle_per_month),
    path('asking_price/', asking_price),
    path('closed_price/', closed_price),
    path('sign_up/', sign_up),
    path('logIn/', csrf_exempt(logIn)), 
    path('logOut/', logOut),
    path('check_login/', check_login)
    # path('admin/', admin.site.urls)
]