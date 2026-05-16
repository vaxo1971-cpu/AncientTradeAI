import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

const assets = [
  { symbol: "BTC/USDT", name: "Bitcoin", price: 68420, volatility: 0.038 },
  { symbol: "ETH/USDT", name: "Ethereum", price: 3450, volatility: 0.045 },
  { symbol: "GOLD", name: "Gold", price: 2365, volatility: 0.018 },
  { symbol: "EUR/USD", name: "Euro / Dollar", price: 1.0874, volatility: 0.008 },
  { symbol: "NASDAQ", name: "Nasdaq Index", price: 18450, volatility: 0.026 },
];

function money(n) {
  return "$" + Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function makeCandle(prev, volatility, bias = 0) {
  const move = prev * (Math.random() - 0.48 + bias) * volatility * 0.12;
  const open = prev;
  const close = Math.max(0.01, prev + move);
  const high = Math.max(open, close) + prev * Math.random() * volatility * 0.045;
  const low = Math.min(open, close) - prev * Math.random() * volatility * 0.045;
  return { open, close, high, low };
}

export default function App() {
  const [lang, setLang] = useState("RU");
  const [asset, setAsset] = useState(assets[0]);
  const [balance, setBalance] = useState(50000);
  const [risk, setRisk] = useState(2);
  const [side, setSide] = useState("BUY");
  const [candles, setCandles] = useState(() => {
    let price = assets[0].price;
    return Array.from({ length: 42 }, () => {
      const c = makeCandle(price, assets[0].volatility);
      price = c.close;
      return c;
    });
  });
  const [position, setPosition] = useState(null);
  const [history, setHistory] = useState([]);
  const [coach, setCoach] = useState(
    "Баланс меняется только после закрытия сделки. Во время открытой позиции меняется только PnL."
  );

  const price = candles[candles.length - 1].close;
  const prevPrice = candles[candles.length - 2].close;
  const trend = price >= prevPrice ? "Bullish" : "Bearish";

  const currentPnl = useMemo(() => {
    if (!position) return 0;
    if (position.side === "BUY") {
      return ((price - position.entry) / position.entry) * position.size;
    }
    return ((position.entry - price) / position.entry) * position.size;
  }, [position, price]);

  const ai = useMemo(() => {
    const last = candles.slice(-8);
    const green = last.filter(c => c.close > c.open).length;
    const longProb = Math.min(82, Math.max(18, Math.round(34 + green * 7 + Math.random() * 8)));
    const shortProb = 100 - longProb;
    const confidence = Math.max(longProb, shortProb);
    return { longProb, shortProb, confidence };
  }, [candles]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCandles(old => {
        const last = old[old.length - 1];
        const bias = position ? (position.side === "BUY" ? 0.015 : -0.015) : 0;
        const next = makeCandle(last.close, asset.volatility, bias);
        return [...old.slice(-41), next];
      });
    }, 1200);

    return () => clearInterval(timer);
  }, [asset, position]);

  useEffect(() => {
    if (!position) return;

    if (position.side === "BUY") {
      if (price >= position.takeProfit) closePosition("Take Profit");
      if (price <= position.stopLoss) closePosition("Stop Loss");
    } else {
      if (price <= position.takeProfit) closePosition("Take Profit");
      if (price >= position.stopLoss) closePosition("Stop Loss");
    }
  }, [price]);

  function changeAsset(symbol) {
    const selected = assets.find(a => a.symbol === symbol);
    setAsset(selected);

    let p = selected.price;
    setCandles(
      Array.from({ length: 42 }, () => {
        const c = makeCandle(p, selected.volatility);
        p = c.close;
        return c;
      })
    );
    setPosition(null);
    setCoach("Актив изменён. Оцени рынок заново перед входом.");
  }

  function openPosition() {
    if (position) {
      setCoach("Сначала закрой открытую позицию. Баланс не должен меняться до закрытия сделки.");
      return;
    }

    const riskMoney = balance * (risk / 100);
    const size = riskMoney * 20;
    const stopDistance = price * 0.0065;
    const takeDistance = stopDistance * 2.4;

    const newPosition = {
      id: Date.now(),
      asset: asset.symbol,
      side,
      entry: price,
      size,
      riskMoney,
      balanceBefore: balance,
      stopLoss: side === "BUY" ? price - stopDistance : price + stopDistance,
      takeProfit: side === "BUY" ? price + takeDistance : price - takeDistance,
      openedAt: new Date().toLocaleTimeString(),
    };

    setPosition(newPosition);
    setCoach(
      `${side} открыт по ${money(price)}. Баланс пока НЕ изменился. Сейчас меняется только текущий PnL. Баланс изменится только после закрытия позиции.`
    );
  }

  function closePosition(reason = "Manual Close") {
    if (!position) return;

    const pnl =
      position.side === "BUY"
        ? ((price - position.entry) / position.entry) * position.size
        : ((position.entry - price) / position.entry) * position.size;

    const newBalance = balance + pnl;

    const explanation =
      pnl >= 0
        ? `Сделка закрыта с прибылью. Направление было выбрано верно, рынок пошёл в сторону позиции. Баланс: ${money(position.balanceBefore)} → ${money(newBalance)}.`
        : `Сделка закрыта с убытком. Ошибка могла быть во входе против импульса, слишком раннем входе или недостаточном подтверждении. Баланс: ${money(position.balanceBefore)} → ${money(newBalance)}.`;

    setBalance(newBalance);
    setHistory(h => [
      {
        ...position,
        exit: price,
        pnl,
        reason,
        balanceAfter: newBalance,
        closedAt: new Date().toLocaleTimeString(),
        explanation,
      },
      ...h,
    ]);

    setCoach(`AI разбор: ${explanation}`);
    setPosition(null);
  }

  function chart() {
    const max = Math.max(...candles.map(c => c.high), position?.takeProfit || 0, position?.stopLoss || 0);
    const min = Math.min(...candles.map(c => c.low), position?.takeProfit || Infinity, position?.stopLoss || Infinity);
    const h = 320;

    const lineTop = value => ((max - value) / (max - min)) * h;

    return (
      <div className="chart">
        {position && (
          <>
            <div className="tpLine" style={{ top: lineTop(position.takeProfit) }}>
              TP {money(position.takeProfit)}
            </div>
            <div className="slLine" style={{ top: lineTop(position.stopLoss) }}>
              SL {money(position.stopLoss)}
            </div>
            <div className="entryLine" style={{ top: lineTop(position.entry) }}>
              ENTRY {money(position.entry)}
            </div>
          </>
        )}

        {candles.map((c, i) => {
          const up = c.close >= c.open;
          const wickTop = ((max - c.high) / (max - min)) * h;
          const wickBottom = ((max - c.low) / (max - min)) * h;
          const bodyTop = ((max - Math.max(c.open, c.close)) / (max - min)) * h;
          const bodyBottom = ((max - Math.min(c.open, c.close)) / (max - min)) * h;

          return (
            <div className="candleBox" key={i}>
              <div className="wick" style={{ top: wickTop, height: wickBottom - wickTop }} />
              <div
                className={up ? "body up" : "body down"}
                style={{ top: bodyTop, height: Math.max(7, bodyBottom - bodyTop) }}
              />
            </div>
          );
        })}
      </div>
    );
  }

  const wins = history.filter(h => h.pnl >= 0).length;
  const losses = history.filter(h => h.pnl < 0).length;
  const accuracy = history.length ? Math.round((wins / history.length) * 100) : 0;

  return (
    <div className="app">
      <div className="ancientGlow" />

      <header className="top">
        <div>
          <div className="eye">𓂀</div>
          <h1>Ancient Trade AI</h1>
          <p>Premium AI Trading Simulator · no real money · training only</p>
        </div>

        <div className="langs">
          {["RU", "EN", "KA"].map(l => (
            <button key={l} className={lang === l ? "active" : ""} onClick={() => setLang(l)}>
              {l}
            </button>
          ))}
        </div>
      </header>

      <section className="hero">
        <div>
          <span className="badge">Учебный режим</span>
          <h2>Торгуй как в реальном терминале, но без риска реальных денег.</h2>
          <p>
            Баланс фиксированный до закрытия сделки. Открытая позиция показывает только плавающий PnL.
            После закрытия AI объясняет победу или ошибку.
          </p>
        </div>

        <div className="balanceCard">
          <span>ДЕМО БАЛАНС</span>
          <strong>{money(balance)}</strong>
          <small>Баланс меняется только после закрытия сделки</small>
        </div>
      </section>

      <main className="terminal">
        <section className="leftPanel panel">
          <h3>Trader Profile</h3>
          <div className="metric"><span>Победы</span><b>{wins}</b></div>
          <div className="metric"><span>Ошибки</span><b>{losses}</b></div>
          <div className="metric"><span>Точность</span><b>{accuracy}%</b></div>
          <div className="metric"><span>AI оценка</span><b>{ai.confidence}%</b></div>

          <div className="coachBox">
            <h3>AI Тренер</h3>
            <p>{coach}</p>
          </div>
        </section>

        <section className="marketPanel panel">
          <div className="marketHead">
            <div>
              <h2>{asset.symbol}</h2>
              <p>{asset.name} · Trend: {trend}</p>
            </div>
            <div className="livePrice">{money(price)}</div>
          </div>

          {chart()}

          {position && (
            <div className="floatingPnl">
              <span>{position.side} OPEN</span>
              <b className={currentPnl >= 0 ? "green" : "red"}>{money(currentPnl)}</b>
              <small>Плавающий PnL · баланс пока не изменён</small>
            </div>
          )}
        </section>

        <section className="tradePanel panel">
          <h3>AI Trade Console</h3>

          <label>Актив</label>
          <select value={asset.symbol} onChange={e => changeAsset(e.target.value)}>
            {assets.map(a => (
              <option key={a.symbol}>{a.symbol}</option>
            ))}
          </select>

          <label>Направление</label>
          <div className="sideButtons">
            <button onClick={() => setSide("BUY")} className={side === "BUY" ? "buy activeSide" : "buy"}>
              BUY
            </button>
            <button onClick={() => setSide("SELL")} className={side === "SELL" ? "sell activeSide" : "sell"}>
              SELL
            </button>
          </div>

          <label>Риск: {risk}%</label>
          <input type="range" min="1" max="10" value={risk} onChange={e => setRisk(Number(e.target.value))} />

          <div className="aiStats">
            <div><span>LONG</span><b>{ai.longProb}%</b></div>
            <div><span>SHORT</span><b>{ai.shortProb}%</b></div>
            <div><span>CONFIDENCE</span><b>{ai.confidence}%</b></div>
          </div>

          {!position ? (
            <button className="openBtn" onClick={openPosition}>
              OPEN POSITION
            </button>
          ) : (
            <button className="closeBtn" onClick={() => closePosition("Manual Close")}>
              CLOSE POSITION
            </button>
          )}

          {position && (
            <div className="positionBox">
              <h3>Открытая позиция</h3>
              <p>{position.side} · {position.asset}</p>
              <p>Entry: {money(position.entry)}</p>
              <p>TP: {money(position.takeProfit)}</p>
              <p>SL: {money(position.stopLoss)}</p>
              <p>Balance before: {money(position.balanceBefore)}</p>
              <h2 className={currentPnl >= 0 ? "green" : "red"}>PnL: {money(currentPnl)}</h2>
            </div>
          )}
        </section>
      </main>

      <section className="journal panel">
        <h2>Журнал сделок BUY / SELL</h2>
        {history.length === 0 ? (
          <p>Сделок пока нет. Открой позицию и закрой её вручную или дождись TP/SL.</p>
        ) : (
          history.map(t => (
            <div className="tradeRow" key={t.id}>
              <div>
                <b>{t.side} {t.asset}</b>
                <span>{t.openedAt} → {t.closedAt} · {t.reason}</span>
              </div>
              <div>
                <p>Entry {money(t.entry)} → Exit {money(t.exit)}</p>
                <p>Balance {money(t.balanceBefore)} → {money(t.balanceAfter)}</p>
              </div>
              <strong className={t.pnl >= 0 ? "green" : "red"}>{money(t.pnl)}</strong>
              <small>{t.explanation}</small>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
