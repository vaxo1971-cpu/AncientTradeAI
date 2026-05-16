import React, { useMemo, useState } from "react";
import "./App.css";

const assets = [
  { symbol: "BTC/USDT", name: "Bitcoin", price: 68420, volatility: 0.038 },
  { symbol: "ETH/USDT", name: "Ethereum", price: 3450, volatility: 0.045 },
  { symbol: "GOLD", name: "Gold", price: 2365, volatility: 0.018 },
  { symbol: "EUR/USD", name: "Euro / Dollar", price: 1.0874, volatility: 0.008 },
  { symbol: "NASDAQ", name: "Nasdaq Index", price: 18450, volatility: 0.026 },
];

const text = {
  ru: {
    title: "Ancient Trade AI",
    subtitle: "AI-симулятор трейдинга",
    mode: "УЧЕБНЫЙ РЕЖИМ",
    hero: "Тренируй входы, риск и дисциплину.",
    heroText: "Симулируй сделки, изучай логику AI, контролируй риск и развивай мышление трейдера.",
    balance: "ДЕМО БАЛАНС",
    simulator: "Симулятор",
    coach: "AI Тренер",
    riskLab: "Риск",
    missions: "Миссии",
    disclaimer: "Только учебный симулятор. Без реальных денег, депозитов и вывода средств.",
    wins: "Победы",
    losses: "Ошибки",
    aiScore: "AI оценка",
    tradeConsole: "Панель сделки",
    market: "Актив",
    direction: "Направление",
    risk: "Риск",
    execute: "Симулировать сделку",
    analysis: "AI анализ",
    view: "Сценарий",
    entry: "Вход",
    stop: "Стоп",
    target: "Цель",
    mission: "Миссия",
    missionText: "Выполняй миссии и открывай новые уровни трейдера.",
    journal: "Журнал сделок",
    noTrades: "Сделок пока нет.",
    marketDepth: "симуляция рыночной глубины",
    institutional: "Сильный рыночный сетап",
    good: "Есть подтверждение",
    wait: "Лучше ждать чистую структуру",
    missionList: [
      "Сделай 3 прибыльные учебные сделки",
      "Держи риск ниже 3%",
      "Достигни демо-баланса $55,000",
      "Сделай 5 дисциплинированных входов",
    ],
  },
  en: {
    title: "Ancient Trade AI",
    subtitle: "AI trading simulator",
    mode: "TRAINING MODE",
    hero: "Master entries, risk and discipline.",
    heroText: "Simulate trades, read AI logic, control risk and build trader thinking.",
    balance: "DEMO BALANCE",
    simulator: "Simulator",
    coach: "AI Coach",
    riskLab: "Risk Lab",
    missions: "Missions",
    disclaimer: "Educational simulator only. No real money, no deposits, no withdrawals.",
    wins: "Wins",
    losses: "Losses",
    aiScore: "AI score",
    tradeConsole: "Trade Console",
    market: "Market",
    direction: "Direction",
    risk: "Risk",
    execute: "Execute Simulation",
    analysis: "AI Analysis",
    view: "View",
    entry: "Entry",
    stop: "Stop",
    target: "Target",
    mission: "Mission",
    missionText: "Complete missions to unlock higher trader ranks.",
    journal: "Trade Journal",
    noTrades: "No trades yet.",
    marketDepth: "simulated market depth",
    institutional: "Institutional market setup",
    good: "Good confirmation",
    wait: "Wait for cleaner structure",
    missionList: [
      "Win 3 simulated trades",
      "Keep risk below 3%",
      "Reach $55,000 demo balance",
      "Make 5 disciplined entries",
    ],
  },
  ka: {
    title: "Ancient Trade AI",
    subtitle: "AI სავაჭრო სიმულატორი",
    mode: "სასწავლო რეჟიმი",
    hero: "ივარჯიშე შესვლებზე, რისკსა და დისციპლინაზე.",
    heroText: "გააკეთე სიმულაციური გარიგებები, წაიკითხე AI ანალიზი და ისწავლე რისკის კონტროლი.",
    balance: "დემო ბალანსი",
    simulator: "სიმულატორი",
    coach: "AI მწვრთნელი",
    riskLab: "რისკი",
    missions: "მისიები",
    disclaimer: "მხოლოდ სასწავლო სიმულატორია. რეალური ფული, დეპოზიტი და გატანა არ არსებობს.",
    wins: "მოგება",
    losses: "წაგება",
    aiScore: "AI შეფასება",
    tradeConsole: "გარიგების პანელი",
    market: "აქტივი",
    direction: "მიმართულება",
    risk: "რისკი",
    execute: "სიმულაციური გარიგება",
    analysis: "AI ანალიზი",
    view: "ხედვა",
    entry: "შესვლა",
    stop: "სტოპი",
    target: "სამიზნე",
    mission: "მისია",
    missionText: "შეასრულე მისიები და გახსენი ახალი დონეები.",
    journal: "გარიგებების ჟურნალი",
    noTrades: "გარიგებები ჯერ არ არის.",
    marketDepth: "ბაზრის სიღრმის სიმულაცია",
    institutional: "ძლიერი საბაზრო სეტაპი",
    good: "კარგი დადასტურება",
    wait: "უმჯობესია სუფთა სტრუქტურას დაველოდოთ",
    missionList: [
      "მოიგე 3 სასწავლო გარიგება",
      "რისკი შეინარჩუნე 3%-ზე დაბლა",
      "მიაღწიე $55,000 დემო ბალანსს",
      "გააკეთე 5 დისციპლინირებული შესვლა",
    ],
  },
};

