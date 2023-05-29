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

    unJoin_Markets = markets

    markets = "%2C%20".join(markets)
    url = f"https://api.upbit.com/v1/ticker?markets={markets}"
    response = get(url, headers=headers)

    data = eval(response.text)

    print(names)
    print(unJoin_Markets)

    cur_price = []
    result = []
    
    for i in range(len(data)):
        if data[i]['trade_price'] % 1 == 0:
            trade_price = format(int(data[i]['trade_price']), ",")
            cur_price.append(trade_price)
        else:
            trade_price = format(data[i]['trade_price'], ",.3f")
            cur_price.append(trade_price)
        result.append(f"{names[i]}: {trade_price}")

    return names, cur_price, unJoin_Markets

price()