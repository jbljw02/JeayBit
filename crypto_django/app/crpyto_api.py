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

    cur_price = []
    change = []
    change_rate = []
    change_price = []
    acc_trade_price_24h = []
    
    for i in range(len(data)):

        if data[i]['trade_price'] % 1 == 0:
            cur_price.append(int(data[i]['trade_price']))    # int
        else:
            cur_price.append(data[i]['trade_price'])    # float

        change.append(data[i]['change'])    # str
        change_rate.append(float(data[i]['change_rate'])) # str -> float


        if data[i]['change_price'] % 1 == 0:
            change_price.append(int(data[i]['change_price']))    # int
        else:
            change_price.append(data[i]['change_price'])    # float

        acc_trade_price_24h.append(data[i]['acc_trade_price_24h'])  # float

    return names, cur_price, unJoin_markets, change, change_rate, change_price, acc_trade_price_24h

price()