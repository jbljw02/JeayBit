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

    cur_price = []  # 종가 및 현재가
    change = []  # 변화여부(상승/유지/하락) 
    change_rate = []  # 변화율
    change_price = []  # 변화가격
    acc_trade_price_24h = []  # 24시간 거래대금
    acc_trade_volume_24h = []  # 24시간 거래량
    opening_price = []  # 시가
    high_price = []  # 고가
    low_price = []  # 종가
    
    for i in range(len(data)):

        if data[i]['trade_price'] % 1 == 0:
            cur_price.append(int(data[i]['trade_price']))  # int
        else:
            cur_price.append(data[i]['trade_price'])  # float

        change.append(data[i]['change'])    # str
        change_rate.append(float(data[i]['change_rate']))  # str -> float


        if data[i]['change_price'] % 1 == 0:
            change_price.append(int(data[i]['change_price']))  # int
        else:
            change_price.append(data[i]['change_price'])  # float

        acc_trade_price_24h.append(data[i]['acc_trade_price_24h'])  # float
        acc_trade_volume_24h.append(data[i]['acc_trade_volume_24h'])  # float
        opening_price.append(data[i]['opening_price'])  # float
        high_price.append(data[i]['high_price'])  # 고가
        low_price.append(data[i]['low_price'])  # 저가

    return names, cur_price, unJoin_markets, change, change_rate, change_price, acc_trade_price_24h, acc_trade_volume_24h, opening_price, high_price, low_price

price()

def candle_per_date_BTC():
    headers = {"accept" : "application/json"}
    url = "https://api.upbit.com/v1/candles/days?market=KRW-BTC&count=100"
    response = get(url, headers=headers)
    
    candle_btc_date = response.json()

    return candle_btc_date

def candle_per_week_BTC():
    headers = {"accept" : "application/json"}
    url = "https://api.upbit.com/v1/candles/weeks?market=KRW-BTC&count=100"
    response = get(url, headers=headers)
    
    candle_btc_date = response.json()

    return candle_btc_date

def candle_per_month_BTC():
    headers = {"accept" : "application/json"}
    url = "https://api.upbit.com/v1/candles/months?market=KRW-BTC&count=100"
    response = get(url, headers=headers)
    
    candle_btc_date = response.json()

    return candle_btc_date

candle_per_date_BTC()