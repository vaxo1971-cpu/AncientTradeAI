import random, time, math

def generate_candles(count=80, start_price=100.0):
    candles = []
    current_time = int(time.time()) - count * 60
    price = start_price

    for i in range(count):
        open_price = price
        volatility = random.uniform(0.8, 2.8)
        bias = math.sin(i / 9) * 0.35
        close = max(50, open_price + random.uniform(-1, 1) * volatility + bias)
        high = max(open_price, close) + random.random() * volatility
        low = min(open_price, close) - random.random() * volatility
        price = close

        candles.append({
            "time": current_time + i * 60,
            "open": round(open_price, 2),
            "high": round(high, 2),
            "low": round(low, 2),
            "close": round(close, 2),
        })

    return candles
