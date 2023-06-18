from requests import get

def price():
    headers = {"accept" : "application/json"}
    url = "https://api.upbit.com/v1/market/all?isDetails=true"
    response = get(url, headers=headers)

    markets = []
    names = []

    for crypto in eval(response.text):
        if crypto['market'].startswith('KRW') and crypto['market_warning'] == 'NONE':
            names.append(crypto['korean_name']) 
            markets.append(crypto['market'])  

    unJoin_markets = markets

    markets = "%2C%20".join(markets)
    url = f"https://api.upbit.com/v1/ticker?markets={markets}"
    response = get(url, headers=headers)

    data = eval(response.text)

    print(data)

    cur_price = []
    change = []
    change_rate = []
    change_price = []
    acc_trade_price_24h = []
    
    for i in range(len(data)):

        if data[i]['trade_price'] % 1 == 0:
            cur_price.append(format(int(data[i]['trade_price']), ","))
        else:
            cur_price.append(format(data[i]['trade_price'], ",.3f"))

        change.append(data[i]['change'])
        change_rate.append(round(float(data[i]['change_rate'])*100, 2))

        if data[i]['change_price'] % 1 == 0:
            change_price.append(format(int(data[i]['change_price']), ","))
        else:
            change_price.append(format(data[i]['change_price']))

        atp = int(data[i]['acc_trade_price_24h'])
        str_atp = str(atp)
        str_atp = str_atp[:5]
        atp = int(str_atp)
        atp = format(atp, ",")
        acc_trade_price_24h.append(atp)

    return names, cur_price, unJoin_markets, change, change_rate, change_price, acc_trade_price_24h

price()