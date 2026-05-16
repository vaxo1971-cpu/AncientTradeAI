from flask import Flask, jsonify, request
from flask_cors import CORS
from market import generate_candles
from ai_analysis import analyze_trade

app = Flask(__name__)
CORS(app)

@app.get("/api/market")
def market():
    return jsonify(generate_candles())

@app.post("/api/analyze")
def analyze():
    data = request.get_json(force=True)
    return jsonify({
        "analysis": analyze_trade(
            side=data.get("side", "BUY"),
            entry=float(data.get("entry", 100)),
            exit_price=float(data.get("exit", 100))
        )
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
