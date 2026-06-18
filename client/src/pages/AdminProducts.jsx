import { useEffect, useMemo, useState } from "react";
import {
  Edit3,
  Package,
  Plus,
  RefreshCw,
  Search,
  Tag,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react";
import ProductForm from "../components/admin/ProductForm";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "../services/adminApi";
import { getProducts } from "../services/productApi";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const getImageUrl = (image) => {
  if (!image) return "";
  if (image.startsWith("http")) return image;
  return `${API_URL}${image}`;
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("Loading products...");
  const [query, setQuery] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

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

  const handleSubmit = async (payload) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, payload);
      setEditingProduct(null);
    } else {
      await createProduct(payload);
    }

    await load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Disable this product?")) return;

    try {
      setDeletingId(id);
      await deleteProduct(id);
      await load();
    } finally {
      setDeletingId("");
    }
  };

  const filteredProducts = useMemo(() => {
    const clean = query.toLowerCase().trim();

    if (!clean) return products;

    return products.filter(
      (p) =>
        p.title?.toLowerCase().includes(clean) ||
        p.type?.toLowerCase().includes(clean) ||
        p.deliveryType?.toLowerCase().includes(clean)
    );
  }, [products, query]);

  const stats = useMemo(() => {
    const types = [...new Set(products.map((p) => p.type).filter(Boolean))];

    return {
      total: products.length,
      types: types.length,
    };
  }, [products]);

  return (
    <section className="admin-products-page">
      <header className="admin-products-header">
        <div>
          <p className="eyebrow">
            <Package size={13} /> Admin Products
          </p>

          <h1>
            Product <span>Manager</span>
          </h1>

          <p>
            Add, edit, manage, and disable digital products, templates, files,
            and booking-based offers.
          </p>
        </div>

        <div className="header-stats">
          <div className="header-stat">
            <TrendingUp size={15} className="hstat-icon" />
            <div>
              <strong>{stats.total}</strong>
              <span>Active Products</span>
            </div>
          </div>

          <div className="header-stat">
            <Tag size={15} className="hstat-icon" />
            <div>
              <strong>{stats.types}</strong>
              <span>Categories</span>
            </div>
          </div>
        </div>
      </header>

      <div className="admin-products-layout">
        <div className="products-table-panel">
          <div className="products-toolbar">
            <div>
              <h2>
                <Package size={15} /> Products
              </h2>

              <p>
                {status ||
                  `${filteredProducts.length} product${
                    filteredProducts.length !== 1 ? "s" : ""
                  } listed`}
              </p>
            </div>

            <div className="toolbar-actions">
              <div className="product-search">
                <Search size={14} />

                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products…"
                />
              </div>

              <button type="button" className="refresh-btn" onClick={load}>
                <RefreshCw size={14} />
              </button>
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
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className={
                      editingProduct?.id === product.id ? "editing-row" : ""
                    }
                  >
                    <td>
                      <div className="product-cell">
                        <div className="product-thumb">
                          {product.thumbnail ? (
                            <img
                              src={getImageUrl(product.thumbnail)}
                              alt={product.title}
                            />
                          ) : (
                            <span>{product.title?.slice(0, 1) || "P"}</span>
                          )}
                        </div>

                        <div className="product-info">
                          <strong>{product.title || "Untitled product"}</strong>
                          <small>{product.slug || "no-slug"}</small>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="price-val">
                        ₹{Number(product.price || 0).toLocaleString("en-IN")}
                      </span>
                    </td>

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
                      <div className="action-buttons">
                        <button
                          type="button"
                          className="edit-btn"
                          title="Edit product"
                          onClick={() => {
                            setEditingProduct(product);
                            document
                              .querySelector(".product-form-panel")
                              ?.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                              });
                          }}
                        >
                          <Edit3 size={14} />
                        </button>

                        <button
                          type="button"
                          className="disable-btn"
                          title="Disable product"
                          disabled={deletingId === product.id}
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {!filteredProducts.length && !status && (
                  <tr>
                    <td colSpan="5">
                      <div className="empty-row">
                        <Package size={26} />
                        No products found.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="product-form-panel">
          <div className="panel-head">
            <h2>
              {editingProduct ? <Edit3 size={15} /> : <Plus size={15} />}
              {editingProduct ? "Edit Product" : "Add Product"}
            </h2>

            <p>
              {editingProduct
                ? "Update this product, including thumbnail and tutorial image."
                : "Create a new product for the store."}
            </p>

            {editingProduct && (
              <button
                type="button"
                className="cancel-edit-btn"
                onClick={() => setEditingProduct(null)}
              >
                <X size={13} />
                Cancel edit
              </button>
            )}
          </div>

          <ProductForm
            key={editingProduct?.id || "create-product"}
            product={editingProduct}
            onSubmit={handleSubmit}
            submitLabel={editingProduct ? "Update Product" : "Create Product"}
          />
        </div>
      </div>

      <style>{`
        .admin-products-page {
          padding: 18px 0 42px;
          font-family: Inter, "DM Sans", system-ui, sans-serif;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .admin-products-header {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: end;
          gap: 16px;
          padding: 22px;
          border-radius: 22px;
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin: 0 0 8px;
          padding: 4px 10px;
          border-radius: 999px;
          background: rgba(22,163,74,0.12);
          color: #16a34a;
          border: 1px solid rgba(22,163,74,0.2);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.1em;
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

        .admin-products-header > div > p {
          max-width: 570px;
          margin: 8px 0 0;
          color: var(--muted);
          font-size: 0.86rem;
          line-height: 1.55;
        }

        .header-stats {
          display: flex;
          gap: 8px;
        }

        .header-stat {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 11px 14px;
          border-radius: 14px;
          background: var(--bg);
          border: 1px solid var(--border);
        }

        .hstat-icon {
          color: #16a34a;
        }

        .header-stat strong {
          display: block;
          color: #16a34a;
          font-size: 1.2rem;
          font-weight: 950;
          letter-spacing: -0.04em;
          line-height: 1;
        }

        .header-stat span {
          display: block;
          margin-top: 3px;
          color: var(--muted);
          font-size: 0.68rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .admin-products-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          align-items: start;
        }

        .product-form-panel,
        .products-table-panel {
          width: 100%;
          border-radius: 20px;
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
          overflow: hidden;
        }

        .product-form-panel {
          padding: 18px;
          overflow: visible;
        }

        .panel-head {
          margin-bottom: 14px;
        }

        .panel-head h2,
        .products-toolbar h2 {
          display: flex;
          align-items: center;
          gap: 7px;
          margin: 0;
          color: var(--text);
          font-size: 1rem;
          font-weight: 900;
        }

        .panel-head h2 svg,
        .products-toolbar h2 svg {
          color: #16a34a;
        }

        .panel-head p,
        .products-toolbar p {
          margin: 4px 0 0;
          color: var(--muted);
          font-size: 0.78rem;
          font-weight: 700;
        }

        .cancel-edit-btn {
          margin-top: 10px;
          height: 34px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 0 11px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: var(--bg);
          color: var(--muted);
          cursor: pointer;
          font-size: 0.76rem;
          font-weight: 850;
        }

        .cancel-edit-btn:hover {
          color: #ef4444;
          border-color: rgba(239,68,68,0.35);
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
          width: min(280px, 100%);
          height: 38px;
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 0 11px;
          border-radius: 11px;
          background: var(--bg);
          border: 1px solid var(--border);
          color: #16a34a;
        }

        .product-search input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: var(--text);
          font-size: 0.81rem;
          font-weight: 700;
        }

        .refresh-btn {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          border: 1px solid var(--border);
          background: var(--bg);
          color: var(--text);
          cursor: pointer;
          flex-shrink: 0;
        }

        .admin-products-table-wrap {
          width: 100%;
          overflow-x: auto;
        }

        .products-table-panel table {
          width: 100%;
          min-width: 760px;
          border-collapse: collapse;
        }

        .products-table-panel th,
        .products-table-panel td {
          padding: 11px 14px;
          border-bottom: 1px solid var(--border);
          text-align: left;
          font-size: 0.8rem;
          vertical-align: middle;
        }

        .products-table-panel th {
          color: var(--muted);
          background: rgba(22,163,74,0.04);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .editing-row {
          background: rgba(22,163,74,0.06);
        }

        .product-cell {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 260px;
          max-width: 520px;
        }

        .product-thumb {
          width: 52px;
          height: 52px;
          overflow: hidden;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 13px;
          background: rgba(22,163,74,0.12);
          color: #16a34a;
          font-size: 0.9rem;
          font-weight: 950;
        }

        .product-thumb img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        .product-info {
          min-width: 0;
        }

        .product-cell strong {
          display: block;
          color: var(--text);
          font-size: 0.84rem;
          font-weight: 800;
          line-height: 1.2;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .product-cell small {
          display: block;
          margin-top: 3px;
          color: var(--muted);
          font-size: 0.7rem;
          font-family: monospace;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .price-val {
          font-size: 0.88rem;
          font-weight: 900;
          color: #16a34a;
          white-space: nowrap;
        }

        .type-pill {
          display: inline-flex;
          padding: 4px 9px;
          border-radius: 999px;
          background: rgba(22,163,74,0.1);
          color: #16a34a;
          border: 1px solid rgba(22,163,74,0.18);
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          white-space: nowrap;
        }

        .delivery-text {
          color: var(--muted);
          font-size: 0.8rem;
          font-weight: 800;
          white-space: nowrap;
        }

        .action-buttons {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .edit-btn,
        .disable-btn {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          border: 0;
          cursor: pointer;
        }

        .edit-btn {
          background: rgba(22,163,74,0.1);
          color: #16a34a;
        }

        .disable-btn {
          background: rgba(239,68,68,0.1);
          color: #ef4444;
        }

        .edit-btn:hover,
        .disable-btn:hover {
          opacity: 0.82;
          transform: scale(1.05);
        }

        .disable-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: none;
        }

        .empty-row {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 28px;
          text-align: center;
          color: var(--muted);
          font-size: 0.84rem;
          font-weight: 800;
        }

        .empty-row svg {
          opacity: 0.3;
        }

        @media (max-width: 760px) {
          .admin-products-header {
            grid-template-columns: 1fr;
            padding: 18px;
          }

          .header-stats {
            flex-direction: column;
          }

          .header-stat {
            width: 100%;
          }

          .products-toolbar {
            flex-direction: column;
            align-items: stretch;
          }

          .toolbar-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .product-search {
            width: 100%;
          }

          .refresh-btn {
            width: 100%;
          }

          .products-table-panel table {
            min-width: 680px;
          }

          .product-cell {
            min-width: 220px;
          }
        }

        @media (max-width: 520px) {
          .product-form-panel {
            padding: 14px;
          }

          .product-thumb {
            width: 46px;
            height: 46px;
          }
        }
      `}</style>
    </section>
  );
};

export default AdminProducts;