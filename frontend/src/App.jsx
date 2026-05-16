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
    mode: "ПРОФЕССИОНАЛЬНЫЙ УЧЕБНЫЙ РЕЖИМ",
    hero: "Тренируй сделки как настоящий трейдер.",
    heroText:
      "Анализируй рынок, выбирай направление, контролируй риск и учись дисциплине без реальных денег.",
    balance: "ДЕМО БАЛАНС",
    simulator: "Симулятор",
    coach: "AI Тренер",
    riskLab: "Риск",
    missions: "Миссии",
    disclaimer:
      "Только учебный симулятор. Без депозитов, вывода средств и реального gambling.",
    wins: "Победы",
    losses: "Ошибки",
    aiScore: "AI оценка",
    accuracy: "Точность",
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
    rr: "Risk / Reward",
    mission: "Миссия",
    missionText: "Выполняй задания и открывай новые уровни трейдера.",
    journal: "Журнал сделок",
    noTrades: "Сделок пока нет.",
    marketDepth: "симуляция рыночной глубины",
    institutional: "Сильный сетап: тренд, объем и импульс совпадают.",
    good: "Средний сетап: подтверждение есть, но нужен контроль риска.",
    wait: "Слабый сетап: лучше ждать более чистую структуру.",
    tutorial: "Инструкция",
    tutorialText:
      "1) Выбери актив. 2) Посмотри AI-анализ. 3) Установи риск. 4) Выбери BUY или SELL. 5) Запусти симуляцию и изучи результат.",
    psychology: "Психология",
    psychologyText:
      "Не увеличивай риск после ошибки. Главная цель — дисциплина, а не одна случайная прибыльная сделка.",
    riskWarning: "Высокий риск. Для обучения лучше держать 1–3%.",
    safeRisk: "Хороший учебный риск.",
    session: "Сессия",
    volatility: "Волатильность",
    trend: "Тренд",
    volume: "Объем",
    liquidity: "Ликвидность",
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
    mode: "PROFESSIONAL TRAINING MODE",
    hero: "Train like a real market operator.",
    heroText:
      "Analyze the market, choose direction, control risk and build discipline without real money.",
    balance: "DEMO BALANCE",
    simulator: "Simulator",
    coach: "AI Coach",
    riskLab: "Risk Lab",
    missions: "Missions",
    disclaimer:
      "Educational simulator only. No deposits, no withdrawals, no real gambling.",
    wins: "Wins",
    losses: "Mistakes",
    aiScore: "AI score",
    accuracy: "Accuracy",
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
    rr: "Risk / Reward",
    mission: "Mission",
    missionText: "Complete missions to unlock higher trader ranks.",
    journal: "Trade Journal",
    noTrades: "No trades yet.",
    marketDepth: "simulated market depth",
    institutional: "Strong setup: trend, volume and impulse align.",
    good: "Medium setup: confirmation exists, but risk control is needed.",
    wait: "Weak setup: wait for a cleaner structure.",
    tutorial: "Training Guide",
    tutorialText:
      "1) Choose an asset. 2) Read AI analysis. 3) Set risk. 4) Pick BUY or SELL. 5) Run the simulation and study the result.",
    psychology: "Psychology",
    psychologyText:
      "Do not increase risk after a mistake. The main goal is discipline, not one random profitable trade.",
    riskWarning: "High risk. For training, 1–3% is better.",
    safeRisk: "Good training risk.",
    session: "Session",
    volatility: "Volatility",
    trend: "Trend",
    volume: "Volume",
    liquidity: "Liquidity",
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
    mode: "პროფესიული სასწავლო რეჟიმი",
    hero: "ივარჯიშე როგორც რეალურმა ტრეიდერმა.",
    heroText:
      "გააანალიზე ბაზარი, აირჩიე მიმართულება, აკონტროლე რისკი და ისწავლე დისციპლინა რეალური ფულის გარეშე.",
    balance: "დემო ბალანსი",
    simulator: "სიმულატორი",
    coach: "AI მწვრთნელი",
    riskLab: "რისკი",
    missions: "მისიები",
    disclaimer:
      "მხოლოდ სასწავლო სიმულატორია. დეპოზიტი, თანხის გატანა და რეალური gambling არ არსებობს.",
    wins: "მოგება",
    losses: "შეცდომა",
    aiScore: "AI შეფასება",
    accuracy: "სიზუსტე",
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
    rr: "რისკი / მოგება",
    mission: "მისია",
    missionText: "შეასრულე დავალებები და გახსენი ახალი დონეები.",
    journal: "გარიგებების ჟურნალი",
    noTrades: "გარიგებები ჯერ არ არის.",
    marketDepth: "ბაზრის სიღრმის სიმულაცია",
    institutional: "ძლიერი სეტაპი: ტრენდი, მოცულობა და იმპულსი ემთხვევა.",
    good: "საშუალო სეტაპი: დადასტურება არის, მაგრამ საჭიროა რისკის კონტროლი.",
    wait: "სუსტი სეტაპი: ჯობია დაველოდოთ უფრო სუფთა სტრუქტურას.",
    tutorial: "ინსტრუქცია",
    tutorialText:
      "1) აირჩიე აქტივი. 2) წაიკითხე AI ანალიზი. 3) დააყენე რისკი. 4) აირჩიე BUY ან SELL. 5) გაუშვი სიმულაცია და შეისწავლე შედეგი.",
    psychology: "ფსიქოლოგია",
    psychologyText:
      "შეცდომის შემდეგ არ გაზარდო რისკი. მთავარი მიზანია დისციპლინა და არა შემთხვევითი მოგება.",
    riskWarning: "მაღალი რისკია. სწავლისთვის სჯობს 1–3%.",
    safeRisk: "კარგი სასწავლო რისკი.",
    session: "სესია",
    volatility: "ვოლატილობა",
    trend: "ტრენდი",
    volume: "მოცულობა",
    liquidity: "ლიკვიდობა",
    missionList: [
      "მოიგე 3 სასწავლო გარიგება",
      "რისკი შეინარჩუნე 3%-ზე დაბლა",
      "მიაღწიე $55,000 დემო ბალანსს",
      "გააკეთე 5 დისციპლინირებული შესვლა",
    ],
  },
};

function random(seed, i) {
  const x = Math.sin(seed * 999 + i * 77) * 10000;
  return x - Math.floor(x);
}

function formatPrice(asset, value) {
  if (asset.symbol === "EUR/USD") return value.toFixed(4);
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function generateMarket(asset, seed) {
  let price = asset.price * (1 + Math.sin(seed) * asset.volatility);

  return Array.from({ length: 64 }, (_, i) => {
    const wave = Math.sin((i + seed) * 0.22) * asset.volatility * 0.75;
    const impulse = Math.cos((i + seed) * 0.67) * asset.volatility * 0.45;
    const noise = (random(seed, i) - 0.5) * asset.volatility * 0.55;

    const open = price;
    const close = price * (1 + wave * 0.13 + impulse * 0.11 + noise);
    const high =
      Math.max(open, close) * (1 + random(seed + 3, i) * asset.volatility * 0.42);
    const low =
      Math.min(open, close) * (1 - random(seed + 6, i) * asset.volatility * 0.42);
    const volume = 22 + random(seed + 9, i) * 92;

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
      wickHeight: Math.max(12, 100 - top - bottom),
      bodyHeight: Math.max(7, 100 - bodyTop - bodyBottom),
      volumeHeight: Math.max(10, c.volume),
    };
  });
}

