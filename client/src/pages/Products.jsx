// src/pages/Products.jsx

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowDownAZ,
  Boxes,
  CheckCircle2,
  Filter,
  RotateCcw,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Star,
  X,
  Zap,
} from "lucide-react";
import { getProducts } from "../services/productApi";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const getImageUrl = (thumbnail) => {
  if (!thumbnail) return null;
  if (thumbnail.startsWith("http")) return thumbnail;
  return `${API_URL}${thumbnail}`;
};

const Products = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("Loading products...");
  const [statusError, setStatusError] = useState(false);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("ALL");
  const [priceFilter, setPriceFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("LATEST");

  useEffect(() => {
    const load = async () => {
      try {
        setStatus("Loading products...");
        setStatusError(false);

        const data = await getProducts();
        setProducts(Array.isArray(data) ? data : []);
        setStatus("");
      } catch (error) {
        console.error(error);
        setProducts([]);
        setStatus("Failed to load products.");
        setStatusError(true);
      }
    };

    load();
  }, []);

  const productTypes = useMemo(() => {
    const uniqueTypes = [...new Set(products.map((p) => p.type).filter(Boolean))];
    return ["ALL", ...uniqueTypes];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const cleanQuery = query.toLowerCase().trim();

    let result = products.filter((p) => {
      const price = Number(p.price || 0);

      const matchesQuery =
        !cleanQuery ||
        p.title?.toLowerCase().includes(cleanQuery) ||
        p.description?.toLowerCase().includes(cleanQuery) ||
        p.type?.toLowerCase().includes(cleanQuery) ||
        p.deliveryType?.toLowerCase().includes(cleanQuery);

      const matchesType = type === "ALL" || p.type === type;

      const matchesPrice =
        priceFilter === "ALL" ||
        (priceFilter === "FREE" && price <= 0) ||
        (priceFilter === "PAID" && price > 0);

      return matchesQuery && matchesType && matchesPrice;
    });

    result = [...result].sort((a, b) => {
      const priceA = Number(a.price || 0);
      const priceB = Number(b.price || 0);

      if (sortBy === "PRICE_LOW") return priceA - priceB;
      if (sortBy === "PRICE_HIGH") return priceB - priceA;
      if (sortBy === "TITLE") {
        return String(a.title || "").localeCompare(String(b.title || ""));
      }

      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    return result;
  }, [products, query, type, priceFilter, sortBy]);

  const toggleProduct = (product) => {
    setSelectedProducts((prev) => {
      const exists = prev.some((item) => item.id === product.id);

      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }

      return [...prev, product];
    });
  };

  const handleCheckout = () => {
    if (selectedProducts.length === 0) {
      alert("Select at least one product first.");
      return;
    }

    localStorage.setItem("checkoutProducts", JSON.stringify(selectedProducts));
    navigate("/shop");
  };

  const clearFilters = () => {
    setQuery("");
    setType("ALL");
    setPriceFilter("ALL");
    setSortBy("LATEST");
  };

  const hasFilters =
    query.trim() || type !== "ALL" || priceFilter !== "ALL" || sortBy !== "LATEST";

  return (
    <section className="products-page">
      <header className="products-hero">
        <div>
          <h1>
            Digital products for <span>cleaner routines.</span>
          </h1>

          <p>
            Select one product or multiple products, then checkout together like
            a cart system.
          </p>

          <div className="hero-pills">
            <span>
              <CheckCircle2 size={12} />
              Instant access
            </span>
            <span>
              <Zap size={12} />
              One payment
            </span>
            <span>
              <Star size={12} />
              Multiple products
            </span>
          </div>
        </div>

        <button
          type="button"
          className="checkout-floating-btn"
          onClick={handleCheckout}
          disabled={selectedProducts.length === 0}
        >
          <ShoppingCart size={17} />
          Checkout
          {selectedProducts.length > 0 && <b>{selectedProducts.length}</b>}
        </button>
      </header>

      <div className="catalog-panel">
        <div className="catalog-search">
          <Search size={15} />
          <input
            type="text"
            placeholder="Search templates, planners, trackers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {query && (
            <button type="button" onClick={() => setQuery("")}>
              <X size={12} />
            </button>
          )}
        </div>

        <div className="catalog-filters-row">
          <div className="filter-field">
            <SlidersHorizontal size={14} />
            <select value={type} onChange={(e) => setType(e.target.value)}>
              {productTypes.map((item) => (
                <option key={item} value={item}>
                  {item === "ALL" ? "All Categories" : item.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-field">
            <Filter size={14} />
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            >
              <option value="ALL">All Prices</option>
              <option value="FREE">Free</option>
              <option value="PAID">Paid</option>
            </select>
          </div>

          <div className="filter-field">
            <ArrowDownAZ size={14} />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="LATEST">Latest First</option>
              <option value="PRICE_LOW">Price: Low to High</option>
              <option value="PRICE_HIGH">Price: High to Low</option>
              <option value="TITLE">Title A-Z</option>
            </select>
          </div>

          {hasFilters && (
            <button type="button" className="reset-btn" onClick={clearFilters}>
              <RotateCcw size={13} />
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="catalog-meta">
        {status ? (
          <span className={statusError ? "meta-error" : ""}>{status}</span>
        ) : (
          <span>
            Showing <strong>{filteredProducts.length}</strong> of{" "}
            <strong>{products.length}</strong> products
          </span>
        )}
      </div>

      {!status && filteredProducts.length === 0 ? (
        <div className="empty-products">
          <Boxes size={32} />
          <h3>No matching products found</h3>
          <p>Change filters. Revolutionary, I know.</p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => {
            const selected = selectedProducts.some((p) => p.id === product.id);
            const price = Number(product.price || 0);
            const oldPrice = Math.round(price * 2);
            const imageUrl = getImageUrl(product.thumbnail);

            return (
              <article
                key={product.id}
                className={`product-card ${selected ? "selected" : ""}`}
              >
                <button
                  type="button"
                  className="select-box"
                  onClick={() => toggleProduct(product)}
                >
                  {selected ? "Selected" : "Select"}
                </button>

                <div className="product-image">
                  {imageUrl ? (
                    <img src={imageUrl} alt={product.title} />
                  ) : (
                    <span>{product.title?.[0]?.toUpperCase() || "P"}</span>
                  )}
                </div>

                <div className="product-info">
                  <span className="product-type">
                    {product.type?.replaceAll("_", " ") || "Digital Product"}
                  </span>

                  <h3>{product.title}</h3>

                  <p>{product.description || "No description available."}</p>

                  <div className="price-row">
                    {price > 0 ? (
                      <>
                        <span className="old-price">
                          ₹{oldPrice.toLocaleString("en-IN")}
                        </span>
                        <strong>₹{price.toLocaleString("en-IN")}</strong>
                      </>
                    ) : (
                      <strong>Free</strong>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <style>{`
        .products-page {
          width: min(1120px, 92%);
          margin: 0 auto;
          padding: 18px 0 42px;
          font-family: "Inter", "DM Sans", system-ui, sans-serif;
        }

        .products-hero {
          display: flex;
          justify-content: space-between;
          gap: 24px;
          align-items: center;
          padding: 26px;
          border-radius: 24px;
          background:
            radial-gradient(circle at top right, rgba(34, 197, 94, 0.12), transparent 38%),
            var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
          margin-bottom: 16px;
        }

        .products-hero h1 {
          margin: 0;
          color: var(--text);
          font-size: clamp(1.6rem, 3vw, 2.4rem);
          line-height: 1;
          font-weight: 950;
          letter-spacing: -0.055em;
        }

        .products-hero h1 span {
          background: linear-gradient(120deg, #f5d800, #22c55e);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .products-hero p {
          max-width: 620px;
          margin: 12px 0 0;
          color: var(--muted);
          font-size: 0.92rem;
          line-height: 1.55;
        }

        .hero-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 16px;
        }

        .hero-pills span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 10px;
          border-radius: 999px;
          background: var(--bg);
          border: 1px solid var(--border);
          color: var(--muted);
          font-size: 0.76rem;
          font-weight: 800;
        }

        .hero-pills svg {
          color: #22c55e;
        }

        .checkout-floating-btn {
          min-width: 155px;
          height: 46px;
          border: 0;
          border-radius: 999px;
          background: linear-gradient(135deg, #f5d800, #22c55e);
          color: #08120c;
          font-weight: 950;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 14px 28px rgba(34, 197, 94, 0.22);
        }

        .checkout-floating-btn:disabled {
          opacity: 0.48;
          cursor: not-allowed;
        }

        .checkout-floating-btn b {
          min-width: 22px;
          height: 22px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          background: #08120c;
          color: #f5d800;
          font-size: 0.72rem;
        }

        .catalog-panel {
          padding: 14px;
          border-radius: 20px;
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 12px;
        }

        .catalog-search {
          min-height: 42px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 13px;
          border-radius: 14px;
          background: var(--bg);
          border: 1px solid var(--border);
          color: var(--muted);
        }

        .catalog-search input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: var(--text);
          font-size: 0.86rem;
          font-weight: 650;
        }

        .catalog-search button {
          width: 24px;
          height: 24px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: var(--card);
          color: var(--muted);
          cursor: pointer;
        }

        .catalog-filters-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .filter-field {
          min-width: 165px;
          height: 40px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0 12px;
          border-radius: 13px;
          background: var(--bg);
          border: 1px solid var(--border);
          color: var(--muted);
        }

        .filter-field svg {
          color: #22c55e;
        }

        .filter-field select {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: var(--text);
          font-size: 0.82rem;
          font-weight: 750;
        }

        .reset-btn {
          height: 40px;
          padding: 0 14px;
          border-radius: 13px;
          border: 1px solid rgba(34, 197, 94, 0.22);
          background: rgba(34, 197, 94, 0.08);
          color: #22c55e;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-weight: 850;
        }

        .catalog-meta {
          margin: 12px 0;
          color: var(--muted);
          font-size: 0.84rem;
          font-weight: 700;
        }

        .catalog-meta strong {
          color: var(--text);
        }

        .meta-error {
          color: #ef4444;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .product-card {
          position: relative;
          overflow: hidden;
          border-radius: 22px;
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .product-card:hover {
          transform: translateY(-4px);
          border-color: rgba(34, 197, 94, 0.32);
        }

        .product-card.selected {
          border-color: #22c55e;
          box-shadow: 0 18px 45px rgba(34, 197, 94, 0.16);
        }

        .select-box {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 5;
          border: 1px solid rgba(34, 197, 94, 0.3);
          background: rgba(8, 18, 12, 0.88);
          color: #f5d800;
          padding: 7px 10px;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 900;
          cursor: pointer;
        }

        .product-card.selected .select-box {
          background: #22c55e;
          color: #08120c;
        }

        .product-image {
          height: 165px;
          background: var(--bg);
          display: grid;
          place-items: center;
          overflow: hidden;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .product-image span {
          font-size: 3rem;
          color: #22c55e;
          font-weight: 950;
        }

        .product-info {
          padding: 14px;
        }

        .product-type {
          display: inline-flex;
          color: #22c55e;
          background: rgba(34, 197, 94, 0.08);
          border: 1px solid rgba(34, 197, 94, 0.15);
          padding: 5px 8px;
          border-radius: 999px;
          font-size: 0.65rem;
          font-weight: 900;
          text-transform: uppercase;
        }

        .product-info h3 {
          margin: 10px 0 6px;
          color: var(--text);
          font-size: 1rem;
          line-height: 1.15;
          font-weight: 950;
        }

        .product-info p {
          margin: 0 0 12px;
          color: var(--muted);
          font-size: 0.78rem;
          line-height: 1.45;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .price-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .old-price {
          color: #ef4444;
          text-decoration: line-through;
          font-weight: 950;
          font-size: 1rem;
        }

        .price-row strong {
          color: #16a34a;
          font-size: 1rem;
          font-weight: 950;
        }

        .empty-products {
          padding: 44px;
          text-align: center;
          border-radius: 22px;
          background: var(--card);
          border: 1px solid var(--border);
          color: var(--muted);
        }

        .empty-products h3 {
          color: var(--text);
          margin-bottom: 6px;
        }

        @media (max-width: 960px) {
          .products-hero {
            flex-direction: column;
            align-items: flex-start;
          }

          .checkout-floating-btn {
            width: 100%;
          }

          .products-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .products-page {
            width: min(100% - 28px, 1120px);
          }

          .products-grid {
            grid-template-columns: 1fr;
          }

          .catalog-filters-row {
            display: grid;
            grid-template-columns: 1fr;
          }

          .filter-field {
            min-width: 100%;
          }
        }
      `}</style>
    </section>
  );
};

export default Products;