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

// Load bids from JSON file
const getBidsData = () => {
    if (!fs.existsSync(db)) return [];
    const data = fs.readFileSync(db, "utf8");
    return JSON.parse(data);
  };
  
  // Save bids to JSON file
  const saveBidsData = (bids) => {
    fs.writeFileSync(db, JSON.stringify(bids, null, 2), "utf8");
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

// 🚀 API to submit a bid
app.post("/bids", (req, res) => {
    try {
      const { productId, bidderName, bidAmount } = req.body;
  
      // Validate data
      if (!productId || !bidderName || !bidAmount) {
        console.error("Missing fields:", req.body);
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      // Create bid object
      const newBid = {
        productId,
        bidderName,
        bidAmount: parseFloat(bidAmount),
        bidTimestamp: new Date().toISOString(),
      };
  
      // Load existing bids
      const bids = getBidsData();
      bids.push(newBid);
  
      // Save to file
      saveBidsData(bids);
  
      console.log("New bid saved:", newBid);
      res.status(201).json({ message: "Bid submitted successfully!", bid: newBid });
    } catch (error) {
      console.error("Error saving bid:", error);
      res.status(500).json({ error: "Could not save bid" });
    }
  });

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
