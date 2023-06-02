from django.http import JsonResponse
from .price_per_stack import price

def get_data(request):
    names, cur_price, unJoin_markets, change, change_rate, change_price = price()
    data = {
        'names': names,
        'cur_price' : cur_price,
        'markets' : unJoin_markets,
        'change' : change,
        'change_rate' : change_rate, 
        'change_price' : change_price
    }
    return JsonResponse(data)