function getMarketMetrics(market) {
  const first = market[0];
  const last = market[market.length - 1];
  const trendValue = ((last.close - first.open) / first.open) * 100;
  const volume =
    market.reduce((sum, c) => sum + c.volume, 0) / Math.max(1, market.length);
  const volatility =
    market.reduce((sum, c) => sum + Math.abs(c.close - c.open) / c.open, 0) /
    Math.max(1, market.length);

  return {
    trendValue,
    trendLabel: trendValue >= 0 ? "Bullish" : "Bearish",
    volume: Math.round(volume),
    volatility: Math.round(volatility * 10000) / 100,
    liquidity: Math.min(98, Math.round(70 + volume / 4)),
  };
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
  const [seed, setSeed] = useState(12);

  const t = text[lang];

  const market = useMemo(
    () => normalizeCandles(generateMarket(asset, seed)),
    [asset, seed]
  );

  const metrics = useMemo(() => getMarketMetrics(market), [market]);

  const last = market[market.length - 1];
  const previous = market[market.length - 2];
  const isUp = last.close >= previous.close;

  const ai = useMemo(() => {
    const trendAligned =
      (metrics.trendValue >= 0 && direction === "BUY") ||
      (metrics.trendValue < 0 && direction === "SELL");

    const base = trendAligned ? 72 : 58;
    const confidence = Math.max(
      45,
      Math.min(94, Math.round(base + metrics.liquidity / 8 - risk * 1.35))
    );

    const strength =
      confidence > 82 ? t.institutional : confidence > 68 ? t.good : t.wait;

    const entry = last.close;
    const stopValue = direction === "BUY" ? last.close * 0.985 : last.close * 1.015;
    const targetValue =
      direction === "BUY" ? last.close * 1.034 : last.close * 0.966;

    const reward = Math.abs(targetValue - entry);
    const loss = Math.abs(entry - stopValue);
    const rr = (reward / loss).toFixed(2);

    return {
      confidence,
      strength,
      entry: formatPrice(asset, entry),
      stop: formatPrice(asset, stopValue),
      target: formatPrice(asset, targetValue),
      rr,
    };
  }, [asset, direction, last.close, metrics, risk, t]);

  function executeTrade() {
    const chance = Math.min(0.88, Math.max(0.22, ai.confidence / 100 - risk * 0.013));
    const win = Math.random() < chance;
    const amount = Math.round(balance * (risk / 100));
    const multiplier = 1.15 + Math.random() * 1.05;
    const pnl = win ? Math.round(amount * multiplier) : -amount;

    setBalance((b) => Math.max(0, b + pnl));

    setXp((x) => {
      const next = x + (win ? 24 : 10);
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
        risk,
      },
      ...old.slice(0, 9),
    ]);

    setSeed((s) => s + 1);
  }

  const wins = trades.filter((trade) => trade.pnl > 0).length;
  const losses = trades.filter((trade) => trade.pnl < 0).length;
  const accuracy =
    trades.length === 0 ? 0 : Math.round((wins / trades.length) * 100);
  const displayPrice = formatPrice(asset, last.close);
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
          <button className={lang === "ru" ? "lang-on" : ""} onClick={() => setLang("ru")}>
            RU
          </button>
          <button className={lang === "en" ? "lang-on" : ""} onClick={() => setLang("en")}>
            EN
          </button>
          <button className={lang === "ka" ? "lang-on" : ""} onClick={() => setLang("ka")}>
            KA
          </button>
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
            <div>
              <b>{wins}</b>
              <small>{t.wins}</small>
            </div>
            <div>
              <b>{losses}</b>
              <small>{t.losses}</small>
            </div>
            <div>
              <b>{accuracy}%</b>
              <small>{t.accuracy}</small>
            </div>
            <div>
              <b>{ai.confidence}%</b>
              <small>{t.aiScore}</small>
            </div>
          </div>
        </header>

        <section className="terminal">
          <div className="terminal-head">
            <div>
              <h3>{asset.symbol}</h3>
              <p>
                {asset.name} · {t.marketDepth}
              </p>
            </div>
            <strong className={isUp ? "price-up" : "price-down"}>
              {displayPrice}
            </strong>
          </div>

          <div className="market-strip">
            <div>
              <small>{t.trend}</small>
              <b>{metrics.trendLabel}</b>
            </div>
            <div>
              <small>{t.volatility}</small>
              <b>{metrics.volatility}%</b>
            </div>
            <div>
              <small>{t.volume}</small>
              <b>{metrics.volume}</b>
            </div>
            <div>
              <small>{t.liquidity}</small>
              <b>{metrics.liquidity}%</b>
            </div>
          </div>

          <div className="pro-chart">
            <div className="price-scale">
              <span>{formatPrice(asset, last.high * 1.01)}</span>
              <span>{displayPrice}</span>
              <span>{formatPrice(asset, last.low * 0.99)}</span>
            </div>

            <div className="price-line">
              <b>{displayPrice}</b>
            </div>

            <svg className="trend-line" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polyline points="0,72 12,66 23,70 35,52 47,57 59,39 71,44 84,25 100,33" />
            </svg>

            <div className="candlestick-layer">
              {market.map((c) => (
                <div className="candle-slot" key={c.id}>
                  <div
                    className="wick-pro"
                    style={{ top: `${c.top}%`, height: `${c.wickHeight}%` }}
                  />
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
                const nextAsset = assets.find((a) => a.symbol === e.target.value);
                setAsset(nextAsset || assets[0]);
                setSeed((s) => s + 1);
              }}
            >
              {assets.map((a) => (
                <option key={a.symbol} value={a.symbol}>
                  {a.symbol}
                </option>
              ))}
            </select>

            <label>{t.direction}</label>
            <div className="split">
              <button
                onClick={() => setDirection("BUY")}
                className={direction === "BUY" ? "buy on" : "buy"}
              >
                BUY
              </button>
              <button
                onClick={() => setDirection("SELL")}
                className={direction === "SELL" ? "sell on" : "sell"}
              >
                SELL
              </button>
            </div>

            <label>
              {t.risk}: {risk}%
            </label>
            <input
              type="range"
              min="1"
              max="8"
              value={risk}
              onChange={(e) => setRisk(Number(e.target.value))}
            />

            <p className={risk > 3 ? "risk-bad" : "risk-good"}>
              {risk > 3 ? t.riskWarning : t.safeRisk}
            </p>

            <button className="execute" onClick={executeTrade}>
              {t.execute}
            </button>
          </div>

          <div className="card ai-card">
            <h3>{t.analysis}</h3>
            <p>
              <b>{t.view}:</b> {ai.strength}
            </p>
            <p>
              <b>{t.entry}:</b> {ai.entry}
            </p>
            <p>
              <b>{t.stop}:</b> {ai.stop}
            </p>
            <p>
              <b>{t.target}:</b> {ai.target}
            </p>
            <p>
              <b>{t.rr}:</b> 1:{ai.rr}
            </p>
            <div className="score">
              <span style={{ width: `${ai.confidence}%` }} />
            </div>
          </div>

          <div className="card">
            <h3>{t.tutorial}</h3>
            <p className="muted">{t.tutorialText}</p>
          </div>

          <div className="card">
            <h3>{t.psychology}</h3>
            <p className="muted">{t.psychologyText}</p>
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
                  <span>
                    {trade.direction} {trade.asset} · {trade.risk}%
                  </span>
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
