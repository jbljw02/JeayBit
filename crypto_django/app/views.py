from django.http import JsonResponse
from .price_per_stack import price

def get_data(request):
    names, cur_price, unJoin_markets, change, change_rate, change_price, acc_trade_price_24h = price()
    data = {
        'names': names,
        'cur_price' : cur_price,
        'markets' : unJoin_markets,
        'change' : change,
        'change_rate' : change_rate, 
        'change_price' : change_price,
        'trade_volume' : acc_trade_price_24h
    }
    return JsonResponse(data)

