import React, { useMemo, useState } from "react";
import "./App.css";

const SYMBOLS = ["BTC/USDT", "ETH/USDT", "GOLD", "EUR/USD", "NASDAQ"];

export default function App() {
  const [symbol, setSymbol] = useState("BTC/USDT");
  const [direction, setDirection] = useState("BUY");

  const signal = useMemo(() => {
    const confidence = Math.floor(62 + Math.random() * 28);
    const risk = confidence > 78 ? "Medium" : "High";
    const price = (42000 + Math.random() * 8000).toFixed(2);
    return { confidence, risk, price };
  }, [symbol, direction]);

  return (
    <div className="app">
      <header className="hero">
        <div>
          <h1>Ancient Trade AI</h1>
          <p>AI trading simulator for learning market logic, risk and discipline.</p>
        </div>
        <span className="badge">Educational simulator</span>
      </header>

      <main className="grid">
        <section className="card">
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
        </section>

        <section className="card chart">
          <h2>{symbol}</h2>
          <div className="price">${signal.price}</div>
          <div className="fake-chart">
            <span></span><span></span><span></span><span></span><span></span>
            <span></span><span></span><span></span><span></span><span></span>
          </div>
        </section>

        <section className="card analysis">
          <h2>AI Analysis</h2>
          <p><b>Signal:</b> {direction} on {symbol}</p>
          <p><b>Confidence:</b> {signal.confidence}%</p>
          <p><b>Risk level:</b> {signal.risk}</p>
          <p className="warning">
            Educational simulator only. No real money trading, no deposits, no withdrawals.
          </p>
        </section>
      </main>
    </div>
  );
}
