import { useEffect, useState } from "react";
import ProductForm from "../components/admin/ProductForm";
import Button from "../components/common/Button";
import { createProduct, deleteProduct } from "../services/adminApi";
import { getProducts } from "../services/productApi";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);

  const load = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (payload) => {
    await createProduct(payload);
    await load();
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    await load();
  };

  return (
    <section className="grid">
      <ProductForm onSubmit={handleCreate} />

      <div className="card table-wrap">
        <h2>Products</h2>

        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Type</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.title}</td>
                <td>₹{product.price}</td>
                <td>{product.type}</td>
                <td>
                  <Button variant="danger" onClick={() => handleDelete(product.id)}>
                    Disable
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminProducts;