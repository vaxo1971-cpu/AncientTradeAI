import React from "react";

export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050816",
        color: "white",
        fontFamily: "Arial",
        padding: "30px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "42px",
          marginBottom: "10px",
        }}
      >
        AncientTrade AI
      </h1>

      <p
        style={{
          textAlign: "center",
          color: "#8fa3c7",
          marginBottom: "40px",
        }}
      >
        AI Trading Simulator • Crypto Market • Strategy Mode
      </p>

      <div
        style={{
          background: "#111827",
          borderRadius: "20px",
          padding: "30px",
          maxWidth: "700px",
          margin: "0 auto",
          boxShadow: "0 0 25px rgba(0,255,255,0.15)",
        }}
      >
        <h2>BTC / USDT</h2>

        <div
          style={{
            height: "220px",
            background:
              "linear-gradient(180deg,#13203a,#0b1020)",
            borderRadius: "15px",
            marginTop: "20px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#4ade80",
            fontSize: "24px",
          }}
        >
          📈 LIVE MARKET CHART
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "25px",
          }}
        >
          <div>
            <p>AI Prediction</p>
            <h3 style={{ color: "#4ade80" }}>UP TREND</h3>
          </div>

          <div>
            <p>Confidence</p>
            <h3>82%</h3>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "15px",
          }}
        >
          <button
            style={{
              flex: 1,
              padding: "16px",
              background: "#16a34a",
              border: "none",
              borderRadius: "14px",
              color: "white",
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            BUY
          </button>

          <button
            style={{
              flex: 1,
              padding: "16px",
              background: "#dc2626",
              border: "none",
              borderRadius: "14px",
              color: "white",
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            SELL
          </button>
        </div>
      </div>
    </div>
  );
}
