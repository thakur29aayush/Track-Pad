// MyPurchases.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PackageCheck, ShoppingBag } from "lucide-react";
import { getMyPurchases } from "../services/productApi";
import ProductAccessBox from "../components/products/ProductAccessBox";
import Button from "../components/common/Button";

const MyPurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [status, setStatus] = useState("Loading purchases...");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyPurchases();
        setPurchases(Array.isArray(data) ? data : []);
        setStatus("");
      } catch {
        setPurchases([]);
        setStatus("Failed to load purchases.");
      }
    };
    load();
  }, []);

  return (
    <section className="purchases-page">
      <header className="purchases-header">
        <div>
          <p className="purchases-eyebrow">Your Library</p>
          <h1>
            My <span>Purchases</span>
          </h1>
          <p>
            Access your purchased templates, files, and product links from one
            clean dashboard.
          </p>
        </div>

        <div className="purchases-total">
          <strong>{purchases.length}</strong>
          <span>owned items</span>
        </div>
      </header>

      {status && <p className="purchases-status">{status}</p>}

      {!status && purchases.length === 0 ? (
        <div className="empty-purchases">
          <PackageCheck size={30} />
          <h3>No purchases yet</h3>
          <p>Your bought products will appear here after payment verification.</p>
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
          padding: 20px 0 48px;
          font-family: Inter, "DM Sans", system-ui, sans-serif;
        }

        .purchases-header {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: end;
          gap: 16px;
          margin-bottom: 16px;
          padding: 20px;
          border-radius: 22px;
          background:
            linear-gradient(135deg, rgba(22, 163, 74, 0.1), rgba(245, 216, 0, 0.05)),
            var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
        }

        .purchases-eyebrow {
          display: inline-flex;
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

        .purchases-header h1 {
          margin: 0;
          color: var(--text);
          font-size: clamp(1.9rem, 4vw, 3rem);
          line-height: 1;
          font-weight: 900;
        }

        .purchases-header h1 span {
          background: linear-gradient(120deg, #16a34a, #d6b300);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .purchases-header p {
          max-width: 520px;
          margin: 10px 0 0;
          color: var(--muted);
          font-size: 0.84rem;
          line-height: 1.5;
        }

        .purchases-total {
          min-width: 100px;
          padding: 12px;
          border-radius: 18px;
          background: var(--bg);
          border: 1px solid var(--border);
          text-align: right;
        }

        .purchases-total strong {
          display: block;
          color: #16a34a;
          font-size: 1.65rem;
        }

        .purchases-total span {
          display: block;
          margin-top: 4px;
          color: var(--muted);
          font-size: 0.72rem;
          font-weight: 700;
        }

        .purchases-status {
          color: var(--muted);
          font-weight: 700;
          margin-bottom: 14px;
        }

        .purchases-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .empty-purchases {
          padding: 36px 16px;
          border-radius: 20px;
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
          text-align: center;
        }

        .empty-purchases svg {
          color: #16a34a;
        }

        .empty-purchases h3 {
          margin: 12px 0 6px;
          font-size: 1.2rem;
        }

        .empty-purchases p {
          max-width: 400px;
          margin: 0 auto 16px;
          color: var(--muted);
          font-size: 0.82rem;
        }

        @media (max-width: 980px) {
          .purchases-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .purchases-grid {
            grid-template-columns: 1fr;
          }

          .purchases-header {
            grid-template-columns: 1fr;
            padding: 18px;
          }

          .purchases-total {
            width: 100%;
            text-align: left;
          }
        }
      `}</style>
    </section>
  );
};

export default MyPurchases;