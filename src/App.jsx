import React, { useEffect, useRef, useState } from "react";
import { createChart, CandlestickSeries, HistogramSeries } from "lightweight-charts";
import { TrendingUp, TrendingDown, Brain, ShieldCheck } from "lucide-react";
import "./styles.css";

function nextCandle(prev, bias = 0) {
  const open = prev.close;
  const volatility = 0.8 + Math.random() * 2.4;
  const direction = (Math.random() - 0.48 + bias) * volatility;
  const close = Math.max(50, open + direction);
  const high = Math.max(open, close) + Math.random() * volatility;
  const low = Math.min(open, close) - Math.random() * volatility;
  return {
    time: prev.time + 60,
    open: Number(open.toFixed(2)),
    high: Number(high.toFixed(2)),
    low: Number(low.toFixed(2)),
    close: Number(close.toFixed(2)),
  };
}

function makeInitialCandles() {
  const candles = [];
  let candle = { time: Math.floor(Date.now() / 1000) - 60 * 80, open: 100, high: 101, low: 99, close: 100 };
  for (let i = 0; i < 80; i++) {
    candle = nextCandle(candle, Math.sin(i / 9) * 0.05);
    candles.push(candle);
  }
  return candles;
}

function analyzeTrade(side, entry, current) {
  const diff = side === "BUY" ? current - entry : entry - current;
  const pnl = diff.toFixed(2);
  const result = diff >= 0 ? "Позиция пока в плюсе" : "Позиция пока в минусе";
  const psychology = diff >= 0
    ? "Хороший вход, но не держите сделку без плана выхода."
    : "Ошибка может быть во входе против импульса или без подтверждения структуры.";
  return `${result}. PnL: ${pnl}. AI-анализ: проверьте тренд, уровень ликвидности и risk/reward. ${psychology}`;
}

export default function App() {
  const chartRef = useRef(null);
  const candleSeries = useRef(null);
  const volumeSeries = useRef(null);

  const [candles, setCandles] = useState(makeInitialCandles);
  const [balance, setBalance] = useState(1000);
  const [position, setPosition] = useState(null);
  const [analysis, setAnalysis] = useState("Нажмите BUY или SELL, чтобы открыть учебную сделку.");
  const [lang, setLang] = useState("RU");

  useEffect(() => {
    const chart = createChart(chartRef.current, {
      layout: { background: { color: "#0b1020" }, textColor: "#cbd5e1" },
      grid: { vertLines: { color: "#172033" }, horzLines: { color: "#172033" } },
      width: chartRef.current.clientWidth,
      height: 380,
      rightPriceScale: { borderColor: "#334155" },
      timeScale: { borderColor: "#334155" },
    });

    candleSeries.current = chart.addSeries(CandlestickSeries, {
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderVisible: false,
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
    });

    volumeSeries.current = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "",
    });

    candleSeries.current.setData(candles);
    volumeSeries.current.setData(candles.map(c => ({
      time: c.time,
      value: Math.floor(200 + Math.random() * 900),
      color: c.close >= c.open ? "rgba(34,197,94,.35)" : "rgba(239,68,68,.35)"
    })));

    const resize = () => chart.applyOptions({ width: chartRef.current.clientWidth });
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCandles(prev => {
        const bias = Math.sin(Date.now() / 9000) * 0.06;
        const newCandle = nextCandle(prev[prev.length - 1], bias);
        const updated = [...prev.slice(-90), newCandle];
        candleSeries.current?.update(newCandle);
        volumeSeries.current?.update({
          time: newCandle.time,
          value: Math.floor(200 + Math.random() * 900),
          color: newCandle.close >= newCandle.open ? "rgba(34,197,94,.35)" : "rgba(239,68,68,.35)"
        });
        if (position) {
          setAnalysis(analyzeTrade(position.side, position.entry, newCandle.close));
        }
        return updated;
      });
    }, 1400);
    return () => clearInterval(timer);
  }, [position]);

  const price = candles[candles.length - 1].close;

  function openTrade(side) {
    setPosition({ side, entry: price });
    setAnalysis(`Открыта учебная сделка ${side} по цене ${price}. AI ждёт следующие свечи для анализа.`);
  }

  function closeTrade() {
    if (!position) return;
    const diff = position.side === "BUY" ? price - position.entry : position.entry - price;
    setBalance(b => Number((b + diff * 10).toFixed(2)));
    setAnalysis(analyzeTrade(position.side, position.entry, price) + " Сделка закрыта.");
    setPosition(null);
  }

  return (
    <main className="app">
      <section className="hero">
        <div>
          <p className="badge"><ShieldCheck size={16}/> Training only · No real money gambling</p>
          <h1>AncientTrade AI</h1>
          <p className="subtitle">AI Trading Simulator для Telegram Mini App</p>
        </div>
        <select value={lang} onChange={e => setLang(e.target.value)}>
          <option>RU</option>
          <option>EN</option>
          <option>KA</option>
        </select>
      </section>

      <section className="stats">
        <div><span>Balance</span><b>${balance}</b></div>
        <div><span>Price</span><b>{price}</b></div>
        <div><span>Position</span><b>{position ? `${position.side} @ ${position.entry}` : "None"}</b></div>
      </section>

      <section className="terminal">
        <div ref={chartRef} className="chart" />
      </section>

      <section className="actions">
        <button className="buy" onClick={() => openTrade("BUY")}><TrendingUp/> BUY</button>
        <button className="sell" onClick={() => openTrade("SELL")}><TrendingDown/> SELL</button>
        <button className="close" onClick={closeTrade}>CLOSE</button>
      </section>

      <section className="ai">
        <h2><Brain/> AI Analysis</h2>
        <p>{analysis}</p>
      </section>
    </main>
  );
}
