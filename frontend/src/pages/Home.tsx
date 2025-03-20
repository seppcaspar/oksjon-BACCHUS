import { useState } from "react";
import AuctionList from "../components/AuctionList";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  return (
    <div>
      <h1>Welcome to Bacchus Auction</h1>
      <p>Select a category from the menu or view all auctions below.</p>

      {/* Auction List Component */}
      <AuctionList category={selectedCategory} />
    </div>
  );
};

export default Home;