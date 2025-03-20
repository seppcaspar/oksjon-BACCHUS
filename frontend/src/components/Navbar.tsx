import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Fetch categories from the API
  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL || "http://localhost:4000/auctions"
      );

      if (response.data && Array.isArray(response.data)) {
        // Filter out auctions that have already ended
        const activeAuctions = response.data.filter(
          (auction) => new Date(auction.biddingEndDate) > new Date()
        );

        // Get unique categories from active auctions only
        const uniqueCategories = [
          ...new Set(activeAuctions.map((item) => item.productCategory)),
        ];

        setCategories(uniqueCategories);
      } else {
        console.error("Invalid API response:", response.data);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".dropdown")) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [dropdownOpen]);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-links">
          <Link to="/" className="nav-link">
            All Auctions
          </Link>

          {/* Dropdown Menu */}
          <div
            className="dropdown"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering outside click handler
              setDropdownOpen(!dropdownOpen);
            }}
          >
            <button className="dropdown-btn">Categories ▼</button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <Link
                      key={category}
                      to={`/category/${category}`}
                      className="dropdown-item"
                    >
                      {category}
                    </Link>
                  ))
                ) : (
                  <p className="dropdown-item">No active categories</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
