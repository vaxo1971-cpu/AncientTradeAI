def analyze_trade(side: str, entry: float, exit_price: float) -> str:
    side = side.upper()
    pnl = exit_price - entry if side == "BUY" else entry - exit_price

    result = "прибыльная" if pnl >= 0 else "убыточная"
    reason = (
        "вход был по направлению импульса и цена дала подтверждение"
        if pnl >= 0
        else "вход был сделан без достаточного подтверждения или против краткосрочного импульса"
    )

    return (
        f"Сделка {result}. PnL: {pnl:.2f}. "
        f"Вероятная причина: {reason}. "
        "Проверьте структуру рынка, ближайшую ликвидность, размер стопа и соотношение risk/reward."
    )
