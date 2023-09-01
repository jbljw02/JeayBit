from django.urls import path
from .views import get_data, handle_market

urlpatterns = [
    path('', get_data),
    path('handle_market/', handle_market),
]