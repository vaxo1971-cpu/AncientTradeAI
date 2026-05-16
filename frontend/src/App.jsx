import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

const assets = [
  { symbol: "BTC/USDT", name: "Bitcoin", price: 68420, volatility: 0.038 },
  { symbol: "ETH/USDT", name: "Ethereum", price: 3450, volatility: 0.045 },
  { symbol: "GOLD", name: "Gold", price: 2365, volatility: 0.018 },
  { symbol: "EUR/USD", name: "Euro / Dollar", price: 1.0874, volatility: 0.008 },
  { symbol: "NASDAQ", name: "Nasdaq Index", price: 18450, volatility: 0.026 },
];

const ranks = ["Bronze Trader", "Silver Trader", "Gold Trader", "AI Hunter", "Ancient Oracle"];

const text = {
  ru: {
    title: "Ancient Trade AI",
    subtitle: "AI-симулятор трейдинга",
    balance: "ДЕМО БАЛАНС",
    disclaimer: "Только учебный симулятор. Без депозитов, вывода средств и реального gambling.",
    hero: "Тренируй сделки как профессиональный трейдер.",
    heroText: "Живой рынок, AI-анализ, риск-менеджмент, психология и миссии — без реальных денег.",
    wins: "Победы",
    losses: "Ошибки",
    accuracy: "Точность",
    drawdown: "Просадка",
    aiScore: "AI оценка",
    market: "Актив",
    direction: "Направление",
    risk: "Риск",
    execute: "Симулировать сделку",
    aiAnalysis: "AI анализ",
    aiCoach: "AI Тренер",
    longProb: "LONG вероятность",
    shortProb: "SHORT вероятность",
    confidence: "Уверенность",
    entry: "Вход",
    stop: "Стоп",
    target: "Цель",
    rr: "Risk / Reward",
    trend: "Тренд",
    volatility: "Волатильность",
    volume: "Объем",
    liquidity: "Ликвидность",
    spread: "Спред",
    slippage: "Проскальзывание",
    news: "Новость",
    whale: "Whale activity",
    tutorial: "Быстрый старт",
    tutorialText: "1) Выбери актив. 2) Оцени тренд и AI-сигналы. 3) Держи риск 1–3%. 4) Выбери BUY/SELL. 5) Изучи разбор сделки.",
    mission: "Миссия",
    journal: "Журнал сделок",
    empty: "Сделок пока нет.",
    buy: "BUY",
    sell: "SELL",
    training: "Учебный режим",
    riskGood: "Хороший учебный риск.",
    riskBad: "Высокий риск. Для обучения лучше 1–3%.",
    winCoach: "Хорошая дисциплина: вход соответствовал структуре рынка и риск был под контролем.",
    lossCoach: "Ошибка полезна: проверь вход против тренда, размер риска и отсутствие подтверждения.",
    waitCoach: "Не каждый сигнал нужно торговать. Иногда лучший трейд — это пропуск.",
  },
  en: {
    title: "Ancient Trade AI",
    subtitle: "AI trading simulator",
    balance: "DEMO BALANCE",
    disclaimer: "Educational simulator only. No deposits, no withdrawals, no real gambling.",
    hero: "Train like a professional trader.",
    heroText: "Live-style market, AI analysis, risk management, psychology and missions — without real money.",
    wins: "Wins",
    losses: "Mistakes",
    accuracy: "Accuracy",
    drawdown: "Drawdown",
    aiScore: "AI score",
    market: "Asset",
    direction: "Direction",
    risk: "Risk",
    execute: "Execute Simulation",
    aiAnalysis: "AI Analysis",
    aiCoach: "AI Coach",
    longProb: "LONG probability",
    shortProb: "SHORT probability",
    confidence: "Confidence",
    entry: "Entry",
    stop: "Stop",
    target: "Target",
    rr: "Risk / Reward",
    trend: "Trend",
    volatility: "Volatility",
    volume: "Volume",
    liquidity: "Liquidity",
    spread: "Spread",
    slippage: "Slippage",
    news: "News",
    whale: "Whale activity",
    tutorial: "Quick Start",
    tutorialText: "1) Choose an asset. 2) Read trend and AI signals. 3) Keep risk at 1–3%. 4) Pick BUY/SELL. 5) Study the trade review.",
    mission: "Mission",
    journal: "Trade Journal",
    empty: "No trades yet.",
    buy: "BUY",
    sell: "SELL",
    training: "Training mode",
    riskGood: "Good training risk.",
    riskBad: "High risk. For training, 1–3% is better.",
    winCoach: "Good discipline: your entry matched market structure and risk stayed controlled.",
    lossCoach: "Useful mistake: review trend direction, risk size and confirmation quality.",
    waitCoach: "Not every signal should be traded. Sometimes the best trade is no trade.",
  },
  ka: {
    title: "Ancient Trade AI",
    subtitle: "AI სავაჭრო სიმულატორი",
    balance: "დემო ბალანსი",
    disclaimer: "მხოლოდ სასწავლო სიმულატორია. დეპოზიტი, თანხის გატანა და რეალური gambling არ არსებობს.",
    hero: "ივარჯიშე პროფესიონალი ტრეიდერივით.",
    heroText: "ცოცხალი ბაზრის სტილი, AI ანალიზი, რისკის კონტროლი, ფსიქოლოგია და მისიები — რეალური ფულის გარეშე.",
    wins: "მოგება",
    losses: "შეცდომა",
    accuracy: "სიზუსტე",
    drawdown: "ვარდნა",
    aiScore: "AI შეფასება",
    market: "აქტივი",
    direction: "მიმართულება",
    risk: "რისკი",
    execute: "სიმულაციური გარიგება",
    aiAnalysis: "AI ანალიზი",
    aiCoach: "AI მწვრთნელი",
    longProb: "LONG ალბათობა",
    shortProb: "SHORT ალბათობა",
    confidence: "დაჯერებულობა",
    entry: "შესვლა",
    stop: "სტოპი",
    target: "სამიზნე",
    rr: "რისკი / მოგება",
    trend: "ტრენდი",
    volatility: "ვოლატილობა",
    volume: "მოცულობა",
    liquidity: "ლიკვიდობა",
    spread: "სპრედი",
    slippage: "სლიპეჯი",
    news: "სიახლე",
    whale: "Whale activity",
    tutorial: "სწრაფი ინსტრუქცია",
    tutorialText: "1) აირჩიე აქტივი. 2) წაიკითხე ტრენდი და AI სიგნალები. 3) შეინარჩუნე რისკი 1–3%. 4) აირჩიე BUY/SELL. 5) შეისწავლე შედეგი.",
    mission: "მისია",
    journal: "გარიგებების ჟურნალი",
    empty: "გარიგებები ჯერ არ არის.",
    buy: "BUY",
    sell: "SELL",
    training: "სასწავლო რეჟიმი",
    riskGood: "კარგი სასწავლო რისკი.",
    riskBad: "მაღალი რისკია. სწავლისთვის სჯობს 1–3%.",
    winCoach: "კარგი დისციპლინა: შესვლა დაემთხვა ბაზრის სტრუქტურას და რისკი კონტროლში იყო.",
    lossCoach: "სასარგებლო შეცდომა: შეამოწმე ტრენდი, რისკის ზომა და დადასტურება.",
    waitCoach: "ყველა სიგნალი სავაჭრო არ არის. ზოგჯერ საუკეთესო გარიგება არის არშესვლა.",
  },
};

