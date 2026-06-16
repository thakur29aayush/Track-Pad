// src/pages/Products.jsx

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  const stats = useMemo(() => {
    const paid = products.filter((p) => Number(p.price) > 0).length;
    const free = products.filter((p) => Number(p.price) <= 0).length;

    return {
      total: products.length,
      paid,
      free,
    };
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

  const isLoading = status && !statusError;

  return (
    <section className="products-page">
      <header className="products-hero">
        <div className="hero-content">
          <h1>
            Digital products for <span>cleaner routines.</span>
          </h1>

          <p className="hero-subtitle">
            Premium templates, planners, trackers, and practical systems built
            to organize your work and life cleanly.
          </p>

          <div className="hero-pills">
            <span>
              <CheckCircle2 size={12} />
              Instant access
            </span>
            <span>
              <Zap size={12} />
              One checkout
            </span>
            <span>
              <Star size={12} />
              Premium resources
            </span>
          </div>
        </div>

        <div className="products-stats">
          <div className="stat-card main-stat">
            <strong>{stats.total}</strong>
            <span>Total Catalog</span>
          </div>

          <div className="mini-stats">
            <div>
              <strong>{stats.paid}</strong>
              <span>Paid</span>
            </div>

            <div>
              <strong>{stats.free}</strong>
              <span>Free</span>
            </div>
          </div>
        </div>
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
            <button
              type="button"
              className="icon-clear"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
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
          <span className={statusError ? "meta-error" : "meta-loading"}>
            {status}
          </span>
        ) : (
          <span>
            Showing <strong>{filteredProducts.length}</strong> of{" "}
            <strong>{products.length}</strong> digital products
          </span>
        )}

        <div className="catalog-actions">
          {hasFilters && !status && (
            <button type="button" className="clear-inline" onClick={clearFilters}>
              <X size={12} />
              Clear filters
            </button>
          )}

          <button
            type="button"
            className="checkout-btn"
            onClick={handleCheckout}
            disabled={selectedProducts.length === 0}
          >
            <ShoppingCart size={15} />
            Checkout
            {selectedProducts.length > 0 && <b>{selectedProducts.length}</b>}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="products-skeleton-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="product-skeleton" key={index}>
              <div className="skeleton-image" />
              <span className="skeleton-tag" />
              <strong className="skeleton-title" />
              <p className="skeleton-text" />
              <em className="skeleton-footer" />
            </div>
          ))}
        </div>
      ) : !status && filteredProducts.length === 0 ? (
        <div className="empty-products">
          <div className="empty-icon">
            <Boxes size={28} />
          </div>

          <h3>No matching products found</h3>

          <p>
            Try refining your keyword search or adjusting your custom filters.
          </p>

          {hasFilters && (
            <button type="button" className="clear-btn-lg" onClick={clearFilters}>
              <RotateCcw size={14} />
              Reset filters
            </button>
          )}
        </div>
      ) : (
        !status && (
          <div className="products-grid">
            {filteredProducts.map((product) => {
              const selected = selectedProducts.some((p) => p.id === product.id);
              const price = Number(product.price || 0);
              const oldPrice = Math.round(price * 2);
              const imageUrl = getImageUrl(product.thumbnail);
              const productSlug = product.slug || product.id;

              return (
                <article
                  key={product.id}
                  className={`product-card ${selected ? "selected" : ""}`}
                >
                  <label
                    className="select-checkbox"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleProduct(product)}
                    />
                    <span>{selected ? "Added" : "Add"}</span>
                  </label>

                  <Link to={`/products/${productSlug}`} className="product-link">
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

                      <h3>{product.title || "Untitled Product"}</h3>

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

                      <span className="details-link">View details</span>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )
      )}

      <style>{`
        * {
          box-sizing: border-box;
          scrollbar-width: thin;
          scrollbar-color: var(--border) transparent;
        }

        *::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }

        *::-webkit-scrollbar-track {
          background: transparent;
        }

        *::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 99px;
        }

        .products-page {
          width: min(1120px, 92%);
          margin: 0 auto;
          padding: 18px 0 42px;
          font-family: "Inter", "DM Sans", system-ui, sans-serif;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .products-hero {
          position: relative;
          display: grid;
          grid-template-columns: 1fr 250px;
          align-items: center;
          gap: 28px;
          padding: 26px;
          border-radius: 22px;
          background:
            radial-gradient(circle at top right, rgba(34, 197, 94, 0.11), transparent 36%),
            linear-gradient(145deg, rgba(255,255,255,0.055), rgba(255,255,255,0.015)),
            var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
          overflow: hidden;
        }

        .products-hero::before {
          content: "";
          position: absolute;
          right: -80px;
          top: -80px;
          width: 190px;
          height: 190px;
          border-radius: 999px;
          background: rgba(245, 216, 0, 0.13);
          filter: blur(14px);
          pointer-events: none;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 650px;
        }

        .products-hero h1 {
          margin: 0;
          color: var(--text);
          font-size: clamp(1.4rem, 2.8vw, 2.15rem);
          line-height: 1;
          letter-spacing: -0.055em;
          font-weight: 950;
        }

        .products-hero h1 span {
          background: linear-gradient(120deg, #f5d800, #22c55e 58%, #d9a900);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          margin: 14px 0 0;
          max-width: 560px;
          color: var(--muted);
          font-size: 0.9rem;
          line-height: 1.6;
        }

        .hero-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 18px;
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
          font-weight: 750;
        }

        .hero-pills svg {
          color: #22c55e;
        }

        .products-stats {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .stat-card,
        .mini-stats > div {
          background:
            linear-gradient(145deg, rgba(255,255,255,0.055), rgba(255,255,255,0.015)),
            var(--bg);
          border: 1px solid var(--border);
          border-radius: 16px;
        }

        .main-stat {
          padding: 12px;
          text-align: center;
        }

        .main-stat strong {
          display: block;
          color: #22c55e;
          font-size: 1.9rem;
          line-height: 0.95;
          letter-spacing: -0.05em;
          font-weight: 950;
        }

        .main-stat span,
        .mini-stats span {
          display: block;
          margin-top: 5px;
          color: var(--muted);
          font-size: 0.62rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .mini-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .mini-stats > div {
          padding: 8px 6px;
          text-align: center;
        }

        .mini-stats strong {
          color: var(--text);
          font-size: 0.95rem;
          font-weight: 900;
        }

        .catalog-panel {
          padding: 14px;
          border-radius: 20px;
          background:
            linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015)),
            var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
          display: flex;
          flex-direction: column;
          gap: 12px;
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

        .catalog-search:focus-within {
          border-color: rgba(34, 197, 94, 0.4);
          box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.08);
        }

        .catalog-search input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: var(--text);
          font-size: 0.86rem;
          font-weight: 600;
        }

        .catalog-search input::placeholder {
          color: var(--muted);
          font-weight: 500;
        }

        .icon-clear {
          width: 22px;
          height: 22px;
          display: grid;
          place-items: center;
          border: 1px solid var(--border);
          border-radius: 999px;
          background: var(--card);
          color: var(--muted);
          cursor: pointer;
        }

        .catalog-filters-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
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
          flex-shrink: 0;
        }

        .filter-field select {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: var(--text);
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
        }

        .filter-field select option {
          background-color: var(--card, #fff);
          color: var(--text, #000);
        }

        .reset-btn,
        .clear-btn-lg {
          height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 0 14px;
          border-radius: 13px;
          border: 1px solid rgba(34, 197, 94, 0.2);
          background: rgba(34, 197, 94, 0.07);
          color: #22c55e;
          cursor: pointer;
          font-size: 0.82rem;
          font-weight: 800;
        }

        .reset-btn {
          margin-left: auto;
        }

        .catalog-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          color: var(--muted);
          font-size: 0.84rem;
          font-weight: 650;
          padding: 0 2px;
        }

        .catalog-meta strong {
          color: var(--text);
          font-weight: 900;
        }

        .catalog-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .meta-error {
          color: #ef4444;
          font-weight: 800;
        }

        .meta-loading {
          color: var(--muted);
        }

        .clear-inline {
          border: 0;
          background: transparent;
          color: #22c55e;
          padding: 0;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.82rem;
          font-weight: 800;
        }

        .checkout-btn {
          min-height: 38px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 0 14px;
          border: 0;
          border-radius: 999px;
          background: linear-gradient(135deg, #f5d800, #22c55e);
          color: #08120c;
          cursor: pointer;
          font-size: 0.82rem;
          font-weight: 950;
          box-shadow: 0 12px 24px rgba(34, 197, 94, 0.18);
        }

        .checkout-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          box-shadow: none;
        }

        .checkout-btn b {
          min-width: 20px;
          height: 20px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          background: #08120c;
          color: #f5d800;
          font-size: 0.68rem;
        }

        .products-skeleton-grid,
        .products-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .product-skeleton {
          border-radius: 18px;
          background: var(--card);
          border: 1px solid var(--border);
          padding: 14px;
          box-shadow: var(--shadow);
        }

        .product-skeleton div,
        .product-skeleton span,
        .product-skeleton strong,
        .product-skeleton p,
        .product-skeleton em {
          display: block;
          border-radius: 10px;
          background: linear-gradient(
            90deg,
            rgba(148,163,184,0.08),
            rgba(148,163,184,0.16),
            rgba(148,163,184,0.08)
          );
          background-size: 200% 100%;
          animation: shimmer 1.45s infinite linear;
        }

        .skeleton-image {
          height: 145px;
          margin-bottom: 12px;
        }

        .skeleton-tag {
          width: 30%;
          height: 12px;
          margin-bottom: 12px;
        }

        .skeleton-title {
          width: 70%;
          height: 16px;
          margin-bottom: 10px;
        }

        .skeleton-text {
          width: 100%;
          height: 36px;
          margin-bottom: 12px;
        }

        .skeleton-footer {
          width: 50%;
          height: 14px;
        }

        @keyframes shimmer {
          to {
            background-position: -200% 0;
          }
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

        .product-link {
          display: block;
          height: 100%;
          color: inherit;
          text-decoration: none;
        }

        .select-checkbox {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 5;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 10px;
          border-radius: 999px;
          border: 1px solid rgba(34, 197, 94, 0.3);
          background: rgba(8, 18, 12, 0.88);
          color: #f5d800;
          font-size: 0.72rem;
          font-weight: 900;
          cursor: pointer;
          user-select: none;
        }

        .select-checkbox input {
          width: 14px;
          height: 14px;
          margin: 0;
          accent-color: #22c55e;
          cursor: pointer;
        }

        .product-card.selected .select-checkbox {
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

        .details-link {
          display: inline-flex;
          margin-top: 12px;
          color: #22c55e;
          font-size: 0.78rem;
          font-weight: 900;
        }

        .empty-products {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 46px 24px;
          border-radius: 20px;
          background:
            radial-gradient(circle at top, rgba(34, 197, 94, 0.08), transparent 34%),
            var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
          text-align: center;
        }

        .empty-icon {
          width: 56px;
          height: 56px;
          display: grid;
          place-items: center;
          border-radius: 16px;
          background: rgba(34, 197, 94, 0.08);
          border: 1px solid rgba(34, 197, 94, 0.16);
          color: #22c55e;
          margin-bottom: 13px;
        }

        .empty-products h3 {
          margin: 0 0 6px;
          color: var(--text);
          font-size: 1.05rem;
          font-weight: 900;
          letter-spacing: -0.02em;
        }

        .empty-products p {
          max-width: 380px;
          margin: 0 0 16px;
          color: var(--muted);
          font-size: 0.86rem;
          line-height: 1.55;
        }

        @media (max-width: 960px) {
          .products-hero {
            grid-template-columns: 1fr;
            padding: 22px;
          }

          .products-stats {
            max-width: 100%;
          }

          .products-skeleton-grid,
          .products-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .products-page {
            width: min(100% - 28px, 1120px);
            padding-top: 14px;
            gap: 14px;
          }

          .products-hero {
            padding: 18px;
            border-radius: 18px;
          }

          .products-hero h1 {
            font-size: clamp(1.75rem, 10vw, 2.45rem);
          }

          .hero-subtitle {
            font-size: 0.86rem;
          }

          .hero-pills {
            gap: 7px;
          }

          .hero-pills span {
            width: 100%;
            justify-content: center;
          }

          .catalog-panel {
            border-radius: 18px;
          }

          .catalog-filters-row {
            display: grid;
            grid-template-columns: 1fr;
          }

          .filter-field {
            min-width: 100%;
          }

          .reset-btn {
            margin-left: 0;
            width: 100%;
          }

          .catalog-meta {
            align-items: flex-start;
            flex-direction: column;
          }

          .catalog-actions {
            width: 100%;
          }

          .checkout-btn {
            width: 100%;
          }

          .products-skeleton-grid,
          .products-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default Products;