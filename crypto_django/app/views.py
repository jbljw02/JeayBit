from django.http import JsonResponse
from .crpyto_api import price

def get_data(request):
    names, cur_price, unJoin_markets, change, change_rate, change_price, acc_trade_price_24h, acc_trade_volume_24h, opening_price, high_price, low_price = price()
    
    data = {
        'names': names,
        'cur_price' : cur_price,
        'markets' : unJoin_markets,
        'change' : change,
        'change_rate' : change_rate, 
        'change_price' : change_price,
        'trade_price' : acc_trade_price_24h,
        'trade_volume' : acc_trade_volume_24h,
        'opening_price' : opening_price,
        'high_price' : high_price,
        'low_price' : low_price
    }

    return JsonResponse(data)