function seededRandom(seed, i) {
  const x = Math.sin(seed * 917 + i * 131.7) * 10000;
  return x - Math.floor(x);
}

function formatPrice(asset, value) {
  if (asset.symbol === "EUR/USD") return value.toFixed(4);
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function generateCandles(asset, seed, tick) {
  let price = asset.price * (1 + Math.sin(seed + tick / 8) * asset.volatility * 0.8);
  return Array.from({ length: 48 }, (_, i) => {
    const wave = Math.sin((i + seed + tick / 10) * 0.34) * asset.volatility;
    const impulse = Math.cos((i + tick) * 0.71) * asset.volatility * 0.55;
    const noise = (seededRandom(seed + tick / 13, i) - 0.5) * asset.volatility * 0.9;
    const open = price;
    const close = price * (1 + wave * 0.12 + impulse * 0.1 + noise);
    const high = Math.max(open, close) * (1 + seededRandom(seed + 4, i) * asset.volatility * 0.45);
    const low = Math.min(open, close) * (1 - seededRandom(seed + 9, i) * asset.volatility * 0.45);
    const volume = 18 + seededRandom(seed + 14, i + tick) * 90;
    price = close;
    return { id: i, open, close, high, low, volume, green: close >= open };
  });
}

function normalize(candles) {
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
      wickTop: top,
      wickHeight: Math.max(8, 100 - top - bottom),
      bodyTop,
      bodyHeight: Math.max(7, 100 - bodyTop - bodyBottom),
      volumeHeight: Math.max(12, Math.min(96, c.volume)),
    };
  });
}

