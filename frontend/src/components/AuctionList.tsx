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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const url = category
          ? `http://localhost:4000/auctions/${category}`
          : "http://localhost:4000/auctions";

        const response = await axios.get(url);
        // Sort by soonest ending auction first
        const sortedAuctions = response.data.sort(
          (a: Auction, b: Auction) =>
            new Date(a.biddingEndDate).getTime() - new Date(b.biddingEndDate).getTime()
        );
        setAuctions(sortedAuctions);
      } catch (err) {
        console.error("Error fetching auctions:", err);
        setError("Could not load auctions. Please try again later.");
      }
    };

    fetchAuctions();
  }, [category]);

  const handleBidSubmit = async (productId: string, bidderName: string, bidAmount: number) => {
    try {
      await axios.post("http://localhost:4000/bids", {
        productId,
        bidderName,
        bidAmount,
      });
      alert("Bid submitted successfully!");
    } catch (error) {
      console.error("Error submitting bid:", error);
      alert("Failed to submit bid. Please try again.");
    }
  };

  // Pagination Logic
  const indexOfLastAuction = currentPage * itemsPerPage;
  const indexOfFirstAuction = indexOfLastAuction - itemsPerPage;
  const currentAuctions = auctions.slice(indexOfFirstAuction, indexOfLastAuction);
  const totalPages = Math.ceil(auctions.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      {error && <p className="error-message">{error}</p>}

      <div className="auction-container">
        {currentAuctions.length > 0 ? (
          currentAuctions.map((auction) => (
            <div
              key={auction.productId}
              className={`auction-item ${
                new Date(auction.biddingEndDate) < new Date() ? "expired" : ""
              }`}
            >
              <h2>{auction.productName}</h2>
              <p>Category: {auction.productCategory}</p>
              <p>
                Ends at:{" "}
                {new Date(auction.biddingEndDate) > new Date()
                  ? new Date(auction.biddingEndDate).toLocaleString()
                  : "Expired"}
              </p>
              <p>{auction.productDescription}</p>
              {new Date(auction.biddingEndDate) > new Date() && (
                <BidForm productId={auction.productId} onBidSubmit={handleBidSubmit} />
              )}
            </div>
          ))
        ) : (
          <p>No auctions available at the moment.</p>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`page-button ${currentPage === index + 1 ? "active" : ""}`}
              onClick={() => handlePageChange(index + 1)}
              aria-label={`Go to page ${index + 1}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuctionList;