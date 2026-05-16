import React, { useMemo, useState } from "react";
import "./App.css";

const assets = [
  { symbol: "BTC/USDT", name: "Bitcoin", price: 68420, volatility: 0.035 },
  { symbol: "ETH/USDT", name: "Ethereum", price: 3450, volatility: 0.045 },
  { symbol: "GOLD", name: "Gold", price: 2365, volatility: 0.018 },
  { symbol: "EUR/USD", name: "Euro Dollar", price: 1.0874, volatility: 0.008 },
  { symbol: "NASDAQ", name: "Nasdaq Index", price: 18450, volatility: 0.022 },
];

const missions = [
  "Win 3 simulated trades",
  "Keep risk below 3%",
  "Reach $12,000 demo balance",
  "Make 5 disciplined entries",
];

function createCandles(asset, seed) {
  return Array.from({ length: 34 }, (_, i) => {
    const wave = Math.sin((i + seed) * 0.55) * asset.volatility;
    const noise = (Math.random() - 0.5) * asset.volatility;
    const open = asset.price * (1 + wave);
    const close = asset.price * (1 + wave + noise);
    return {
      id: i,
      green: close >= open,
      height: 28 + Math.abs(close - open) / asset.price * 1500,
      wick: 55 + Math.random() * 120,
    };
  });
}

export default function App() {
  const [asset, setAsset] = useState(assets[0]);
  const [direction, setDirection] = useState("BUY");
  const [risk, setRisk] = useState(2);
  const [balance, setBalance] = useState(10000);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [trades, setTrades] = useState([]);
  const [seed, setSeed] = useState(1);

  const candles = useMemo(() => createCandles(asset, seed), [asset, seed]);

  const ai = useMemo(() => {
    const confidence = Math.floor(58 + Math.random() * 34);
    const trend =
      confidence > 78
        ? direction === "BUY"
          ? "Strong bullish setup"
          : "Strong bearish setup"
        : "Unstable market, wait for confirmation";

    const entry =
      asset.symbol === "EUR/USD"
        ? (asset.price + Math.random() * 0.01).toFixed(4)
        : (asset.price + Math.random() * asset.price * 0.02).toFixed(2);

    const stop =
      asset.symbol === "EUR/USD"
        ? (entry - 0.006).toFixed(4)
        : (entry * 0.985).toFixed(2);

    const target =
      asset.symbol === "EUR/USD"
        ? (Number(entry) + 0.012).toFixed(4)
        : (entry * 1.03).toFixed(2);

    return { confidence, trend, entry, stop, target };
  }, [asset, direction, seed]);

  function executeTrade() {
    const chance = Math.min(0.85, ai.confidence / 100 - risk * 0.015);
    const win = Math.random() < chance;
    const amount = Math.round(balance * (risk / 100));
    const pnl = win ? Math.round(amount * (1.2 + Math.random())) : -amount;

    setBalance((b) => b + pnl);
    setXp((x) => {
      const next = x + (win ? 18 : 7);
      if (next >= level * 100) setLevel((l) => l + 1);
      return next;
    });

    setTrades((old) => [
      {
        id: Date.now(),
        asset: asset.symbol,
        direction,
        pnl,
        result: win ? "WIN" : "LOSS",
        confidence: ai.confidence,
      },
      ...old.slice(0, 7),
    ]);

    setSeed((s) => s + 1);
  }

  const wins = trades.filter((t) => t.pnl > 0).length;
  const losses = trades.filter((t) => t.pnl < 0).length;

  return (
    <div className="game">
      <aside className="sidebar">
        <div className="logo">
          <span>𓂀</span>
          <div>
            <h1>Ancient Trade AI</h1>
            <p>Trading discipline simulator</p>
          </div>
        </div>

        <div className="profile-card">
          <small>DEMO BALANCE</small>
          <strong>${balance.toLocaleString()}</strong>
          <div className="xp">
            <span>Level {level}</span>
            <div><i style={{ width: `${Math.min(100, xp % 100)}%` }} /></div>
          </div>
        </div>

        <div className="menu">
          <button className="selected">Simulator</button>
          <button>AI Coach</button>
          <button>Risk Lab</button>
          <button>Missions</button>
        </div>

        <div className="disclaimer">
          Educational simulator only. No real money, no deposits, no withdrawals.
        </div>
      </aside>

      <main className="dashboard">
        <header className="hero">
          <div>
            <p className="eyebrow">TRAINING MODE</p>
            <h2>Master entries, risk and patience.</h2>
            <span>Simulate trades, read AI logic, track discipline and improve decision making.</span>
          </div>
          <div className="stats">
            <div><b>{wins}</b><small>Wins</small></div>
            <div><b>{losses}</b><small>Losses</small></div>
            <div><b>{ai.confidence}%</b><small>AI score</small></div>
          </div>
        </header>

        <section className="terminal">
          <div className="terminal-head">
            <div>
              <h3>{asset.symbol}</h3>
              <p>{asset.name}</p>
            </div>
            <strong>{asset.symbol === "EUR/USD" ? ai.entry : `$${ai.entry}`}</strong>
          </div>

          <div className="chart">
            {candles.map((c) => (
              <div className="bar" key={c.id}>
                <span className="wick" style={{ height: c.wick }} />
                <span className={c.green ? "candle up" : "candle down"} style={{ height: c.height }} />
              </div>
            ))}
          </div>
        </section>

        <section className="grid">
          <div className="card trade-box">
            <h3>Trade Console</h3>

            <label>Market</label>
            <select value={asset.symbol} onChange={(e) => setAsset(assets.find((a) => a.symbol === e.target.value))}>
              {assets.map((a) => <option key={a.symbol}>{a.symbol}</option>)}
            </select>

            <label>Direction</label>
            <div className="split">
              <button onClick={() => setDirection("BUY")} className={direction === "BUY" ? "buy on" : "buy"}>BUY</button>
              <button onClick={() => setDirection("SELL")} className={direction === "SELL" ? "sell on" : "sell"}>SELL</button>
            </div>

            <label>Risk: {risk}%</label>
            <input type="range" min="1" max="8" value={risk} onChange={(e) => setRisk(Number(e.target.value))} />

            <button className="execute" onClick={executeTrade}>Execute Simulation</button>
          </div>

          <div className="card ai-card">
            <h3>AI Tactical Analysis</h3>
            <p><b>View:</b> {ai.trend}</p>
            <p><b>Entry:</b> {ai.entry}</p>
            <p><b>Stop:</b> {ai.stop}</p>
            <p><b>Target:</b> {ai.target}</p>
            <div className="score"><span style={{ width: `${ai.confidence}%` }} /></div>
          </div>

          <div className="card">
            <h3>Mission</h3>
            <p className="mission">{missions[level % missions.length]}</p>
            <p className="muted">Complete missions to unlock higher trader ranks.</p>
          </div>

          <div className="card journal">
            <h3>Trade Journal</h3>
            {trades.length === 0 ? <p className="muted">No trades yet.</p> : trades.map((t) => (
              <div className="trade" key={t.id}>
                <span>{t.direction} {t.asset}</span>
                <b className={t.pnl >= 0 ? "positive" : "negative"}>{t.pnl >= 0 ? "+" : ""}${t.pnl}</b>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