function metrics(candles) {
  const first = candles[0];
  const last = candles[candles.length - 1];
  const trendValue = ((last.close - first.open) / first.open) * 100;
  const avgVolume = candles.reduce((s, c) => s + c.volume, 0) / candles.length;
  const volatility = candles.reduce((s, c) => s + Math.abs(c.close - c.open) / c.open, 0) / candles.length;
  return {
    trendValue,
    trend: trendValue >= 0 ? "Bullish" : "Bearish",
    volume: Math.round(avgVolume),
    volatility: Math.round(volatility * 10000) / 100,
    liquidity: Math.min(98, Math.round(62 + avgVolume / 3)),
  };
}

export default function App() {
  const [lang, setLang] = useState("ru");
  const [asset, setAsset] = useState(assets[0]);
  const [direction, setDirection] = useState("BUY");
  const [risk, setRisk] = useState(2);
  const [balance, setBalance] = useState(50000);
  const [peak, setPeak] = useState(50000);
  const [trades, setTrades] = useState([]);
  const [seed, setSeed] = useState(22);
  const [tick, setTick] = useState(0);
  const [coach, setCoach] = useState("");

  const t = text[lang];

  useEffect(() => {
    const timer = setInterval(() => setTick((v) => v + 1), 1200);
    return () => clearInterval(timer);
  }, []);

  const candles = useMemo(() => normalize(generateCandles(asset, seed, tick)), [asset, seed, tick]);
  const rawCandles = useMemo(() => generateCandles(asset, seed, tick), [asset, seed, tick]);
  const m = useMemo(() => metrics(rawCandles), [rawCandles]);
  const last = rawCandles[rawCandles.length - 1];
  const prev = rawCandles[rawCandles.length - 2];
  const priceUp = last.close >= prev.close;

  const ai = useMemo(() => {
    const trendAligned = (m.trendValue >= 0 && direction === "BUY") || (m.trendValue < 0 && direction === "SELL");
    const riskPenalty = risk > 3 ? (risk - 3) * 4 : 0;
    const confidence = Math.max(38, Math.min(93, Math.round((trendAligned ? 72 : 55) + m.liquidity / 9 - riskPenalty)));
    const longProb = Math.max(18, Math.min(82, Math.round(50 + m.trendValue * 3 + (priceUp ? 8 : -5))));
    const shortProb = 100 - longProb;
    const entry = last.close;
    const spread = entry * (0.0003 + asset.volatility * 0.015);
    const slippage = entry * (risk / 10000) * (asset.volatility * 18);
    const stop = direction === "BUY" ? entry * (1 - 0.012 - risk / 900) : entry * (1 + 0.012 + risk / 900);
    const target = direction === "BUY" ? entry * (1 + 0.028 + confidence / 4200) : entry * (1 - 0.028 - confidence / 4200);
    const rr = (Math.abs(target - entry) / Math.abs(entry - stop)).toFixed(2);
    const signals = [
      confidence > 76 ? "Liquidity sweep detected" : "Structure still forming",
      m.volume > 55 ? "Volume confirmation" : "Low-volume caution",
      Math.abs(m.trendValue) > 1.2 ? "Momentum active" : "Range market",
      seededRandom(seed, tick) > 0.62 ? "Whale order imbalance" : "No major whale signal",
    ];
    return { confidence, longProb, shortProb, entry, stop, target, rr, spread, slippage, signals };
  }, [asset, direction, last.close, m, priceUp, risk, seed, tick]);

  const wins = trades.filter((x) => x.pnl > 0).length;
  const losses = trades.filter((x) => x.pnl < 0).length;
  const accuracy = trades.length ? Math.round((wins / trades.length) * 100) : 0;
  const drawdown = Math.max(0, Math.round(((peak - balance) / peak) * 1000) / 10);
  const level = Math.max(1, Math.min(5, Math.floor((balance - 50000) / 3500) + 1 + Math.floor(trades.length / 8)));
  const rank = ranks[level - 1] || ranks[ranks.length - 1];
  const xp = Math.min(100, Math.round(((balance - 50000 + trades.length * 420) % 3500) / 35));

  function executeTrade() {
    const chance = Math.max(0.28, Math.min(0.74, ai.confidence / 100 - risk * 0.018));
    const win = Math.random() < chance;
    const riskAmount = Math.round(balance * (risk / 100));
    const pnl = win ? Math.round(riskAmount * (0.75 + Math.random() * 1.55)) : -Math.round(riskAmount * (0.65 + Math.random() * 0.75));
    const nextBalance = Math.max(1000, balance + pnl);
    setBalance(nextBalance);
    setPeak((p) => Math.max(p, nextBalance));
    setTrades((old) => [
      {
        id: Date.now(),
        asset: asset.symbol,
        direction,
        pnl,
        risk,
        confidence: ai.confidence,
        reason: win ? t.winCoach : t.lossCoach,
      },
      ...old.slice(0, 11),
    ]);
    setCoach(win ? t.winCoach : t.lossCoach);
    setSeed((s) => s + 1.7);
  }

  const displayPrice = formatPrice(asset, last.close);
  const mission = risk <= 3 ? "Keep risk controlled and complete 5 disciplined entries" : "Reduce risk below 3% before scaling";

  return (
    <main className="app">
      <div className="orb orb-one" />
      <div className="orb orb-two" />

      <header className="topbar">
        <div className="brand">
          <div className="eye">𓂀</div>
          <div>
            <h1>{t.title}</h1>
            <p>{t.subtitle}</p>
          </div>
        </div>

        <div className="language">
          {["ru", "en", "ka"].map((code) => (
            <button key={code} className={lang === code ? "active" : ""} onClick={() => setLang(code)}>
              {code.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      <section className="hero">
        <div>
          <span className="pill">{t.training}</span>
          <h2>{t.hero}</h2>
          <p>{t.heroText}</p>
          <small>{t.disclaimer}</small>
        </div>

        <div className="balance-card">
          <span>{t.balance}</span>
          <strong>${balance.toLocaleString()}</strong>
          <div className="rank">{rank}</div>
          <div className="xp"><span style={{ width: `${xp}%` }} /></div>
        </div>
      </section>

      <section className="stats">
        <div><strong>{wins}</strong><span>{t.wins}</span></div>
        <div><strong>{losses}</strong><span>{t.losses}</span></div>
        <div><strong>{accuracy}%</strong><span>{t.accuracy}</span></div>
        <div><strong>{drawdown}%</strong><span>{t.drawdown}</span></div>
        <div><strong>{ai.confidence}%</strong><span>{t.aiScore}</span></div>
      </section>

      <section className="terminal">
        <div className="chart-card">
          <div className="chart-head">
            <div>
              <h3>{asset.symbol}</h3>
              <p>{asset.name} · AI market depth</p>
            </div>
            <div className={priceUp ? "price up" : "price down"}>{displayPrice}</div>
          </div>

          <div className="market-grid">
            <span>{t.trend}: <b>{m.trend}</b></span>
            <span>{t.volatility}: <b>{m.volatility}%</b></span>
            <span>{t.volume}: <b>{m.volume}</b></span>
            <span>{t.liquidity}: <b>{m.liquidity}%</b></span>
          </div>

          <div className="chart">
            <div className="price-line">{displayPrice}</div>
            {candles.map((c) => (
              <div className="candle-wrap" key={c.id}>
                <span className={c.green ? "wick green" : "wick red"} style={{ top: `${c.wickTop}%`, height: `${c.wickHeight}%` }} />
                <span className={c.green ? "body green" : "body red"} style={{ top: `${c.bodyTop}%`, height: `${c.bodyHeight}%` }} />
              </div>
            ))}
          </div>

          <div className="volumes">
            {candles.map((c) => (
              <span key={c.id} className={c.green ? "green" : "red"} style={{ height: `${c.volumeHeight}%` }} />
            ))}
          </div>
        </div>

        <aside className="panel">
          <h3>{t.aiAnalysis}</h3>

          <label>{t.market}</label>
          <select value={asset.symbol} onChange={(e) => {
            setAsset(assets.find((a) => a.symbol === e.target.value) || assets[0]);
            setSeed((s) => s + 2);
          }}>
            {assets.map((a) => <option key={a.symbol}>{a.symbol}</option>)}
          </select>

          <label>{t.direction}</label>
          <div className="side-buttons">
            <button className={direction === "BUY" ? "buy selected" : "buy"} onClick={() => setDirection("BUY")}>{t.buy}</button>
            <button className={direction === "SELL" ? "sell selected" : "sell"} onClick={() => setDirection("SELL")}>{t.sell}</button>
          </div>

          <label>{t.risk}: {risk}%</label>
          <input type="range" min="1" max="8" value={risk} onChange={(e) => setRisk(Number(e.target.value))} />
          <p className={risk > 3 ? "risk danger" : "risk safe"}>{risk > 3 ? t.riskBad : t.riskGood}</p>

          <button className="execute" onClick={executeTrade}>{t.execute}</button>
        </aside>
      </section>

      <section className="ai-grid">
        <div className="glass">
          <h3>{t.confidence}</h3>
          <div className="meter"><span style={{ width: `${ai.confidence}%` }} /></div>
          <b>{ai.confidence}%</b>
        </div>
        <div className="glass">
          <h3>{t.longProb}</h3>
          <div className="meter"><span style={{ width: `${ai.longProb}%` }} /></div>
          <b>{ai.longProb}%</b>
        </div>
        <div className="glass">
          <h3>{t.shortProb}</h3>
          <div className="meter redmeter"><span style={{ width: `${ai.shortProb}%` }} /></div>
          <b>{ai.shortProb}%</b>
        </div>
        <div className="glass">
          <h3>Market Mechanics</h3>
          <p>{t.spread}: {formatPrice(asset, ai.spread)}</p>
          <p>{t.slippage}: {formatPrice(asset, ai.slippage)}</p>
          <p>{t.rr}: 1:{ai.rr}</p>
        </div>
      </section>

      <section className="lower">
        <div className="coach">
          <h3>{t.aiCoach}</h3>
          <p>{coach || t.waitCoach}</p>
          <ul>
            {ai.signals.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </div>

        <div className="coach">
          <h3>{t.tutorial}</h3>
          <p>{t.tutorialText}</p>
          <h3>{t.mission}</h3>
          <p>{mission}</p>
        </div>

        <div className="journal">
          <h3>{t.journal}</h3>
          {trades.length === 0 ? <p>{t.empty}</p> : trades.map((trade) => (
            <div className="trade" key={trade.id}>
              <span>{trade.direction} {trade.asset} · {trade.risk}% · AI {trade.confidence}%</span>
              <b className={trade.pnl >= 0 ? "positive" : "negative"}>{trade.pnl >= 0 ? "+" : ""}${trade.pnl}</b>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
