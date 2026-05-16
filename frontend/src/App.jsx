import React from "react";

export default function App() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b1020",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        fontFamily: "Arial",
      }}
    >
      <h1>AncientTrade AI</h1>
      <p>AI Trading Simulator работает успешно 🚀</p>

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          gap: "10px",
        }}
      >
        <button
          style={{
            padding: "12px 20px",
            background: "green",
            border: "none",
            color: "white",
            borderRadius: "10px",
          }}
        >
          BUY
        </button>

        <button
          style={{
            padding: "12px 20px",
            background: "red",
            border: "none",
            color: "white",
            borderRadius: "10px",
          }}
        >
          SELL
        </button>
      </div>
    </main>
  );
}
