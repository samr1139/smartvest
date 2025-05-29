// backend/server.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

app.post("/api/recommend", async (req, res) => {
  const { amount, risk } = req.body;

  try {
    const response = await axios.get(
      `https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${FINNHUB_API_KEY}`
    );

    // Simplified example: pick 3 random stocks
    const stocks = response.data.slice(0, 50); // take a smaller sample
    const recommendations = [];

    for (let i = 0; i < 3; i++) {
      const randomStock = stocks[Math.floor(Math.random() * stocks.length)];
      recommendations.push({
        name: `${randomStock.description} (${randomStock.symbol})`,
        reason: `Suitable for your risk level (${risk}). Consider allocating ~\$${(amount / 3).toFixed(
          2
        )}.`,
      });
    }

    res.json({ recommendations });
  } catch (err) {
    console.error("Error fetching from Finnhub:", err.message);
    res.status(500).json({ error: "Failed to fetch data from Finnhub" });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
