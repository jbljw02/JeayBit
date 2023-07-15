from requests import get
headers = {"accept" : "application/json"}

# months / weeks / days / minutes + 1,3,5,10,15,30,60,240..
url = "https://api.upbit.com/v1/candles/days?market=KRW-BTC&count=1"
response = get(url, headers=headers)

for result in eval(response.text):
    print(f"날짜 : {result['candle_date_time_kst']}")
    print(f"시가 : {result['opening_price']}")
    print(f"고가 : {result['high_price']}")
    print(f"저가 : {result['low_price']}")
    print(f"종가 : {result['trade_price']}")
    print(f"거래량 : {result['candle_acc_trade_volume']}")
    print(f"거래대금 : {result['candle_acc_trade_price']}")
    print() 