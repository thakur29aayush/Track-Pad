import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  PackageCheck,
  ShoppingBag,
  RefreshCw,
  Library,
} from "lucide-react";
import { getMyPurchases } from "../services/productApi";
import ProductAccessBox from "../components/products/ProductAccessBox";
import Button from "../components/common/Button";

const MyPurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPurchases = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyPurchases();
      setPurchases(Array.isArray(data) ? data : []);
    } catch {
      setPurchases([]);
      setError("Failed to load purchases.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPurchases();
  }, []);

  return (
    <section className="purchases-page">
      <header className="purchases-header">
        <div>

          <h1>My Purchases</h1>

          <p>Access your purchased products, files, and links.</p>
        </div>

        <div className="purchases-total">
          <strong>{purchases.length}</strong>
          <span>{purchases.length === 1 ? "item" : "items"}</span>
        </div>
      </header>

      <div className="purchases-toolbar">
        <span>
          {loading
            ? "Loading purchases..."
            : error
            ? error
            : purchases.length
            ? "Purchased products are ready."
            : "No purchases found."}
        </span>

        <button onClick={loadPurchases} disabled={loading}>
          <RefreshCw size={14} className={loading ? "spin" : ""} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="purchases-grid">
          {[1, 2, 3].map((item) => (
            <div className="purchase-skeleton" key={item} />
          ))}
        </div>
      ) : purchases.length === 0 ? (
        <div className="empty-purchases">
          <PackageCheck size={30} />

          <h3>No purchases yet</h3>

          <p>Your purchased products will appear here after payment verification.</p>

          <Link to="/products">
            <Button>
              <ShoppingBag size={15} />
              Browse Products
            </Button>
          </Link>
        </div>
      ) : (
        <div className="purchases-grid">
          {purchases.map((purchase) => (
            <ProductAccessBox key={purchase.id} purchase={purchase} />
          ))}
        </div>
      )}

      <style>{`
        .purchases-page {
          padding: 14px 0 36px;
          font-family: Inter, "DM Sans", system-ui, sans-serif;
        }

        .purchases-header {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 14px;
          margin-bottom: 12px;
          padding: 16px 18px;
          border-radius: 18px;
          background:
            linear-gradient(135deg, rgba(34, 197, 94, 0.08), rgba(245, 216, 0, 0.05)),
            var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
        }

        .purchases-eyebrow {
          width: fit-content;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin: 0 0 7px;
          padding: 4px 8px;
          border-radius: 999px;
          background: rgba(22, 163, 74, 0.1);
          color: #16a34a;
          border: 1px solid rgba(22, 163, 74, 0.18);
          font-size: 0.6rem;
          font-weight: 900;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .purchases-header h1 {
          margin: 0;
          color: var(--text);
          font-size: clamp(1.45rem, 3vw, 2.15rem);
          line-height: 1.05;
          font-weight: 900;
          letter-spacing: -0.04em;
        }

        .purchases-header p {
          max-width: 460px;
          margin: 6px 0 0;
          color: var(--muted);
          font-size: 0.78rem;
          line-height: 1.45;
        }

        .purchases-total {
          min-width: 82px;
          padding: 10px 12px;
          border-radius: 14px;
          background: var(--bg);
          border: 1px solid var(--border);
          text-align: right;
        }

        .purchases-total strong {
          display: block;
          color: #16a34a;
          font-size: 1.35rem;
          line-height: 1;
        }

        .purchases-total span {
          display: block;
          margin-top: 4px;
          color: var(--muted);
          font-size: 0.68rem;
          font-weight: 800;
        }

        .purchases-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 12px;
          padding: 9px 11px;
          border-radius: 13px;
          background: var(--card);
          border: 1px solid var(--border);
        }

        .purchases-toolbar span {
          color: var(--muted);
          font-size: 0.76rem;
          font-weight: 700;
        }

        .purchases-toolbar button {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 1px solid var(--border);
          background: var(--bg);
          color: var(--text);
          border-radius: 999px;
          padding: 6px 10px;
          font-size: 0.72rem;
          font-weight: 800;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .purchases-toolbar button:hover {
          border-color: rgba(34, 197, 94, 0.35);
          color: #16a34a;
        }

        .purchases-toolbar button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spin {
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .purchases-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .purchase-skeleton {
          min-height: 170px;
          border-radius: 16px;
          background:
            linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.07), transparent),
            var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
          animation: pulse 1.25s ease-in-out infinite;
        }

        @keyframes pulse {
          50% {
            opacity: 0.55;
          }
        }

        .empty-purchases {
          padding: 30px 16px;
          border-radius: 18px;
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
          text-align: center;
        }

        .empty-purchases svg {
          color: #16a34a;
        }

        .empty-purchases h3 {
          margin: 10px 0 5px;
          color: var(--text);
          font-size: 1.05rem;
          font-weight: 850;
        }

        .empty-purchases p {
          max-width: 360px;
          margin: 0 auto 14px;
          color: var(--muted);
          font-size: 0.78rem;
          line-height: 1.45;
        }

        @media (max-width: 980px) {
          .purchases-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .purchases-page {
            padding-top: 10px;
          }

          .purchases-header {
            grid-template-columns: 1fr;
            padding: 15px;
          }

          .purchases-total {
            width: fit-content;
            text-align: left;
          }

          .purchases-toolbar {
            align-items: flex-start;
            flex-direction: column;
          }

          .purchases-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default MyPurchases;