function generateMarket(asset, seed) {
  let price = asset.price * (1 + Math.sin(seed) * asset.volatility);

  return Array.from({ length: 52 }, (_, i) => {
    const trend = Math.sin((i + seed) * 0.28) * asset.volatility * 0.9;
    const impulse = Math.cos((i + seed) * 0.73) * asset.volatility * 0.45;
    const open = price;
    const close =
      price *
      (1 +
        trend * 0.12 +
        impulse * 0.14 +
        (Math.random() - 0.5) * asset.volatility * 0.28);

    const high = Math.max(open, close) * (1 + Math.random() * asset.volatility * 0.45);
    const low = Math.min(open, close) * (1 - Math.random() * asset.volatility * 0.45);
    const volume = 18 + Math.random() * 82;

    price = close;

    return { id: i, open, close, high, low, volume, green: close >= open };
  });
}

function normalizeCandles(candles) {
  const max = Math.max(...candles.map((c) => c.high));
  const min = Math.min(...candles.map((c) => c.low));
  const range = max - min || 1;

  return candles.map((c) => {
    const top = ((max - c.high) / range) * 100;
    const bottom = ((c.low - min) / range) * 100;
    const bodyTop = ((max - Math.max(c.open, c.close)) / range) * 100;
    const bodyBottom = ((Math.min(c.open, c.close) - min) / range) * 100;

    return {
      ...c,
      top,
      bodyTop,
      wickHeight: Math.max(18, 100 - top - bottom),
      bodyHeight: Math.max(10, 100 - bodyTop - bodyBottom),
      volumeHeight: Math.max(12, c.volume),
    };
  });
}

