from django.http import JsonResponse
from .price_per_stack import price

def get_data(request):
    data = {
        'price': price()
    }
    return JsonResponse(data)
