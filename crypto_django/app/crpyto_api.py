from requests import get
from .models import Crypto

def price():
    headers = {"accept" : "application/json"}
    url = "https://api.upbit.com/v1/market/all?isDetails=true"
    response = get(url, headers=headers)

    market = []
    name = []

    for crypto in eval(response.text):
        if crypto['market'].startswith('KRW') and crypto['market_warning'] == 'NONE':
            name.append(crypto['korean_name']) 
            market.append(crypto['market'])  

    unJoin_market = market

    market = "%2C%20".join(market)
    url = f"https://api.upbit.com/v1/ticker?markets={market}"
    response = get(url, headers=headers)

    data = eval(response.text)

    cur_price = []  # 종가 및 현재가
    change = []  # 변화여부(상승/유지/하락) 
    change_rate = []  # 변화율
    change_price = []  # 변화가격
    acc_trade_price_24h = []  # 24시간 거래대금
    acc_trade_volume_24h = []  # 24시간 거래량
    open_price = []  # 시가
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
        open_price.append(data[i]['opening_price'])  # float
        high_price.append(data[i]['high_price'])  # 고가
        low_price.append(data[i]['low_price'])  # 저가

    return name, cur_price, unJoin_market, change, change_rate, change_price, acc_trade_price_24h, acc_trade_volume_24h, open_price, high_price, low_price

price()

def update_crypto():
    name, cur_price, _, _, _, _, _, _, _, _, _ = price()

    for i in range(len(name)):
        # 이미 존재하는 암호화폐인지 확인
        crypto = Crypto.objects.filter(name=name[i]).first()

        # 존재한다면 가격 업데이트, 없다면 새로 생성
        if crypto:
            crypto.price = cur_price[i]
            crypto.save()
        else:
            Crypto.objects.create(name=name[i], price=cur_price[i])
            
update_crypto()

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

def closed_price_BTC():
    headers = {"accept" : "application/json"}
    url = "https://api.upbit.com/v1/trades/ticks?market=KRW-BTC&count=50"
    response = get(url, headers=headers)
    
    closed_price_btc = response.json()

    return closed_price_btc 
    
def asking_price_BTC():
    headers = {"accept" : "application/json"}
    url = "https://api.upbit.com/v1/orderbook?markets=KRW-BTC"
    response = get(url, headers=headers)

    asking_price_btc = response.json()

    return asking_price_btc