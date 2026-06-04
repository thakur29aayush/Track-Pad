import ProductCard from "../common/ProductCard";

const ProductGrid = ({ products }) => {
  if (!products.length) return <p>No products found.</p>;

  return (
    <div className="grid grid-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;