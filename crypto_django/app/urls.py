from django.urls import path
from .views import get_data, candle_per_date

urlpatterns = [
    path('get_data/', get_data),
    path('candle_per_date/', candle_per_date)
]