import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

const assets = ["BTC/USDT", "ETH/USDT", "GOLD", "EUR/USD", "NASDAQ"];

const startPrices = {
  "BTC/USDT": 68000,
  "ETH/USDT": 3450,
  GOLD: 2380,
  "EUR/USD": 1.086,
  NASDAQ: 18450,
};

function makeCandle(prevClose, trend = 1) {
  const volatility = prevClose * (0.002 + Math.random() * 0.006);
  const drift = trend * prevClose * (0.0004 + Math.random() * 0.0015);
  const open = prevClose;
  const close = Math.max(0.01, open + drift + (Math.random() - 0.5) * volatility);
  const high = Math.max(open, close) + Math.random() * volatility;
  const low = Math.min(open, close) - Math.random() * volatility;
  return { open, high, low, close };
}

function money(n) {
  return "$" + n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export default function App() {
  const [lang, setLang] = useState("RU");
  const [asset, setAsset] = useState("BTC/USDT");
  const [balance, setBalance] = useState(50000);
  const [risk, setRisk] = useState(2);
  const [direction, setDirection] = useState("BUY");
  const [candles, setCandles] = useState(() => {
    let arr = [];
    let price = startPrices["BTC/USDT"];
    for (let i = 0; i < 38; i++) {
      const c = makeCandle(price, 1);
      arr.push(c);
      price = c.close;
    }
    return arr;
  });
  const [openPosition, setOpenPosition] = useState(null);
  const [history, setHistory] = useState([]);
  const [coach, setCoach] = useState("Выбери направление, оцени рынок и открой учебную сделку.");
  const [wins, setWins] = useState(0);
  const [errors, setErrors] = useState(0);

  const price = candles[candles.length - 1].close;
  const prev = candles[candles.length - 2].close;
  const trend = price >= prev ? "Bullish" : "Bearish";

  const ai = useMemo(() => {
    const momentum = candles.slice(-6).filter(c => c.close > c.open).length;
    const longProb = Math.round(35 + momentum * 8 + Math.random() * 8);
    const shortProb = 100 - longProb;
    const confidence = Math.max(longProb, shortProb);
    return { longProb, shortProb, confidence };
  }, [candles]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCandles(prevCandles => {
        const last = prevCandles[prevCandles.length - 1];
        const trendForce = openPosition
          ? openPosition.side === "BUY"
            ? 1
            : -1
          : Math.random() > 0.45
          ? 1
          : -1;

        const next = makeCandle(last.close, trendForce);
        return [...prevCandles.slice(-37), next];
      });
    }, 1300);

    return () => clearInterval(timer);
  }, [openPosition]);

  useEffect(() => {
    if (!openPosition) return;

    const pnl =
      openPosition.side === "BUY"
        ? ((price - openPosition.entry) / openPosition.entry) * openPosition.size
        : ((openPosition.entry - price) / openPosition.entry) * openPosition.size;

    if (price >= openPosition.takeProfit && openPosition.side === "BUY") closePosition("TP");
    if (price <= openPosition.stopLoss && openPosition.side === "BUY") closePosition("SL");
    if (price <= openPosition.takeProfit && openPosition.side === "SELL") closePosition("TP");
    if (price >= openPosition.stopLoss && openPosition.side === "SELL") closePosition("SL");

    setOpenPosition(p => (p ? { ...p, pnl } : null));
  }, [price]);

  function openTrade() {
    if (openPosition) {
      setCoach("Сначала закрой текущую позицию. У профессионального трейдера не должно быть хаоса в сделках.");
      return;
    }

    const riskMoney = balance * (risk / 100);
    const size = riskMoney * 20;
    const stopDistance = price * 0.006;
    const takeDistance = stopDistance * 2.4;

    const pos = {
      id: Date.now(),
      side: direction,
      asset,
      entry: price,
      size,
      riskMoney,
      balanceBefore: balance,
      stopLoss: direction === "BUY" ? price - stopDistance : price + stopDistance,
      takeProfit: direction === "BUY" ? price + takeDistance : price - takeDistance,
      pnl: 0,
      openedAt: new Date().toLocaleTimeString(),
    };

    setOpenPosition(pos);

    setCoach(
      `AI объяснение: ${direction === "BUY" ? "BUY выбран потому, что импульс и структура рынка поддерживают рост." : "SELL выбран потому, что рынок показывает признаки слабости."} Риск ${risk}% допустим. Вход открыт по ${money(price)}.`
    );
  }

  function closePosition(reason = "Manual") {
    if (!openPosition) return;

    const pnl =
      openPosition.side === "BUY"
        ? ((price - openPosition.entry) / openPosition.entry) * openPosition.size
        : ((openPosition.entry - price) / openPosition.entry) * openPosition.size;

    const newBalance = balance + pnl;
    const win = pnl >= 0;

    setBalance(newBalance);
    setWins(w => w + (win ? 1 : 0));
    setErrors(e => e + (win ? 0 : 1));

    const explanation = win
      ? `Победа: направление было выбрано правильно. Цена пошла в сторону ${openPosition.side}. Баланс до сделки: ${money(openPosition.balanceBefore)}, после сделки: ${money(newBalance)}. Чистый PnL: ${money(pnl)}.`
      : `Ошибка: рынок пошёл против позиции. Возможные причины — вход против импульса, ранний вход без подтверждения, слишком высокий риск или игнорирование волатильности. Баланс до сделки: ${money(openPosition.balanceBefore)}, после сделки: ${money(newBalance)}. PnL: ${money(pnl)}.`;

    setCoach(`AI разбор сделки. ${explanation}`);

    setHistory(h => [
      {
        ...openPosition,
        exit: price,
        pnl,
        reason,
        balanceAfter: newBalance,
        closedAt: new Date().toLocaleTimeString(),
        explanation,
      },
      ...h,
    ]);

    setOpenPosition(null);
  }

  function candleChart() {
    const max = Math.max(...candles.map(c => c.high));
    const min = Math.min(...candles.map(c => c.low));
    const height = 260;

    return (
      <div className="chart">
        {candles.map((c, i) => {
          const up = c.close >= c.open;
          const top = ((max - c.high) / (max - min)) * height;
          const bottom = ((max - c.low) / (max - min)) * height;
          const bodyTop = ((max - Math.max(c.open, c.close)) / (max - min)) * height;
          const bodyBottom = ((max - Math.min(c.open, c.close)) / (max - min)) * height;

          return (
            <div className="candleBox" key={i}>
              <div
                className="wick"
                style={{
                  top,
                  height: Math.max(4, bottom - top),
                }}
              />
              <div
                className={up ? "body up" : "body down"}
                style={{
                  top: bodyTop,
                  height: Math.max(6, bodyBottom - bodyTop),
                }}
              />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="app">
      <header>
        <div>
          <div className="logo">𓂀 Ancient Trade AI</div>
          <p>AI-симулятор трейдинга · обучение без реальных денег</p>
        </div>
        <div className="langs">
          {["RU", "EN", "KA"].map(l => (
            <button key={l} onClick={() => setLang(l)} className={lang === l ? "active" : ""}>
              {l}
            </button>
          ))}
        </div>
      </header>

      <section className="grid">
        <div className="card balance">
          <span>ДЕМО БАЛАНС</span>
          <h1>{money(balance)}</h1>
          <p>Начальный капитал: $50,000</p>
          <div className="stats">
            <b>{wins}</b><span>Победы</span>
            <b>{errors}</b><span>Ошибки</span>
            <b>{wins + errors ? Math.round((wins / (wins + errors)) * 100) : 0}%</b><span>Точность</span>
          </div>
        </div>

        <div className="card market">
          <div className="marketTop">
            <div>
              <h2>{asset}</h2>
              <p>Тренд: {trend} · AI confidence {ai.confidence}%</p>
            </div>
            <h2>{money(price)}</h2>
          </div>
          {candleChart()}
        </div>

        <div className="card trade">
          <h2>Панель сделки</h2>

          <label>Актив</label>
          <select value={asset} onChange={e => setAsset(e.target.value)}>
            {assets.map(a => <option key={a}>{a}</option>)}
          </select>

          <label>Направление</label>
          <div className="row">
            <button onClick={() => setDirection("BUY")} className={direction === "BUY" ? "buy activeBtn" : "buy"}>BUY</button>
            <button onClick={() => setDirection("SELL")} className={direction === "SELL" ? "sell activeBtn" : "sell"}>SELL</button>
          </div>

          <label>Риск: {risk}%</label>
          <input type="range" min="1" max="10" value={risk} onChange={e => setRisk(Number(e.target.value))} />

          <div className="prob">
            <span>LONG вероятность: {ai.longProb}%</span>
            <span>SHORT вероятность: {ai.shortProb}%</span>
          </div>

          <button className="mainBtn" onClick={openTrade}>Открыть позицию</button>

          {openPosition && (
            <div className="position">
              <h3>Открытая позиция</h3>
              <p>{openPosition.side} {openPosition.asset}</p>
              <p>Вход: {money(openPosition.entry)}</p>
              <p>Текущая цена: {money(price)}</p>
              <p>Take Profit: {money(openPosition.takeProfit)}</p>
              <p>Stop Loss: {money(openPosition.stopLoss)}</p>
              <h2 className={openPosition.pnl >= 0 ? "green" : "red"}>
                PnL: {money(openPosition.pnl)}
              </h2>
              <button className="closeBtn" onClick={() => closePosition("Manual")}>Закрыть позицию</button>
            </div>
          )}
        </div>
      </section>

      <section className="grid2">
        <div className="card">
          <h2>AI Тренер</h2>
          <p className="coach">{coach}</p>
          <ul>
            <li>Покупка = ставка на рост цены.</li>
            <li>Продажа = ставка на падение цены.</li>
            <li>PnL показывает прибыль или убыток текущей позиции.</li>
            <li>Take Profit закрывает сделку с прибылью.</li>
            <li>Stop Loss ограничивает убыток.</li>
          </ul>
        </div>

        <div className="card">
          <h2>История BUY / SELL</h2>
          {history.length === 0 && <p>Сделок пока нет.</p>}
          {history.map(t => (
            <div className="history" key={t.id}>
              <b>{t.side} {t.asset}</b>
              <span>{t.openedAt} → {t.closedAt}</span>
              <p>Вход: {money(t.entry)} · Выход: {money(t.exit)}</p>
              <p>Баланс: {money(t.balanceBefore)} → {money(t.balanceAfter)}</p>
              <h3 className={t.pnl >= 0 ? "green" : "red"}>{money(t.pnl)} · {t.reason}</h3>
              <small>{t.explanation}</small>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
