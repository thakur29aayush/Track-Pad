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
    } catch (err) {
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
          <p className="purchases-eyebrow">
            <Library size={13} />
            Your Library
          </p>

          <h1>
            My <span>Purchases</span>
          </h1>

          <p>
            Access all your purchased digital products, templates, files, and
            links from one dashboard.
          </p>
        </div>

        <div className="purchases-total">
          <strong>{purchases.length}</strong>
          <span>{purchases.length === 1 ? "owned item" : "owned items"}</span>
        </div>
      </header>

      <div className="purchases-toolbar">
        <p>
          {loading
            ? "Loading your purchases..."
            : error
            ? error
            : purchases.length > 0
            ? "Your purchased products are ready to access."
            : "No purchases found yet."}
        </p>

        <button onClick={loadPurchases} disabled={loading}>
          <RefreshCw size={15} className={loading ? "spin" : ""} />
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
          <PackageCheck size={34} />
          <h3>No purchases yet</h3>
          <p>
            Your bought products will appear here after payment verification.
            Truly shocking that capitalism requires payment first.
          </p>

          <Link to="/products">
            <Button>
              <ShoppingBag size={16} />
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
          padding: 22px 0 56px;
          font-family: Inter, "DM Sans", system-ui, sans-serif;
        }

        .purchases-header {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: end;
          gap: 18px;
          margin-bottom: 14px;
          padding: 22px;
          border-radius: 24px;
          background:
            radial-gradient(circle at top left, rgba(34, 197, 94, 0.16), transparent 34%),
            linear-gradient(135deg, rgba(245, 216, 0, 0.08), rgba(22, 163, 74, 0.08)),
            var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
        }

        .purchases-eyebrow {
          width: fit-content;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin: 0 0 10px;
          padding: 6px 10px;
          border-radius: 999px;
          background: rgba(22, 163, 74, 0.12);
          color: #16a34a;
          border: 1px solid rgba(22, 163, 74, 0.2);
          font-size: 0.66rem;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .purchases-header h1 {
          margin: 0;
          color: var(--text);
          font-size: clamp(2rem, 4vw, 3rem);
          line-height: 1;
          font-weight: 950;
          letter-spacing: -0.05em;
        }

        .purchases-header h1 span {
          background: linear-gradient(120deg, #16a34a, #d6b300);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .purchases-header p {
          max-width: 560px;
          margin: 10px 0 0;
          color: var(--muted);
          font-size: 0.88rem;
          line-height: 1.55;
        }

        .purchases-total {
          min-width: 120px;
          padding: 14px;
          border-radius: 18px;
          background: var(--bg);
          border: 1px solid var(--border);
          text-align: right;
        }

        .purchases-total strong {
          display: block;
          color: #16a34a;
          font-size: 1.9rem;
          line-height: 1;
        }

        .purchases-total span {
          display: block;
          margin-top: 5px;
          color: var(--muted);
          font-size: 0.72rem;
          font-weight: 800;
        }

        .purchases-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 16px;
          padding: 12px 14px;
          border-radius: 16px;
          background: var(--card);
          border: 1px solid var(--border);
        }

        .purchases-toolbar p {
          margin: 0;
          color: var(--muted);
          font-size: 0.82rem;
          font-weight: 700;
        }

        .purchases-toolbar button {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border: 1px solid var(--border);
          background: var(--bg);
          color: var(--text);
          border-radius: 999px;
          padding: 8px 12px;
          font-size: 0.76rem;
          font-weight: 850;
          cursor: pointer;
        }

        .purchases-toolbar button:disabled {
          opacity: 0.65;
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
          gap: 14px;
        }

        .purchase-skeleton {
          min-height: 210px;
          border-radius: 20px;
          background:
            linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent),
            var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
          animation: pulse 1.3s ease-in-out infinite;
        }

        @keyframes pulse {
          50% {
            opacity: 0.55;
          }
        }

        .empty-purchases {
          padding: 42px 18px;
          border-radius: 22px;
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
          text-align: center;
        }

        .empty-purchases svg {
          color: #16a34a;
        }

        .empty-purchases h3 {
          margin: 14px 0 6px;
          color: var(--text);
          font-size: 1.25rem;
        }

        .empty-purchases p {
          max-width: 430px;
          margin: 0 auto 18px;
          color: var(--muted);
          font-size: 0.85rem;
          line-height: 1.55;
        }

        @media (max-width: 980px) {
          .purchases-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .purchases-page {
            padding-top: 14px;
          }

          .purchases-header {
            grid-template-columns: 1fr;
            padding: 18px;
          }

          .purchases-total {
            width: 100%;
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