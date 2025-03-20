import React, { useState, useEffect } from "react";
import axios from "axios";
import BidForm from "./BidForm";

interface Auction {
  productId: string;
  productName: string;
  productCategory: string;
  productDescription: string;
  biddingEndDate: string;
}

interface AuctionListProps {
  category?: string;
}

const AuctionList: React.FC<AuctionListProps> = ({ category }) => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const url = category
          ? `http://localhost:4000/auctions/${category}`
          : "http://localhost:4000/auctions";
        const response = await axios.get(url);
        setAuctions(response.data);
      } catch (err) {
        console.error("Failed to fetch auctions:", err);
        setError("Failed to load auctions. Please try again later.");
      }
    };

    fetchAuctions();
  }, [category]);

  const handleBid = async (productId: string, bidderName: string, bidAmount: number) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`http://localhost:4000/bids`, {
        productId,
        bidderName,
        bidAmount,
      });
      if (response.status === 200) {
        setMessage("Bid successfully submitted!");
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      console.error("Bid submission failed:", err);
      setError("Failed to submit bid. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}
      {isSubmitting && <p className="loading-message">Submitting your bid...</p>}

      {auctions.length === 0 && !error ? (
        <p>No auctions available at the moment.</p>
      ) : (
        auctions.map((auction) => (
          <div key={auction.productId} className="auction-item">
            <h2>{auction.productName}</h2>
            <p>Category: {auction.productCategory}</p>
            <p>Ends at: {new Date(auction.biddingEndDate).toLocaleString()}</p>
            <p>Description: {auction.productDescription}</p>
            <BidForm productId={auction.productId} onBidSubmit={handleBid} />
          </div>
        ))
      )}
    </div>
  );
};

export default AuctionList;