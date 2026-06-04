import { useEffect, useState } from "react";
import { getProducts } from "../services/productApi";
import ProductGrid from "../components/products/ProductGrid";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("Loading products...");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
        setStatus("");
      } catch {
        setStatus("Failed to load products.");
      }
    };

    load();
  }, []);

  return (
    <section>
      <h1>Products</h1>
      <p>Scalable digital products. Because apparently productivity needs a shop.</p>

      {status && <p>{status}</p>}
      <ProductGrid products={products} />
    </section>
  );
};

export default Products;