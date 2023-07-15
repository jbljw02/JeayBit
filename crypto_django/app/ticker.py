import requests

url = "https://api.upbit.com/v1/ticker?markets=KRW-BTC"

headers = {"accept": "application/json"}

response = requests.get(url, headers=headers)
res = eval(response.text)

for result in res:
    print(f"24시간 누적 거래대금 : {result['acc_trade_price_24h']}")
    print(f"24시간 누적 거래량 : {result['acc_trade_volume_24h']} BTC")
    print(f"시가 : {result['opening_price']}")
    print(f"종가 : {result['trade_price']}")
    print(f"고가 : {result['high_price']}")
    print(f"저가 : {result['low_price']}")
