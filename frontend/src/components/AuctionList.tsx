import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import BidForm from "./BidForm.tsx";

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [countdowns, setCountdowns] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch auctions from the API
  const fetchAuctions = useCallback(async () => {
    try {
      const url = category
        ? `http://localhost:4000/auctions/${category}`
        : "http://localhost:4000/auctions";

      const response = await axios.get(url);
      const sortedAuctions = response.data.sort(
        (a: Auction, b: Auction) => new Date(a.biddingEndDate).getTime() - new Date(b.biddingEndDate).getTime()
      );
      setAuctions(sortedAuctions);
    } catch (err) {
      console.error("Error fetching auctions:", err);
      setError("Could not load auctions. Please try again later.");
    }
  }, [category]);

  useEffect(() => {
    fetchAuctions();
  }, [fetchAuctions]);

  // Update countdowns for auctions
useEffect(() => {
    const updateCountdowns = () => {
        const newCountdowns: Record<string, string> = {};
        const filteredAuctions: Auction[] = [];
        auctions.forEach((auction) => {
            const timeLeft = new Date(auction.biddingEndDate).getTime() - new Date().getTime();
            if (timeLeft > 0) {
                const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
                newCountdowns[auction.productId] = `${days}d ${hours}h ${minutes}m ${seconds}s`;
                filteredAuctions.push(auction);
            } else {
                newCountdowns[auction.productId] = "Expired";
            }
        });
        setCountdowns(newCountdowns);
        setAuctions(filteredAuctions);
    };

    const interval = setInterval(updateCountdowns, 1000);
    return () => clearInterval(interval);
  }, [auctions]);

  // Handle bid submission
  const handleBidSubmit = async (productId: string, bidderName: string, bidAmount: number) => {
    setIsSubmitting(true);
    try {
      await axios.post("http://localhost:4000/bids", {
        productId,
        bidderName,
        bidAmount,
      });
      alert("Bid submitted successfully!");
      fetchAuctions(); // Refresh auctions after a successful bid
    } catch (error) {
      console.error("Error submitting bid:", error);
      alert("Failed to submit bid. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pagination Logic
  const indexOfLastAuction = currentPage * itemsPerPage;
  const indexOfFirstAuction = indexOfLastAuction - itemsPerPage;
  const currentAuctions = auctions.slice(indexOfFirstAuction, indexOfLastAuction);
  const totalPages = Math.ceil(auctions.length / itemsPerPage);

  return (
    <div>
      {error && <p className="error-message">{error}</p>}
      <div className="auction-container">
        {currentAuctions.length > 0 ? (
          currentAuctions.map((auction) => (
            <div
              key={auction.productId}
              className={`auction-item ${countdowns[auction.productId] === "Expired" ? "expired" : ""}`}
            >
              <h2>{auction.productName}</h2>
              <p>Category: {auction.productCategory}</p>
              <p>Time Left: {countdowns[auction.productId] || "Calculating..."}</p>
              <p>{auction.productDescription}</p>
              {countdowns[auction.productId] !== "Expired" && (
                <BidForm productId={auction.productId} onBidSubmit={handleBidSubmit} />
              )}
            </div>
          ))
        ) : (
          <p>No active auctions available.</p>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`page-button ${currentPage === index + 1 ? "active" : ""}`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}

      {/* Loading Indicator */}
      {isSubmitting && <p className="loading-message">Submitting your bid...</p>}
    </div>
  );
};

export default AuctionList;