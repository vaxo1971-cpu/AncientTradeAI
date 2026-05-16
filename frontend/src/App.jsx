import React, { useState } from "react";

export default function App() {
  const [balance, setBalance] = useState(1000);
  const [btcPrice, setBtcPrice] = useState(64250);
  const [message, setMessage] = useState("AI ожидает сигнал...");
  const [trades, setTrades] = useState([]);

  function randomPrice() {
    return Math.floor(Math.random() * 4000 - 2000);
  }

  function buyTrade() {
    const move = randomPrice();
    const newPrice = btcPrice + move;
    const profit = Math.floor(Math.random() * 120);

    setBtcPrice(newPrice);
    setBalance(balance + profit);

    setMessage(
      profit > 50
        ? "✅ AI успешно открыл BUY позицию"
        : "⚠️ Рынок нестабилен"
    );

    setTrades([
      {
        type: "BUY",
        result: "+" + profit + "$",
      },
      ...trades,
    ]);
  }

  function sellTrade() {
    const move = randomPrice();
    const newPrice = btcPrice - move;
    const loss = Math.floor(Math.random() * 90);

    setBtcPrice(newPrice);
    setBalance(balance - loss);

    setMessage(
      loss < 40
        ? "✅ SELL позиция закрыта"
        : "❌ Убыточная сделка"
    );

    setTrades([
      {
        type: "SELL",
        result: "-" + loss + "$",
      },
      ...trades,
    ]);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050816",
        color: "white",
        fontFamily: "Arial",
        padding: "30px",
      }}
    >
      <h1 style={{ textAlign: "center" }}>
        AncientTrade AI
      </h1>

      <div
        style={{
          background: "#111827",
          borderRadius: "20px",
          padding: "30px",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <h2>BTC / USDT</h2>

        <h3>💰 Balance: ${balance}</h3>

        <h3>₿ BTC Price: ${btcPrice}</h3>

        <div
          style={{
            height: "220px",
            background:
              "linear-gradient(180deg,#13203a,#0b1020)",
            borderRadius: "15px",
            marginTop: "20px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#4ade80",
            fontSize: "24px",
          }}
        >
          📈 LIVE MARKET
        </div>

        <p>{message}</p>

        <div
          style={{
            display: "flex",
            gap: "15px",
            marginTop: "20px",
          }}
        >
          <button
            onClick={buyTrade}
            style={{
              flex: 1,
              padding: "16px",
              background: "#16a34a",
              border: "none",
              borderRadius: "14px",
              color: "white",
              fontSize: "18px",
            }}
          >
            BUY
          </button>

          <button
            onClick={sellTrade}
            style={{
              flex: 1,
              padding: "16px",
              background: "#dc2626",
              border: "none",
              borderRadius: "14px",
              color: "white",
              fontSize: "18px",
            }}
          >
            SELL
          </button>
        </div>

        <div style={{ marginTop: "30px" }}>
          <h3>📜 Trade History</h3>

          {trades.map((trade, index) => (
            <div
              key={index}
              style={{
                background: "#1f2937",
                padding: "12px",
                borderRadius: "10px",
                marginTop: "10px",
              }}
            >
              {trade.type} → {trade.result}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
