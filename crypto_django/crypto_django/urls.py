from django.urls import path
from app.views import get_data

urlpatterns = [
    path('', get_data, name='get_data'),
]
