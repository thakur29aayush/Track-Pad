import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { getProducts } from "../services/productApi";
import ProductGrid from "../components/products/ProductGrid";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("Loading products...");
  const [query, setQuery] = useState("");
  const [type, setType] = useState("ALL");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProducts();
        setProducts(Array.isArray(data) ? data : []);
        setStatus("");
      } catch {
        setProducts([]);
        setStatus("Failed to load products.");
      }
    };

    load();
  }, []);

  const productTypes = useMemo(() => {
    const uniqueTypes = [
      ...new Set(
        products
          .map((product) => product.type)
          .filter(Boolean)
      ),
    ];

    return ["ALL", ...uniqueTypes];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const cleanQuery = query.toLowerCase().trim();

    return products.filter((product) => {
      const title = product.title?.toLowerCase() || "";
      const description = product.description?.toLowerCase() || "";
      const productType = product.type || "";

      const matchesQuery =
        !cleanQuery ||
        title.includes(cleanQuery) ||
        description.includes(cleanQuery);

      const matchesType = type === "ALL" || productType === type;

      return matchesQuery && matchesType;
    });
  }, [products, query, type]);

  const clearFilters = () => {
    setQuery("");
    setType("ALL");
  };

  const hasFilters = query.trim() || type !== "ALL";

  return (
    <section className="products-page">
      <header className="products-header">
        <div className="products-heading">
          <p className="products-eyebrow">Digital Store</p>

          <h1>
            Products for <span>better routines.</span>
          </h1>

          <p>
            Clean templates, habit systems, planners, and counselling products
            for organizing life without creating a second mess.
          </p>
        </div>

        <div className="products-total">
          <strong>{products.length}</strong>
          <span>items</span>
        </div>
      </header>

      <div className="catalog-bar">
        <div className="catalog-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search products"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {query && (
            <button
              type="button"
              className="clear-search"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="catalog-filter">
          <SlidersHorizontal size={16} />
          <select value={type} onChange={(e) => setType(e.target.value)}>
            {productTypes.map((item) => (
              <option key={item} value={item}>
                {item === "ALL" ? "All Categories" : item.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="catalog-meta">
        {status ? (
          <span>{status}</span>
        ) : (
          <span>
            Showing <strong>{filteredProducts.length}</strong> of{" "}
            <strong>{products.length}</strong>
          </span>
        )}

        {hasFilters && (
          <button type="button" onClick={clearFilters}>
            Clear filters
          </button>
        )}
      </div>

      {!status && filteredProducts.length === 0 ? (
        <div className="empty-products">
          <h3>No matching products</h3>
          <p>Try another search term or category.</p>
        </div>
      ) : (
        !status && <ProductGrid products={filteredProducts} />
      )}

      <style>{`
        .products-page {
          padding: 14px 0 44px;
          font-family: Inter, "DM Sans", system-ui, sans-serif;
        }

        .products-header {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: end;
          gap: 18px;
          margin-bottom: 18px;
          padding: 20px;
          border-radius: 22px;
          background:
            linear-gradient(135deg, rgba(22, 163, 74, 0.1), rgba(245, 216, 0, 0.045)),
            var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
        }

        .products-heading {
          max-width: 640px;
        }

        .products-eyebrow {
          display: inline-flex;
          margin: 0 0 8px;
          padding: 5px 9px;
          border-radius: 999px;
          background: rgba(22, 163, 74, 0.12);
          color: #16a34a;
          border: 1px solid rgba(22, 163, 74, 0.18);
          font-size: 0.64rem;
          font-weight: 900;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .products-header h1 {
          margin: 0;
          font-size: clamp(1.9rem, 3.6vw, 3.1rem);
          line-height: 1;
          letter-spacing: -0.055em;
          font-weight: 950;
          color: var(--text);
        }

        .products-header h1 span {
          background: linear-gradient(120deg, #16a34a, #d6b300);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .products-header p {
          max-width: 540px;
          margin: 10px 0 0;
          color: var(--muted);
          font-size: 0.88rem;
          line-height: 1.55;
        }

        .products-total {
          min-width: 104px;
          padding: 13px;
          border-radius: 17px;
          background: var(--bg);
          border: 1px solid var(--border);
          text-align: right;
        }

        .products-total strong {
          display: block;
          color: #16a34a;
          font-size: 1.65rem;
          line-height: 1;
          letter-spacing: -0.05em;
        }

        .products-total span {
          display: block;
          margin-top: 5px;
          color: var(--muted);
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .catalog-bar {
          display: grid;
          grid-template-columns: 1fr 220px;
          gap: 10px;
          margin-bottom: 10px;
        }

        .catalog-search,
        .catalog-filter {
          height: 44px;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 0 13px;
          border-radius: 13px;
          background: var(--card);
          border: 1px solid var(--border);
          color: #16a34a;
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
        }

        .catalog-search:focus-within,
        .catalog-filter:focus-within {
          border-color: rgba(22, 163, 74, 0.55);
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.09);
        }

        .catalog-search input,
        .catalog-filter select {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: var(--text);
          font-size: 0.86rem;
          font-weight: 700;
        }

        .catalog-search input::placeholder {
          color: var(--muted);
          opacity: 0.78;
        }

        .catalog-filter select {
          cursor: pointer;
        }

        .clear-search {
          width: 24px;
          height: 24px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border: 0;
          border-radius: 50%;
          background: rgba(22, 163, 74, 0.11);
          color: #16a34a;
          cursor: pointer;
        }

        .catalog-meta {
          min-height: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
          color: var(--muted);
          font-size: 0.8rem;
          font-weight: 700;
        }

        .catalog-meta strong {
          color: #16a34a;
        }

        .catalog-meta button {
          border: 0;
          background: transparent;
          color: #16a34a;
          cursor: pointer;
          font-weight: 900;
          font-size: 0.8rem;
        }

        .empty-products {
          padding: 30px 16px;
          border-radius: 18px;
          background: var(--card);
          border: 1px solid var(--border);
          text-align: center;
        }

        .empty-products h3 {
          margin: 0 0 6px;
          font-size: 1.12rem;
          letter-spacing: -0.03em;
        }

        .empty-products p {
          margin: 0;
          color: var(--muted);
          font-size: 0.86rem;
        }

        @media (max-width: 760px) {
          .products-page {
            padding-top: 8px;
          }

          .products-header {
            grid-template-columns: 1fr;
            padding: 18px;
            gap: 14px;
          }

          .products-total {
            width: 100%;
            text-align: left;
          }

          .catalog-bar {
            grid-template-columns: 1fr;
          }

          .products-header h1 {
            font-size: clamp(1.95rem, 10vw, 3rem);
          }
        }
      `}</style>
    </section>
  );
};

export default Products;