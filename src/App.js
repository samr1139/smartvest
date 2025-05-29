import React, { useState } from "react";
import "./App.css";  // Import your SmartVest CSS

function App() {
  const [amount, setAmount] = useState("");
  const [risk, setRisk] = useState("Medium");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRecommendations([]);
    setError("");

    try {
      const response = await fetch("http://localhost:3001/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount), risk }),
      });

      const data = await response.json();

      if (response.ok) {
        setRecommendations(data.recommendations);
      } else {
        setError(data.error || "Failed to fetch recommendations.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h1 className="title">SmartVest</h1>
      <form onSubmit={handleSubmit} className="input-section">
        <label htmlFor="amount">Investment Amount</label>
        <input
          id="amount"
          className="input"
          type="number"
          placeholder="e.g. 1000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <label htmlFor="risk">Risk Level</label>
        <input
          id="risk"
          type="range"
          min="1"
          max="3"
          step="1"
          value={risk === "Low" ? 1 : risk === "Medium" ? 2 : 3}
          onChange={(e) => {
            const val = Number(e.target.value);
            setRisk(val === 1 ? "Low" : val === 2 ? "Medium" : "High");
          }}
          className="range"
        />
        <div className="risk-labels">
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
        </div>

        <button type="submit" className="button" disabled={loading}>
          {loading ? "Loading..." : "Get Recommendations"}
        </button>
      </form>

      {error && <p style={{ color: "#f87171", marginTop: "1rem", textAlign: "center" }}>{error}</p>}

      <div className="recommendations">
        {recommendations.map((rec, index) => (
          <div key={index} className="recommendation">
            <div className="rec-name">{rec.name}</div>
            <div className="rec-reason">{rec.reason}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
