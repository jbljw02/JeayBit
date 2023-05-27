from django.http import JsonResponse
from .price_per_stack import price

def get_data(request):
    names, cur_price = price()
    data = {
        'names': names,
        'cur_price' : cur_price
    }
    return JsonResponse(data)

