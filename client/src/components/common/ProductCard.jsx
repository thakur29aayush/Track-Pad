import { Link } from "react-router-dom";
import Button from "./Button";

const ProductCard = ({ product }) => {
  return (
    <div className="card">
      {product.thumbnail ? (
        <img src={product.thumbnail} alt={product.title} className="product-img" />
      ) : (
        <div className="product-img" />
      )}

      <p className="badge">{product.type.replaceAll("_", " ")}</p>
      <h3>{product.title}</h3>
      <p>{product.description}</p>
      <h2>₹{product.price}</h2>

      <Link to={`/products/${product.slug}`}>
        <Button>View Product</Button>
      </Link>
    </div>
  );
};

export default ProductCard;