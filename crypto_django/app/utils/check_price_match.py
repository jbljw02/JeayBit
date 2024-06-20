def check_price_match(trade_category, crypto_price, orderbook_units):
    if trade_category == "매수":
        return any(unit["ask_price"] == float(crypto_price) for unit in orderbook_units)
    elif trade_category == "매도":
        return any(unit["bid_price"] == float(crypto_price) for unit in orderbook_units)
    return False