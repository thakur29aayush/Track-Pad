import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownAZ,
  Boxes,
  CheckCircle2,
  Filter,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  X,
  Zap,
} from "lucide-react";
import { getProducts } from "../services/productApi";
import ProductGrid from "../components/products/ProductGrid";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("Loading products...");
  const [statusError, setStatusError] = useState(false);

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
    const uniqueTypes = [
      ...new Set(products.map((p) => p.type).filter(Boolean)),
    ];
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

  const clearFilters = () => {
    setQuery("");
    setType("ALL");
    setPriceFilter("ALL");
    setSortBy("LATEST");
  };

  const hasFilters =
    query.trim() ||
    type !== "ALL" ||
    priceFilter !== "ALL" ||
    sortBy !== "LATEST";

  const isLoading = status && !statusError;

  return (
    <section className="products-page">
      <header className="products-hero">
        <div className="hero-content">
          <p className="products-eyebrow">
            <Sparkles size={12} />
            Digital Store
          </p>

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
              Productivity focused
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
        <div className="catalog-controls-row">
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

        {hasFilters && !status && (
          <button type="button" className="clear-inline" onClick={clearFilters}>
            <X size={12} />
            Clear active filters
          </button>
        )}
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
            Try refining your keyword search or adjusting your custom configuration filters.
          </p>
          {hasFilters && (
            <button type="button" className="clear-btn-lg" onClick={clearFilters}>
              <RotateCcw size={14} />
              Reset filters
            </button>
          )}
        </div>
      ) : (
        !status && <ProductGrid products={filteredProducts} />
      )}

      <style>{`
        * {
          scrollbar-width: thin;
          scrollbar-color: var(--border) transparent;
          box-sizing: border-box;
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
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px 16px;
          font-family: Inter, system-ui, -apple-system, sans-serif;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* --- HERO HEADER SECTION --- */
        .products-hero {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 32px;
          padding: 32px;
          border-radius: 16px;
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow-sm);
        }

        .hero-content {
          flex: 1;
          max-width: 640px;
        }

        .products-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin: 0 0 12px;
          padding: 4px 10px;
          border-radius: 99px;
          background: rgba(22, 163, 74, 0.08);
          color: #16a34a;
          border: 1px solid rgba(22, 163, 74, 0.15);
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .products-hero h1 {
          margin: 0 0 10px;
          color: var(--text);
          font-size: 2.25rem;
          line-height: 1.15;
          letter-spacing: -0.03em;
          font-weight: 800;
        }

        .products-hero h1 span {
          background: linear-gradient(135deg, #16a34a, #d6b300);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          margin: 0 0 20px;
          color: var(--muted);
          font-size: 0.95rem;
          line-height: 1.5;
          font-weight: 400;
        }

        .hero-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .hero-pills span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 99px;
          background: var(--bg);
          border: 1px solid var(--border);
          color: var(--text);
          font-size: 0.78rem;
          font-weight: 500;
        }

        .hero-pills svg {
          color: #16a34a;
        }

        /* --- STATS SECTION --- */
        .products-stats {
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-width: 260px;
        }

        .stat-card,
        .mini-stats > div {
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 12px;
        }

        .main-stat {
          padding: 16px;
          text-align: center;
          background: linear-gradient(to bottom right, var(--bg), var(--card));
        }

        .main-stat strong {
          display: block;
          color: #16a34a;
          font-size: 2.5rem;
          line-height: 1;
          letter-spacing: -0.04em;
          font-weight: 800;
        }

        .main-stat span,
        .mini-stats span {
          display: block;
          margin-top: 4px;
          color: var(--muted);
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .mini-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .mini-stats > div {
          padding: 10px 4px;
          text-align: center;
        }

        .mini-stats strong {
          color: var(--text);
          font-size: 1.05rem;
          font-weight: 700;
        }

        /* --- CONTROL CATALOG PANEL --- */
        .catalog-panel {
          padding: 16px;
          border-radius: 14px;
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .catalog-controls-row {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 12px;
        }

        .catalog-search {
          height: 40px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 14px;
          border-radius: 8px;
          background: var(--bg);
          border: 1px solid var(--border);
          color: var(--muted);
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .catalog-search:focus-within {
          border-color: #16a34a;
          box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.1);
        }

        .catalog-search input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: var(--text);
          font-size: 0.88rem;
        }

        .icon-clear {
          width: 20px;
          height: 20px;
          display: grid;
          place-items: center;
          border: 0;
          border-radius: 50%;
          background: var(--border);
          color: var(--text);
          cursor: pointer;
        }

        .catalog-filters-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
        }

        .filter-field {
          height: 40px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0 12px;
          border-radius: 8px;
          background: var(--bg);
          border: 1px solid var(--border);
          color: var(--muted);
          min-width: 160px;
        }

        /* Essential Option Background Fixes */
        .filter-field select {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: var(--text);
          font-size: 0.85rem;
          font-weight: 500;
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
          gap: 8px;
          padding: 0 16px;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--bg);
          color: var(--text);
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 500;
          transition: background 0.15s, border-color 0.15s;
        }

        .reset-btn:hover,
        .clear-btn-lg:hover {
          background: var(--border);
        }

        .reset-btn {
          margin-left: auto;
          color: #16a34a;
          background: transparent;
          border-color: transparent;
        }
        
        .reset-btn:hover {
          background: rgba(22, 163, 74, 0.05);
        }

        /* --- CATALOG METADATA INTERFACE --- */
        .catalog-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          color: var(--muted);
          font-size: 0.85rem;
        }

        .catalog-meta strong {
          color: var(--text);
          font-weight: 600;
        }

        .meta-error {
          color: #ef4444;
          font-weight: 500;
        }

        .clear-inline {
          border: 0;
          background: transparent;
          color: #16a34a;
          padding: 0;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        /* --- LOADING SKELETON INFRASTRUCTURE --- */
        .products-skeleton-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
        }

        .product-skeleton {
          border-radius: 12px;
          background: var(--card);
          border: 1px solid var(--border);
          padding: 16px;
        }

        .product-skeleton div,
        .product-skeleton span,
        .product-skeleton strong,
        .product-skeleton p,
        .product-skeleton em {
          display: block;
          border-radius: 6px;
          background: linear-gradient(
            90deg,
            rgba(148,163,184,0.08),
            rgba(148,163,184,0.16),
            rgba(148,163,184,0.08)
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
        }

        .skeleton-image { height: 150px; margin-bottom: 12px; }
        .skeleton-tag { width: 30%; height: 12px; margin-bottom: 12px; }
        .skeleton-title { width: 70%; height: 16px; margin-bottom: 10px; }
        .skeleton-text { width: 100%; height: 36px; margin-bottom: 12px; }
        .skeleton-footer { width: 50%; height: 14px; }

        @keyframes shimmer {
          to { background-position: -200% 0; }
        }

        /* --- EMPTY STATE ARTIFACT --- */
        .empty-products {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 48px 24px;
          border-radius: 12px;
          background: var(--card);
          border: 1px solid var(--border);
          text-align: center;
        }

        .empty-icon {
          width: 56px;
          height: 56px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: rgba(22, 163, 74, 0.05);
          color: #16a34a;
          margin-bottom: 12px;
        }

        .empty-products h3 {
          margin: 0 0 6px;
          color: var(--text);
          font-size: 1.1rem;
          font-weight: 600;
        }

        .empty-products p {
          max-width: 360px;
          margin: 0 0 16px;
          color: var(--muted);
          font-size: 0.88rem;
          line-height: 1.45;
        }

        /* --- RESPONSIVE STRUCTURAL MEDIA QUERIES --- */
        @media (max-width: 960px) {
          .products-hero {
            flex-direction: column;
            align-items: stretch;
            padding: 24px;
          }

          .products-stats {
            min-width: 100%;
          }

          .products-skeleton-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .products-hero h1 {
            font-size: 1.75rem;
          }

          .catalog-controls-row {
            grid-template-columns: 1fr;
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

          .products-skeleton-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default Products;