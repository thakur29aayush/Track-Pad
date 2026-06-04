import { useEffect, useMemo, useState } from "react";
import { Package, Plus, RefreshCw, Search } from "lucide-react";
import ProductForm from "../components/admin/ProductForm";
import Button from "../components/common/Button";
import { createProduct, deleteProduct } from "../services/adminApi";
import { getProducts } from "../services/productApi";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("Loading products...");
  const [query, setQuery] = useState("");

  const load = async () => {
    try {
      setStatus("Loading products...");
      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : []);
      setStatus("");
    } catch {
      setProducts([]);
      setStatus("Failed to load products.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (payload) => {
    await createProduct(payload);
    await load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Disable this product?")) return;

    await deleteProduct(id);
    await load();
  };

  const filteredProducts = useMemo(() => {
    const clean = query.toLowerCase().trim();

    if (!clean) return products;

    return products.filter((product) => {
      const title = product.title?.toLowerCase() || "";
      const type = product.type?.toLowerCase() || "";
      const delivery = product.deliveryType?.toLowerCase() || "";

      return (
        title.includes(clean) ||
        type.includes(clean) ||
        delivery.includes(clean)
      );
    });
  }, [products, query]);

  return (
    <section className="admin-products-page">
      <header className="admin-products-header">
        <div>
          <p className="admin-products-eyebrow">
            <Package size={13} />
            Admin Products
          </p>

          <h1>
            Product <span>Manager</span>
          </h1>

          <p>
            Add, manage, and disable digital products, templates, files, and
            booking-based offers.
          </p>
        </div>

        <div className="admin-products-summary">
          <strong>{products.length}</strong>
          <span>active products</span>
        </div>
      </header>

      <div className="admin-products-layout">
        <div className="product-form-panel">
          <div className="panel-head">
            <h2>
              <Plus size={16} />
              Add Product
            </h2>
            <p>Create a new product for the store.</p>
          </div>

          <ProductForm onSubmit={handleCreate} />
        </div>

        <div className="products-table-panel">
          <div className="products-toolbar">
            <div>
              <h2>Products</h2>
              <p>{status || `${filteredProducts.length} products listed`}</p>
            </div>

            <div className="toolbar-actions">
              <div className="product-search">
                <Search size={15} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products"
                />
              </div>

              <Button variant="outline" onClick={load}>
                <RefreshCw size={14} />
                Refresh
              </Button>
            </div>
          </div>

          <div className="admin-products-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Type</th>
                  <th>Delivery</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="product-cell">
                        <div className="product-thumb">
                          {product.thumbnail ? (
                            <img src={product.thumbnail} alt={product.title} />
                          ) : (
                            <span>{product.title?.slice(0, 1) || "P"}</span>
                          )}
                        </div>

                        <div>
                          <strong>{product.title || "Untitled product"}</strong>
                          <small>{product.slug || "no-slug"}</small>
                        </div>
                      </div>
                    </td>

                    <td>₹{Number(product.price || 0).toLocaleString("en-IN")}</td>

                    <td>
                      <span className="type-pill">
                        {product.type?.replaceAll("_", " ") || "Product"}
                      </span>
                    </td>

                    <td>
                      <span className="delivery-text">
                        {product.deliveryType?.replaceAll("_", " ") || "N/A"}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="disable-btn"
                        onClick={() => handleDelete(product.id)}
                      >
                        Disable
                      </button>
                    </td>
                  </tr>
                ))}

                {!filteredProducts.length && !status && (
                  <tr>
                    <td colSpan="5">
                      <div className="empty-products-row">
                        No products found.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        .admin-products-page {
          padding: 18px 0 42px;
          font-family: Inter, "DM Sans", system-ui, sans-serif;
        }

        .admin-products-header {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: end;
          gap: 16px;
          margin-bottom: 14px;
          padding: 20px;
          border-radius: 22px;
          background:
            linear-gradient(135deg, rgba(22, 163, 74, 0.1), rgba(245, 216, 0, 0.045)),
            var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
        }

        .admin-products-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin: 0 0 8px;
          padding: 5px 8px;
          border-radius: 999px;
          background: rgba(22, 163, 74, 0.12);
          color: #16a34a;
          border: 1px solid rgba(22, 163, 74, 0.18);
          font-size: 0.62rem;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .admin-products-header h1 {
          margin: 0;
          color: var(--text);
          font-size: clamp(1.9rem, 3.8vw, 3rem);
          line-height: 1;
          letter-spacing: -0.055em;
          font-weight: 950;
        }

        .admin-products-header h1 span {
          background: linear-gradient(120deg, #16a34a, #d6b300);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .admin-products-header p {
          max-width: 570px;
          margin: 8px 0 0;
          color: var(--muted);
          font-size: 0.86rem;
          line-height: 1.55;
        }

        .admin-products-summary {
          min-width: 128px;
          padding: 13px;
          border-radius: 16px;
          background: var(--bg);
          border: 1px solid var(--border);
          text-align: right;
        }

        .admin-products-summary strong {
          display: block;
          color: #16a34a;
          font-size: 1.35rem;
          line-height: 1;
          letter-spacing: -0.045em;
        }

        .admin-products-summary span {
          display: block;
          margin-top: 5px;
          color: var(--muted);
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .admin-products-layout {
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: 14px;
          align-items: start;
        }

        .product-form-panel,
        .products-table-panel {
          border-radius: 20px;
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
          overflow: hidden;
        }

        .product-form-panel {
          padding: 16px;
        }

        .panel-head {
          margin-bottom: 12px;
        }

        .panel-head h2,
        .products-toolbar h2 {
          display: flex;
          align-items: center;
          gap: 7px;
          margin: 0;
          color: var(--text);
          font-size: 1.08rem;
          letter-spacing: -0.03em;
        }

        .panel-head p,
        .products-toolbar p {
          margin: 4px 0 0;
          color: var(--muted);
          font-size: 0.8rem;
          font-weight: 700;
        }

        .products-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border-bottom: 1px solid var(--border);
        }

        .toolbar-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .product-search {
          width: 210px;
          height: 40px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 11px;
          border-radius: 13px;
          background: var(--bg);
          border: 1px solid var(--border);
          color: #16a34a;
        }

        .product-search:focus-within {
          border-color: rgba(22, 163, 74, 0.55);
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.09);
        }

        .product-search input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: var(--text);
          font-size: 0.82rem;
          font-weight: 700;
        }

        .toolbar-actions .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 9px 12px;
          font-size: 0.8rem;
          white-space: nowrap;
        }

        .admin-products-table-wrap {
          overflow-x: auto;
        }

        .products-table-panel table {
          width: 100%;
          min-width: 720px;
          border-collapse: collapse;
        }

        .products-table-panel th,
        .products-table-panel td {
          padding: 11px 14px;
          border-bottom: 1px solid var(--border);
          text-align: left;
          font-size: 0.82rem;
          vertical-align: middle;
        }

        .products-table-panel th {
          color: var(--muted);
          background: rgba(22, 163, 74, 0.045);
          font-size: 0.66rem;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .products-table-panel tr:last-child td {
          border-bottom: none;
        }

        .products-table-panel tbody tr {
          transition: background 0.18s ease;
        }

        .products-table-panel tbody tr:hover {
          background: rgba(22, 163, 74, 0.03);
        }

        .product-cell {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 220px;
        }

        .product-thumb {
          width: 36px;
          height: 36px;
          overflow: hidden;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 12px;
          background: rgba(22, 163, 74, 0.12);
          color: #16a34a;
          font-size: 0.9rem;
          font-weight: 950;
        }

        .product-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .product-cell strong {
          display: block;
          color: var(--text);
          font-size: 0.86rem;
          line-height: 1.2;
        }

        .product-cell small {
          display: block;
          margin-top: 3px;
          color: var(--muted);
          font-size: 0.7rem;
        }

        .type-pill {
          display: inline-flex;
          padding: 5px 8px;
          border-radius: 999px;
          background: rgba(22, 163, 74, 0.1);
          color: #16a34a;
          font-size: 0.66rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          white-space: nowrap;
        }

        .delivery-text {
          color: var(--muted);
          font-size: 0.8rem;
          font-weight: 800;
          white-space: nowrap;
        }

        .disable-btn {
          padding: 7px 10px;
          border-radius: 999px;
          border: 1px solid rgba(220, 38, 38, 0.25);
          background: rgba(220, 38, 38, 0.09);
          color: var(--danger);
          cursor: pointer;
          font-size: 0.74rem;
          font-weight: 900;
        }

        .empty-products-row {
          padding: 22px;
          text-align: center;
          color: var(--muted);
          font-size: 0.84rem;
          font-weight: 800;
        }

        @media (max-width: 1100px) {
          .admin-products-layout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 760px) {
          .admin-products-page {
            padding-top: 10px;
          }

          .admin-products-header {
            grid-template-columns: 1fr;
            padding: 18px;
          }

          .admin-products-summary {
            width: 100%;
            text-align: left;
          }

          .products-toolbar {
            align-items: stretch;
            flex-direction: column;
          }

          .toolbar-actions {
            align-items: stretch;
            flex-direction: column;
          }

          .product-search {
            width: 100%;
          }

          .toolbar-actions .btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};

export default AdminProducts;