import React, { useMemo, useState } from "react";
import "./App.css";

const ASSETS = [
  { symbol: "BTC/USDT", name: "Bitcoin", base: 68420 },
  { symbol: "ETH/USDT", name: "Ethereum", base: 3450 },
  { symbol: "GOLD", name: "Gold", base: 2360 },
  { symbol: "EUR/USD", name: "Euro / Dollar", base: 1.087 },
  { symbol: "NASDAQ", name: "Nasdaq Index", base: 18450 },
];

const lessons = [
  "Do not enter without a plan.",
  "Risk must be smaller than potential reward.",
  "Never trade revenge emotions.",
  "A good trader protects capital first.",
];

function makeCandles(base) {
  return Array.from({ length: 18 }, (_, i) => {
    const move = Math.sin(i * 0.8) * 0.035 + (Math.random() - 0.5) * 0.035;
    const close = base * (1 + move);
    const open = base * (1 + move - (Math.random() - 0.5) * 0.02);
    const high = Math.max(open, close) * (1 + Math.random() * 0.025);
    const low = Math.min(open, close) * (1 - Math.random() * 0.025);
    return { open, close, high, low, green: close >= open };
  });
}

export default function App() {
  const [asset, setAsset] = useState(ASSETS[0]);
  const [direction, setDirection] = useState("BUY");
  const [balance, setBalance] = useState(10000);
  const [history, setHistory] = useState([]);

  const candles = useMemo(() => makeCandles(asset.base), [asset]);

  const analysis = useMemo(() => {
    const confidence = Math.floor(61 + Math.random() * 30);
    const risk = confidence > 80 ? "Medium" : confidence > 70 ? "High" : "Very High";
    const trend = direction === "BUY" ? "bullish continuation" : "bearish correction";
    const price =
      asset.symbol === "EUR/USD"
        ? (asset.base + Math.random() * 0.02).toFixed(4)
        : (asset.base + Math.random() * asset.base * 0.04).toFixed(2);

    return { confidence, risk, trend, price };
  }, [asset, direction]);

  function simulateTrade() {
    const win = Math.random() < analysis.confidence / 100;
    const profit = win ? Math.floor(80 + Math.random() * 260) : -Math.floor(60 + Math.random() * 220);
    setBalance((b) => b + profit);
    setHistory((h) => [
      {
        id: Date.now(),
        symbol: asset.symbol,
        direction,
        result: profit,
        status: win ? "WIN" : "LOSS",
      },
      ...h.slice(0, 5),
    ]);
  }

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h1>Ancient Trade AI</h1>
          <p>Realistic AI trading simulator for discipline, risk and market thinking.</p>
        </div>
        <div className="pill">Educational only</div>
      </header>

      <main className="layout">
        <section className="panel controls">
          <h2>Market Control</h2>

          <label>Asset</label>
          <select
            value={asset.symbol}
            onChange={(e) => setAsset(ASSETS.find((a) => a.symbol === e.target.value))}
          >
            {ASSETS.map((a) => (
              <option key={a.symbol} value={a.symbol}>
                {a.symbol} — {a.name}
              </option>
            ))}
          </select>

          <label>Direction</label>
          <div className="trade-buttons">
            <button className={direction === "BUY" ? "buy active" : "buy"} onClick={() => setDirection("BUY")}>
              BUY
            </button>
            <button className={direction === "SELL" ? "sell active" : "sell"} onClick={() => setDirection("SELL")}>
              SELL
            </button>
          </div>

          <button className="execute" onClick={simulateTrade}>
            Simulate Trade
          </button>

          <div className="balance">
            <span>Demo Balance</span>
            <strong>${balance.toLocaleString()}</strong>
          </div>
        </section>

        <section className="panel chart-panel">
          <div className="chart-head">
            <div>
              <h2>{asset.symbol}</h2>
              <p>{asset.name}</p>
            </div>
            <strong>${analysis.price}</strong>
          </div>

          <div className="candles">
            {candles.map((c, i) => (
              <div className="candle-wrap" key={i}>
                <span
                  className="wick"
                  style={{ height: `${35 + Math.random() * 80}px` }}
                />
                <span
                  className={c.green ? "candle green" : "candle red"}
                  style={{ height: `${28 + Math.random() * 70}px` }}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="panel ai">
          <h2>AI Analysis</h2>
          <p><b>Signal:</b> {direction} {asset.symbol}</p>
          <p><b>Market view:</b> {analysis.trend}</p>
          <p><b>Confidence:</b> {analysis.confidence}%</p>
          <p><b>Risk:</b> {analysis.risk}</p>
          <div className="warning">
            No real money. No deposits. No withdrawals. Training simulator only.
          </div>
        </section>

        <section className="panel history">
          <h2>Trade Journal</h2>
          {history.length === 0 ? (
            <p>No simulated trades yet.</p>
          ) : (
            history.map((t) => (
              <div className="row" key={t.id}>
                <span>{t.direction} {t.symbol}</span>
                <b className={t.result >= 0 ? "profit" : "loss"}>
                  {t.result >= 0 ? "+" : ""}${t.result}
                </b>
              </div>
            ))
          )}
        </section>

        <section className="panel lesson">
          <h2>AI Coach</h2>
          <p>{lessons[Math.floor(Math.random() * lessons.length)]}</p>
        </section>
      </main>
    </div>
  );
}
