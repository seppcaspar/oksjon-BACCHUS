import { useParams } from "react-router-dom";
import AuctionList from "../components/AuctionList";

const Category = () => {
  const { category } = useParams();

  return (
    <div>
      <h1>Category: {category}</h1>
      <AuctionList category={category} />
    </div>
  );
};

export default Category;
