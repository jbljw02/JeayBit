from requests import get
headers = {"accept" : "application/json"}

# months / weeks / days / minutes + 1,3,5,10,15,30,60,240..

url = "https://api.upbit.com/v1/market/all"
response = get(url, headers=headers)

markets = [market['market'] for market in eval(response.text) if market['market'].startswith('KRW-')]

print(markets)