export default function App() {
  const [lang, setLang] = useState("ru");
  const [asset, setAsset] = useState(assets[0]);
  const [direction, setDirection] = useState("BUY");
  const [risk, setRisk] = useState(2);
  const [balance, setBalance] = useState(50000);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [trades, setTrades] = useState([]);
  const [seed, setSeed] = useState(9);

  const t = text[lang];

  const market = useMemo(() => normalizeCandles(generateMarket(asset, seed)), [asset, seed]);
  const last = market[market.length - 1];
  const previous = market[market.length - 2];
  const isUp = last.close >= previous.close;

  const ai = useMemo(() => {
    const confidence = Math.floor(61 + Math.random() * 33);
    const strength =
      confidence > 82 ? t.institutional : confidence > 72 ? t.good : t.wait;

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
  }, [asset, direction, last.close, t]);

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
      { id: Date.now(), asset: asset.symbol, direction, pnl, confidence: ai.confidence },
      ...old.slice(0, 7),
    ]);

    setSeed((s) => s + 1);
  }

  const wins = trades.filter((trade) => trade.pnl > 0).length;
  const losses = trades.filter((trade) => trade.pnl < 0).length;
  const displayPrice = asset.symbol === "EUR/USD" ? last.close.toFixed(4) : `$${last.close.toFixed(2)}`;
  const mission = t.missionList[level % t.missionList.length];

  return (
    <div className="game">
      <aside className="sidebar">
        <div className="logo">
          <span>𓂀</span>
          <div>
            <h1>{t.title}</h1>
            <p>{t.subtitle}</p>
          </div>
        </div>

        <div className="language-switch">
          <button className={lang === "ru" ? "lang-on" : ""} onClick={() => setLang("ru")}>RU</button>
          <button className={lang === "en" ? "lang-on" : ""} onClick={() => setLang("en")}>EN</button>
          <button className={lang === "ka" ? "lang-on" : ""} onClick={() => setLang("ka")}>KA</button>
        </div>

        <div className="profile-card">
          <small>{t.balance}</small>
          <strong>${balance.toLocaleString()}</strong>
          <div className="xp">
            <span>Level {level}</span>
            <div>
              <i style={{ width: `${Math.min(100, xp % 100)}%` }} />
            </div>
          </div>
        </div>

        <div className="menu">
          <button className="selected">{t.simulator}</button>
          <button>{t.coach}</button>
          <button>{t.riskLab}</button>
          <button>{t.missions}</button>
        </div>

        <div className="disclaimer">{t.disclaimer}</div>
      </aside>

      <main className="dashboard">
        <header className="hero">
          <div>
            <p className="eyebrow">{t.mode}</p>
            <h2>{t.hero}</h2>
            <span>{t.heroText}</span>
          </div>

          <div className="stats">
            <div><b>{wins}</b><small>{t.wins}</small></div>
            <div><b>{losses}</b><small>{t.losses}</small></div>
            <div><b>{ai.confidence}%</b><small>{t.aiScore}</small></div>
          </div>
        </header>

        <section className="terminal">
          <div className="terminal-head">
            <div>
              <h3>{asset.symbol}</h3>
              <p>{asset.name} · {t.marketDepth}</p>
            </div>
            <strong className={isUp ? "price-up" : "price-down"}>{displayPrice}</strong>
          </div>

          <div className="pro-chart">
            <div className="price-scale">
              <span>{asset.symbol === "EUR/USD" ? (last.high * 1.01).toFixed(4) : `$${(last.high * 1.01).toFixed(0)}`}</span>
              <span>{displayPrice}</span>
              <span>{asset.symbol === "EUR/USD" ? (last.low * 0.99).toFixed(4) : `$${(last.low * 0.99).toFixed(0)}`}</span>
            </div>

            <div className="price-line"><b>{displayPrice}</b></div>

            <svg className="trend-line" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polyline points="0,70 18,58 36,62 52,42 68,48 83,28 100,34" />
            </svg>

            <div className="candlestick-layer">
              {market.map((c) => (
                <div className="candle-slot" key={c.id}>
                  <div className="wick-pro" style={{ top: `${c.top}%`, height: `${c.wickHeight}%` }} />
                  <div
                    className={c.green ? "body-pro bull" : "body-pro bear"}
                    style={{ top: `${c.bodyTop}%`, height: `${c.bodyHeight}%` }}
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
            <h3>{t.tradeConsole}</h3>

            <label>{t.market}</label>
            <select
              value={asset.symbol}
              onChange={(e) => {
                setAsset(assets.find((a) => a.symbol === e.target.value));
                setSeed((s) => s + 1);
              }}
            >
              {assets.map((a) => <option key={a.symbol} value={a.symbol}>{a.symbol}</option>)}
            </select>

            <label>{t.direction}</label>
            <div className="split">
              <button onClick={() => setDirection("BUY")} className={direction === "BUY" ? "buy on" : "buy"}>BUY</button>
              <button onClick={() => setDirection("SELL")} className={direction === "SELL" ? "sell on" : "sell"}>SELL</button>
            </div>

            <label>{t.risk}: {risk}%</label>
            <input type="range" min="1" max="8" value={risk} onChange={(e) => setRisk(Number(e.target.value))} />

            <button className="execute" onClick={executeTrade}>{t.execute}</button>
          </div>

          <div className="card ai-card">
            <h3>{t.analysis}</h3>
            <p><b>{t.view}:</b> {ai.strength}</p>
            <p><b>{t.entry}:</b> {ai.entry}</p>
            <p><b>{t.stop}:</b> {ai.stop}</p>
            <p><b>{t.target}:</b> {ai.target}</p>
            <div className="score"><span style={{ width: `${ai.confidence}%` }} /></div>
          </div>

          <div className="card">
            <h3>{t.mission}</h3>
            <p className="mission">{mission}</p>
            <p className="muted">{t.missionText}</p>
          </div>

          <div className="card journal">
            <h3>{t.journal}</h3>
            {trades.length === 0 ? (
              <p className="muted">{t.noTrades}</p>
            ) : (
              trades.map((trade) => (
                <div className="trade" key={trade.id}>
                  <span>{trade.direction} {trade.asset}</span>
                  <b className={trade.pnl >= 0 ? "positive" : "negative"}>
                    {trade.pnl >= 0 ? "+" : ""}${trade.pnl}
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
