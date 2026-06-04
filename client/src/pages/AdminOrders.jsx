import { useEffect, useMemo, useState } from "react";
import { RefreshCw, ReceiptText, Search } from "lucide-react";
import OrdersTable from "../components/admin/OrdersTable";
import { getAdminOrders } from "../services/adminApi";
import Button from "../components/common/Button";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("Loading orders...");
  const [query, setQuery] = useState("");

  const load = async () => {
    try {
      setStatus("Loading orders...");
      const data = await getAdminOrders();
      setOrders(Array.isArray(data) ? data : []);
      setStatus("");
    } catch {
      setOrders([]);
      setStatus("Failed to load orders.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredOrders = useMemo(() => {
    const clean = query.toLowerCase().trim();

    if (!clean) return orders;

    return orders.filter((order) => {
      const email = order.user?.email?.toLowerCase() || "";
      const orderStatus = order.status?.toLowerCase() || "";
      const products =
        order.items
          ?.map((item) => item.product?.title)
          .filter(Boolean)
          .join(" ")
          .toLowerCase() || "";

      return (
        email.includes(clean) ||
        orderStatus.includes(clean) ||
        products.includes(clean)
      );
    });
  }, [orders, query]);

  const paidCount = orders.filter((order) => order.status === "PAID").length;

  const pendingCount = orders.filter(
    (order) => order.status === "PENDING"
  ).length;

  const revenue = orders
    .filter((order) => order.status === "PAID")
    .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

  const formattedRevenue = `₹${revenue.toLocaleString("en-IN")}`;

  return (
    <section className="admin-orders-page">
      <header className="admin-orders-header">
        <div>
          <p className="admin-orders-eyebrow">
            <ReceiptText size={13} />
            Admin Orders
          </p>

          <h1>
            Customer <span>Orders</span>
          </h1>

          <p>
            Track payment status, purchased products, and customer order history
            from one clean admin view.
          </p>
        </div>

        <div className="admin-orders-summary">
          <strong>{formattedRevenue}</strong>
          <span>paid revenue</span>
        </div>
      </header>

      <div className="orders-toolbar">
        <div className="orders-stat">
          <strong>{orders.length}</strong>
          <span>Total</span>
        </div>

        <div className="orders-stat">
          <strong>{paidCount}</strong>
          <span>Paid</span>
        </div>

        <div className="orders-stat">
          <strong>{pendingCount}</strong>
          <span>Pending</span>
        </div>

        <div className="orders-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by email, status, product..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <Button variant="outline" onClick={load}>
          <RefreshCw size={14} />
          Refresh
        </Button>
      </div>

      {status && <p className="admin-orders-status">{status}</p>}

      {!status && <OrdersTable orders={filteredOrders} />}

      <style>{`
        .admin-orders-page {
          padding: 18px 0 42px;
          font-family: Inter, "DM Sans", system-ui, sans-serif;
        }

        .admin-orders-header {
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

        .admin-orders-eyebrow {
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

        .admin-orders-header h1 {
          margin: 0;
          color: var(--text);
          font-size: clamp(1.9rem, 3.8vw, 3rem);
          line-height: 1;
          letter-spacing: -0.055em;
          font-weight: 950;
        }

        .admin-orders-header h1 span {
          background: linear-gradient(120deg, #16a34a, #d6b300);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .admin-orders-header p {
          max-width: 570px;
          margin: 8px 0 0;
          color: var(--muted);
          font-size: 0.86rem;
          line-height: 1.55;
        }

        .admin-orders-summary {
          min-width: 130px;
          padding: 13px;
          border-radius: 16px;
          background: var(--bg);
          border: 1px solid var(--border);
          text-align: right;
        }

        .admin-orders-summary strong {
          display: block;
          color: #16a34a;
          font-size: 1.35rem;
          line-height: 1;
          letter-spacing: -0.045em;
        }

        .admin-orders-summary span {
          display: block;
          margin-top: 5px;
          color: var(--muted);
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .orders-toolbar {
          display: grid;
          grid-template-columns: 100px 100px 100px 1fr auto;
          gap: 10px;
          align-items: stretch;
          margin-bottom: 14px;
        }

        .orders-stat {
          padding: 10px 12px;
          border-radius: 14px;
          background: var(--card);
          border: 1px solid var(--border);
        }

        .orders-stat strong {
          display: block;
          color: #16a34a;
          font-size: 1.2rem;
          line-height: 1;
          letter-spacing: -0.045em;
        }

        .orders-stat span {
          display: block;
          margin-top: 4px;
          color: var(--muted);
          font-size: 0.72rem;
          font-weight: 800;
        }

        .orders-search {
          min-height: 44px;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 0 12px;
          border-radius: 14px;
          background: var(--card);
          border: 1px solid var(--border);
          color: #16a34a;
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
        }

        .orders-search:focus-within {
          border-color: rgba(22, 163, 74, 0.55);
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.09);
        }

        .orders-search input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: var(--text);
          font-size: 0.85rem;
          font-weight: 700;
        }

        .orders-search input::placeholder {
          color: var(--muted);
          opacity: 0.76;
        }

        .orders-toolbar .btn {
          align-self: center;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 9px 12px;
          font-size: 0.82rem;
          white-space: nowrap;
        }

        .admin-orders-status {
          margin: 0 0 14px;
          color: var(--muted);
          font-size: 0.86rem;
          font-weight: 800;
        }

        @media (max-width: 1050px) {
          .orders-toolbar {
            grid-template-columns: repeat(3, 1fr);
          }

          .orders-search {
            grid-column: 1 / -1;
          }

          .orders-toolbar .btn {
            grid-column: 1 / -1;
            justify-content: center;
          }
        }

        @media (max-width: 760px) {
          .admin-orders-page {
            padding-top: 10px;
          }

          .admin-orders-header {
            grid-template-columns: 1fr;
            padding: 18px;
          }

          .admin-orders-summary {
            width: 100%;
            text-align: left;
          }

          .orders-toolbar {
            grid-template-columns: 1fr;
          }

          .orders-search,
          .orders-toolbar .btn {
            grid-column: auto;
          }
        }
      `}</style>
    </section>
  );
};

export default AdminOrders;