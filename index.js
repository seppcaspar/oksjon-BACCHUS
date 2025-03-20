const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const url = "./products.json";
const db = "./bids.json";

// Load auction data from JSON file
const getAuctionData = () => {
  const data = fs.readFileSync(url, "utf8");
  return JSON.parse(data);
};


// API to fetch all auctions
app.get("/auctions", (req, res) => {
  try {
    const auctions = getAuctionData();
    res.json(auctions);
  } catch (error) {
    console.error("Error loading auctions:", error);
    res.status(500).json({ error: "Failed to load auctions." });
  }
});

// API to fetch auctions by category
app.get("/auctions/:category", (req, res) => {
  try {
    const category = req.params.category;
    const auctions = getAuctionData();
    const filteredAuctions = auctions.filter(
      (item) => item.productCategory.toLowerCase() === category.toLowerCase()
    );
    res.json(filteredAuctions);
  } catch (error) {
    console.error("Error loading filtered auctions:", error);
    res.status(500).json({ error: "Failed to load filtered auctions." });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
