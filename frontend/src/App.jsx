import React, { useMemo, useState } from "react";
import "./App.css";

const SYMBOLS = ["BTC/USDT", "ETH/USDT", "GOLD", "EUR/USD", "NASDAQ"];

export default function App() {
  const [symbol, setSymbol] = useState("BTC/USDT");
  const [direction, setDirection] = useState("BUY");

  const signal = useMemo(() => {
    const confidence = Math.floor(62 + Math.random() * 28);
    const risk = confidence > 78 ? "Medium" : "High";
    return { confidence, risk };
  }, [symbol, direction]);

  return (
    <div className="app">
      <header className="hero">
        <h1>Ancient Trade AI</h1>
        <p>AI trading simulator for learning market logic, risk and discipline.</p>
      </header>

      <main className="card">
        <h2>Market Simulator</h2>

        <label>Asset</label>
        <select value={symbol} onChange={(e) => setSymbol(e.target.value)}>
          {SYMBOLS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <label>Direction</label>
        <div className="buttons">
          <button
            className={direction === "BUY" ? "active buy" : ""}
            onClick={() => setDirection("BUY")}
          >
            BUY
          </button>
          <button
            className={direction === "SELL" ? "active sell" : ""}
            onClick={() => setDirection("SELL")}
          >
            SELL
          </button>
        </div>

        <div className="result">
          <h3>AI Analysis</h3>
          <p>
            Signal: <b>{direction}</b> on <b>{symbol}</b>
          </p>
          <p>Confidence: {signal.confidence}%</p>
          <p>Risk level: {signal.risk}</p>
        </div>

        <p className="warning">
          Educational simulator only. No real money trading, no deposits, no withdrawals.
        </p>
      </main>
    </div>
  );
}
