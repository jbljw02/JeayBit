from django.urls import path
from .views import get_data, candle_per_date, candle_per_week, candle_per_month, candle_per_minute

urlpatterns = [
    path('get_data/', get_data),
    path('candle_per_minute/', candle_per_minute),
    path('candle_per_date/', candle_per_date),
    path('candle_per_week/', candle_per_week),
    path('candle_per_month/', candle_per_month)
]