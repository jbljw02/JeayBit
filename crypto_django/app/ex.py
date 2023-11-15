import requests

url = "https://api.upbit.com/v1/market/all?isDetails=true"

headers = {"accept": "application/json"}

response = requests.get(url, headers=headers)

markets = []

for crypto in eval(response.text):
  markets.append(crypto['market'])

print(markets)