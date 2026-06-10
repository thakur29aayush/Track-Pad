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
  const [featuredOnly, setFeaturedOnly] = useState(false);
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
    const featured = products.filter((p) => p.isFeatured).length;

    return {
      total: products.length,
      paid,
      free,
      featured,
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

      const matchesFeatured = !featuredOnly || p.isFeatured;

      return matchesQuery && matchesType && matchesPrice && matchesFeatured;
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
  }, [products, query, type, priceFilter, featuredOnly, sortBy]);

  const clearFilters = () => {
    setQuery("");
    setType("ALL");
    setPriceFilter("ALL");
    setFeaturedOnly(false);
    setSortBy("LATEST");
  };

  const hasFilters =
    query.trim() ||
    type !== "ALL" ||
    priceFilter !== "ALL" ||
    featuredOnly ||
    sortBy !== "LATEST";

  const isLoading = status && !statusError;

  return (
    <section className="products-page">
      <header className="products-hero">
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />

        <div className="products-heading">
          <p className="products-eyebrow">
            <Sparkles size={13} />
            Digital Store
          </p>

          <h1>
            Digital products for <span>cleaner routines.</span>
          </h1>

          <p>
            Premium templates, planners, trackers, and practical systems built
            to organize your work and life without creating yet another digital
            landfill.
          </p>

          <div className="hero-pills">
            <span>
              <CheckCircle2 size={13} />
              Instant access
            </span>
            <span>
              <Zap size={13} />
              Productivity focused
            </span>
            <span>
              <Star size={13} />
              Premium resources
            </span>
          </div>
        </div>

        <div className="products-stats">
          <div className="stat-card main-stat">
            <strong>{stats.total}</strong>
            <span>Total products</span>
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
            <div>
              <strong>{stats.featured}</strong>
              <span>Featured</span>
            </div>
          </div>
        </div>
      </header>

      <div className="catalog-panel">
        <div className="catalog-top">
          <div className="catalog-search">
            <Search size={16} />
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
                <X size={13} />
              </button>
            )}
          </div>

          <button
            type="button"
            className={`featured-toggle ${featuredOnly ? "active" : ""}`}
            onClick={() => setFeaturedOnly((prev) => !prev)}
          >
            <Star size={14} />
            Featured
          </button>
        </div>

        <div className="catalog-filters">
          <label className="filter-field">
            <SlidersHorizontal size={14} />
            <select value={type} onChange={(e) => setType(e.target.value)}>
              {productTypes.map((item) => (
                <option key={item} value={item}>
                  {item === "ALL" ? "All Categories" : item.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </label>

          <label className="filter-field">
            <Filter size={14} />
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            >
              <option value="ALL">All Prices</option>
              <option value="FREE">Free</option>
              <option value="PAID">Paid</option>
            </select>
          </label>

          <label className="filter-field">
            <ArrowDownAZ size={14} />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="LATEST">Latest First</option>
              <option value="PRICE_LOW">Price: Low to High</option>
              <option value="PRICE_HIGH">Price: High to Low</option>
              <option value="TITLE">Title A-Z</option>
            </select>
          </label>

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
            Clear filters
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="products-skeleton-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="product-skeleton" key={index}>
              <div />
              <span />
              <strong />
              <p />
              <em />
            </div>
          ))}
        </div>
      ) : !status && filteredProducts.length === 0 ? (
        <div className="empty-products">
          <div className="empty-icon">
            <Boxes size={34} />
          </div>

          <h3>No matching products found</h3>
          <p>
            Try a different keyword, remove a filter, or accept that even search
            bars need mercy sometimes.
          </p>

          {hasFilters && (
            <button type="button" className="clear-btn-lg" onClick={clearFilters}>
              <RotateCcw size={14} />
              Clear all filters
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
        }

        *::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        *::-webkit-scrollbar-track {
          background: transparent;
        }

        *::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 99px;
        }

        .products-page {
          padding: 14px 0 46px;
          font-family: Inter, "DM Sans", system-ui, sans-serif;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .products-hero {
          position: relative;
          overflow: hidden;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 310px;
          align-items: end;
          gap: 24px;
          padding: 28px;
          border-radius: 26px;
          background:
            radial-gradient(circle at top left, rgba(22,163,74,0.14), transparent 34%),
            radial-gradient(circle at bottom right, rgba(214,179,0,0.12), transparent 36%),
            var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
        }

        .hero-glow {
          position: absolute;
          width: 160px;
          height: 160px;
          border-radius: 999px;
          filter: blur(40px);
          opacity: 0.32;
          pointer-events: none;
        }

        .hero-glow-one {
          top: -50px;
          right: 190px;
          background: #16a34a;
        }

        .hero-glow-two {
          bottom: -70px;
          right: -35px;
          background: #d6b300;
        }

        .products-heading {
          position: relative;
          z-index: 1;
          max-width: 700px;
        }

        .products-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin: 0 0 10px;
          padding: 5px 11px;
          border-radius: 999px;
          background: rgba(22,163,74,0.12);
          color: #16a34a;
          border: 1px solid rgba(22,163,74,0.2);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .products-hero h1 {
          margin: 0;
          color: var(--text);
          font-size: clamp(2rem, 4.6vw, 4.1rem);
          line-height: 0.95;
          letter-spacing: -0.07em;
          font-weight: 950;
        }

        .products-hero h1 span {
          background: linear-gradient(120deg, #16a34a, #d6b300);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .products-hero p {
          max-width: 620px;
          margin: 14px 0 0;
          color: var(--muted);
          font-size: 0.94rem;
          line-height: 1.65;
          font-weight: 600;
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
          padding: 8px 11px;
          border-radius: 999px;
          background: var(--bg);
          border: 1px solid var(--border);
          color: var(--text);
          font-size: 0.76rem;
          font-weight: 850;
        }

        .hero-pills svg {
          color: #16a34a;
        }

        .products-stats {
          position: relative;
          z-index: 1;
          display: grid;
          gap: 10px;
        }

        .stat-card,
        .mini-stats > div {
          background: color-mix(in srgb, var(--bg) 86%, transparent);
          border: 1px solid var(--border);
          border-radius: 18px;
          box-shadow: 0 14px 30px rgba(0,0,0,0.05);
        }

        .main-stat {
          padding: 20px;
          text-align: right;
        }

        .main-stat strong {
          display: block;
          color: #16a34a;
          font-size: 3.1rem;
          line-height: 0.9;
          letter-spacing: -0.08em;
          font-weight: 950;
        }

        .main-stat span,
        .mini-stats span {
          display: block;
          margin-top: 7px;
          color: var(--muted);
          font-size: 0.68rem;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 0.09em;
        }

        .mini-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .mini-stats > div {
          padding: 13px 10px;
          text-align: center;
        }

        .mini-stats strong {
          color: var(--text);
          font-size: 1.25rem;
          font-weight: 950;
        }

        .catalog-panel {
          padding: 12px;
          border-radius: 22px;
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
          display: grid;
          gap: 10px;
        }

        .catalog-top {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 10px;
        }

        .catalog-search,
        .filter-field {
          height: 46px;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 0 14px;
          border-radius: 14px;
          background: var(--bg);
          border: 1px solid var(--border);
          color: #16a34a;
          transition: border-color 0.18s, box-shadow 0.18s, transform 0.18s;
        }

        .catalog-search:focus-within,
        .filter-field:focus-within {
          border-color: rgba(22,163,74,0.55);
          box-shadow: 0 0 0 3px rgba(22,163,74,0.08);
        }

        .catalog-search input,
        .filter-field select {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: var(--text);
          font-size: 0.86rem;
          font-weight: 760;
        }

        .filter-field select {
          cursor: pointer;
          text-transform: capitalize;
        }

        .icon-clear {
          width: 24px;
          height: 24px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border: 0;
          border-radius: 50%;
          background: rgba(22,163,74,0.12);
          color: #16a34a;
          cursor: pointer;
        }

        .featured-toggle,
        .reset-btn,
        .clear-inline,
        .clear-btn-lg {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          border: 1px solid var(--border);
          border-radius: 14px;
          background: var(--bg);
          color: var(--text);
          cursor: pointer;
          font-size: 0.82rem;
          font-weight: 900;
          transition: transform 0.18s, border-color 0.18s, background 0.18s;
        }

        .featured-toggle {
          height: 46px;
          padding: 0 15px;
        }

        .featured-toggle:hover,
        .reset-btn:hover,
        .clear-btn-lg:hover {
          transform: translateY(-1px);
          border-color: rgba(22,163,74,0.34);
        }

        .featured-toggle.active {
          background: rgba(22,163,74,0.12);
          color: #16a34a;
          border-color: rgba(22,163,74,0.25);
        }

        .catalog-filters {
          display: grid;
          grid-template-columns: 1.1fr 0.8fr 1fr auto;
          gap: 10px;
        }

        .reset-btn {
          padding: 0 14px;
          height: 46px;
          color: #16a34a;
          border-color: rgba(22,163,74,0.22);
          background: rgba(22,163,74,0.08);
        }

        .catalog-meta {
          min-height: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          color: var(--muted);
          font-size: 0.82rem;
          font-weight: 750;
        }

        .catalog-meta strong {
          color: #16a34a;
          font-weight: 950;
        }

        .meta-error {
          color: #ef4444;
          font-weight: 850;
        }

        .clear-inline {
          border: 0;
          background: transparent;
          color: #16a34a;
          padding: 0;
        }

        .products-skeleton-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .product-skeleton {
          overflow: hidden;
          border-radius: 20px;
          background: var(--card);
          border: 1px solid var(--border);
          padding: 14px;
        }

        .product-skeleton div,
        .product-skeleton span,
        .product-skeleton strong,
        .product-skeleton p,
        .product-skeleton em {
          display: block;
          border-radius: 12px;
          background: linear-gradient(
            90deg,
            rgba(148,163,184,0.12),
            rgba(148,163,184,0.24),
            rgba(148,163,184,0.12)
          );
          background-size: 200% 100%;
          animation: shimmer 1.2s infinite linear;
        }

        .product-skeleton div {
          height: 160px;
          margin-bottom: 14px;
        }

        .product-skeleton span {
          width: 42%;
          height: 12px;
          margin-bottom: 12px;
        }

        .product-skeleton strong {
          width: 80%;
          height: 18px;
          margin-bottom: 10px;
        }

        .product-skeleton p {
          width: 100%;
          height: 42px;
          margin-bottom: 14px;
        }

        .product-skeleton em {
          width: 56%;
          height: 14px;
        }

        @keyframes shimmer {
          to {
            background-position: -200% 0;
          }
        }

        .empty-products {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 9px;
          padding: 48px 18px;
          border-radius: 22px;
          background:
            radial-gradient(circle at center, rgba(22,163,74,0.08), transparent 44%),
            var(--card);
          border: 1px solid var(--border);
          text-align: center;
          box-shadow: var(--shadow);
        }

        .empty-icon {
          width: 72px;
          height: 72px;
          display: grid;
          place-items: center;
          border-radius: 22px;
          background: rgba(22,163,74,0.1);
          color: #16a34a;
          border: 1px solid rgba(22,163,74,0.18);
          margin-bottom: 4px;
        }

        .empty-products h3 {
          margin: 0;
          color: var(--text);
          font-size: 1.2rem;
          letter-spacing: -0.035em;
          font-weight: 950;
        }

        .empty-products p {
          max-width: 430px;
          margin: 0;
          color: var(--muted);
          font-size: 0.88rem;
          line-height: 1.55;
          font-weight: 650;
        }

        .clear-btn-lg {
          margin-top: 8px;
          padding: 10px 16px;
          background: rgba(22,163,74,0.1);
          color: #16a34a;
          border-color: rgba(22,163,74,0.24);
        }

        @media (max-width: 980px) {
          .products-hero {
            grid-template-columns: 1fr;
          }

          .products-stats {
            max-width: 420px;
          }

          .products-skeleton-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 760px) {
          .products-page {
            padding-top: 10px;
          }

          .products-hero {
            padding: 20px;
            border-radius: 22px;
          }

          .products-hero h1 {
            font-size: clamp(2.1rem, 11vw, 3rem);
          }

          .hero-pills {
            gap: 7px;
          }

          .hero-pills span {
            width: 100%;
          }

          .catalog-top,
          .catalog-filters {
            grid-template-columns: 1fr;
          }

          .featured-toggle,
          .reset-btn {
            width: 100%;
          }

          .catalog-meta {
            flex-direction: column;
            align-items: flex-start;
          }

          .products-skeleton-grid {
            grid-template-columns: 1fr;
          }

          .mini-stats {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </section>
  );
};

export default Products;