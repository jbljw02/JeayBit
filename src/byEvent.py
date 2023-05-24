from requests import get

headers = {"accept" : "application/json"}
url = "https://api.upbit.com/v1/market/all?isDetails=true"
response = get(url, headers=headers)

markets = []
names = []

for crypto in eval(response.text):
    if crypto['market'].startswith('KRW') and crypto['market_warning'] == 'NONE':
        names.append(crypto['korean_name']) 
        markets.append(crypto['market'])  

markets = "%2C%20".join(markets)
url = f"https://api.upbit.com/v1/ticker?markets={markets}"
response = get(url, headers=headers)

data = eval(response.text)

for i in range(len(data)):
    print(f"{names[i]}: {data[i]['trade_price']}")

    
