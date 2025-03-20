import { useState } from "react";

interface BidFormProps {
  productId: string;
  onBidSubmit: (productId: string, bidderName: string, bidAmount: number) => void;
}

const BidForm: React.FC<BidFormProps> = ({ productId, onBidSubmit }) => {
  const [bidderName, setBidderName] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!bidderName || !bidAmount) {
      setError("Please fill in all fields before submitting.");
      return;
    }

    const bidAmountNumber = parseFloat(bidAmount);
    if (isNaN(bidAmountNumber) || bidAmountNumber <= 0) {
      setError("Bid amount must be a positive number.");
      return;
    }

    // Clear error and submit bid
    setError(null);
    onBidSubmit(productId, bidderName, bidAmountNumber);
    setBidderName("");
    setBidAmount("");
  };

  return (
    <form className="bid-form" onSubmit={handleSubmit}>
      {error && <p className="error-message">{error}</p>}
      <label htmlFor="bidderName">Your Full Name</label>
      <input
        id="bidderName"
        type="text"
        placeholder="Your Full Name"
        value={bidderName}
        onChange={(e) => setBidderName(e.target.value)}
        required
      />
      <label htmlFor="bidAmount">Your Bid (€)</label>
      <input
        id="bidAmount"
        type="number"
        placeholder="Your Bid (€)"
        value={bidAmount}
        onChange={(e) => setBidAmount(e.target.value)}
        required
      />
      <button type="submit">Submit Bid</button>
    </form>
  );
};

export default BidForm;
