import React, { useMemo, useState } from "react";
import "./App.css";

const assets = [
  { symbol: "BTC/USDT", name: "Bitcoin", price: 68420, volatility: 0.038 },
  { symbol: "ETH/USDT", name: "Ethereum", price: 3450, volatility: 0.045 },
  { symbol: "GOLD", name: "Gold", price: 2365, volatility: 0.018 },
  { symbol: "EUR/USD", name: "Euro Dollar", price: 1.0874, volatility: 0.008 },
  { symbol: "NASDAQ", name: "Nasdaq Index", price: 18450, volatility: 0.026 },
];

const missions = [
  "Win 3 simulated trades",
  "Keep risk below 3%",
  "Reach $12,000 demo balance",
  "Make 5 disciplined entries",
];

function generateMarket(asset, seed) {
  let price = asset.price * (1 + Math.sin(seed) * asset.volatility);

  return Array.from({ length: 52 }, (_, i) => {
    const trend = Math.sin((i + seed) * 0.28) * asset.volatility * 0.9;
    const impulse = Math.cos((i + seed) * 0.73) * asset.volatility * 0.45;
    const open = price;
    const close = price * (1 + trend * 0.12 + impulse * 0.14 + (Math.random() - 0.5) * asset.volatility * 0.28);
    const high = Math.max(open, close) * (1 + Math.random() * asset.volatility * 0.45);
    const low = Math.min(open, close) * (1 - Math.random() * asset.volatility * 0.45);
    const volume = 18 + Math.random() * 82;

    price = close;

    return {
      id: i,
      open,
      close,
      high,
      low,
      volume,
      green: close >= open,
    };
  });
}

function normalizeCandles(candles) {
  const highs = candles.map((c) => c.high);
  const lows = candles.map((c) => c.low);
  const max = Math.max(...highs);
  const min = Math.min(...lows);
  const range = max - min || 1;

  return candles.map((c) => {
    const top = ((max - c.high) / range) * 100;
    const bottom = ((c.low - min) / range) * 100;
    const bodyTop = ((max - Math.max(c.open, c.close)) / range) * 100;
    const bodyBottom = ((Math.min(c.open, c.close) - min) / range) * 100;

    return {
      ...c,
      top,
      bottom,
      bodyTop,
      bodyBottom,
      wickHeight: Math.max(18, 100 - top - bottom),
      bodyHeight: Math.max(9, 100 - bodyTop - bodyBottom),
      volumeHeight: Math.max(12, c.volume),
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
  const [seed, setSeed] = useState(4);

  const market = useMemo(() => normalizeCandles(generateMarket(asset, seed)), [asset, seed]);
  const last = market[market.length - 1];
  const previous = market[market.length - 2];
  const isUp = last.close >= previous.close;

  const ai = useMemo(() => {
    const confidence = Math.floor(59 + Math.random() * 35);
    const strength = confidence > 82 ? "Institutional setup" : confidence > 72 ? "Good confirmation" : "Wait for cleaner structure";

    const entry = asset.symbol === "EUR/USD" ? last.close.toFixed(4) : last.close.toFixed(2);
    const stopValue = direction === "BUY" ? last.close * 0.985 : last.close * 1.015;
    const targetValue = direction === "BUY" ? last.close * 1.032 : last.close * 0.968;

    return {
      confidence,
      strength,
      entry,
      stop: asset.symbol === "EUR/USD" ? stopValue.toFixed(4) : stopValue.toFixed(2),
      target: asset.symbol === "EUR/USD" ? targetValue.toFixed(4) : targetValue.toFixed(2),
    };
  }, [asset, direction, last.close]);

  function executeTrade() {
    const chance = Math.min(0.86, ai.confidence / 100 - risk * 0.012);
    const win = Math.random() < chance;
    const amount = Math.round(balance * (risk / 100));
    const pnl = win ? Math.round(amount * (1.25 + Math.random() * 0.9)) : -amount;

    setBalance((b) => b + pnl);

    setXp((x) => {
      const next = x + (win ? 20 : 8);
      if (next >= level * 100) setLevel((l) => l + 1);
      return next;
    });

    setTrades((old) => [
      {
        id: Date.now(),
        asset: asset.symbol,
        direction,
        pnl,
        confidence: ai.confidence,
      },
      ...old.slice(0, 7),
    ]);

    setSeed((s) => s + 1);
  }

  const wins = trades.filter((t) => t.pnl > 0).length;
  const losses = trades.filter((t) => t.pnl < 0).length;
  const displayPrice = asset.symbol === "EUR/USD" ? last.close.toFixed(4) : `$${last.close.toFixed(2)}`;
  const mission = missions[level % missions.length];

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
            <div>
              <i style={{ width: `${Math.min(100, xp % 100)}%` }} />
            </div>
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
            <div>
              <b>{wins}</b>
              <small>Wins</small>
            </div>
            <div>
              <b>{losses}</b>
              <small>Losses</small>
            </div>
            <div>
              <b>{ai.confidence}%</b>
              <small>AI score</small>
            </div>
          </div>
        </header>

        <section className="terminal">
          <div className="terminal-head">
            <div>
              <h3>{asset.symbol}</h3>
              <p>{asset.name} · simulated market depth</p>
            </div>

            <strong className={isUp ? "price-up" : "price-down"}>{displayPrice}</strong>
          </div>

          <div className="pro-chart">
            <div className="price-scale">
              <span>{asset.symbol === "EUR/USD" ? (last.high * 1.01).toFixed(4) : `$${(last.high * 1.01).toFixed(0)}`}</span>
              <span>{displayPrice}</span>
              <span>{asset.symbol === "EUR/USD" ? (last.low * 0.99).toFixed(4) : `$${(last.low * 0.99).toFixed(0)}`}</span>
            </div>

            <div className="price-line">
              <b>{displayPrice}</b>
            </div>

            <svg className="trend-line" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polyline points="0,70 18,58 36,62 52,42 68,48 83,28 100,34" />
            </svg>

            <div className="candlestick-layer">
              {market.map((c) => (
                <div className="candle-slot" key={c.id}>
                  <div
                    className="wick-pro"
                    style={{
                      top: `${c.top}%`,
                      height: `${c.wickHeight}%`,
                    }}
                  />
                  <div
                    className={c.green ? "body-pro bull" : "body-pro bear"}
                    style={{
                      top: `${c.bodyTop}%`,
                      height: `${c.bodyHeight}%`,
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="volume-layer">
              {market.map((c) => (
                <span
                  key={`v-${c.id}`}
                  className={c.green ? "volume bull-volume" : "volume bear-volume"}
                  style={{ height: `${c.volumeHeight}%` }}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="grid">
          <div className="card trade-box">
            <h3>Trade Console</h3>

            <label>Market</label>
            <select
              value={asset.symbol}
              onChange={(e) => {
                setAsset(assets.find((a) => a.symbol === e.target.value));
                setSeed((s) => s + 1);
              }}
            >
              {assets.map((a) => (
                <option key={a.symbol} value={a.symbol}>
                  {a.symbol}
                </option>
              ))}
            </select>

            <label>Direction</label>
            <div className="split">
              <button onClick={() => setDirection("BUY")} className={direction === "BUY" ? "buy on" : "buy"}>
                BUY
              </button>
              <button onClick={() => setDirection("SELL")} className={direction === "SELL" ? "sell on" : "sell"}>
                SELL
              </button>
            </div>

            <label>Risk: {risk}%</label>
            <input type="range" min="1" max="8" value={risk} onChange={(e) => setRisk(Number(e.target.value))} />

            <button className="execute" onClick={executeTrade}>
              Execute Simulation
            </button>
          </div>

          <div className="card ai-card">
            <h3>AI Tactical Analysis</h3>
            <p>
              <b>View:</b> {ai.strength}
            </p>
            <p>
              <b>Entry:</b> {ai.entry}
            </p>
            <p>
              <b>Stop:</b> {ai.stop}
            </p>
            <p>
              <b>Target:</b> {ai.target}
            </p>
            <div className="score">
              <span style={{ width: `${ai.confidence}%` }} />
            </div>
          </div>

          <div className="card">
            <h3>Mission</h3>
            <p className="mission">{mission}</p>
            <p className="muted">Complete missions to unlock higher trader ranks.</p>
          </div>

          <div className="card journal">
            <h3>Trade Journal</h3>
            {trades.length === 0 ? (
              <p className="muted">No trades yet.</p>
            ) : (
              trades.map((t) => (
                <div className="trade" key={t.id}>
                  <span>
                    {t.direction} {t.asset}
                  </span>
                  <b className={t.pnl >= 0 ? "positive" : "negative"}>
                    {t.pnl >= 0 ? "+" : ""}${t.pnl}
                  </b>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
