from django.http import JsonResponse
from .price_per_stack import price

def get_data(request):
    names, cur_price, unJoin_markets = price()
    data = {
        'names': names,
        'cur_price' : cur_price,
        'markets' : unJoin_markets
    }
    return JsonResponse(data)

