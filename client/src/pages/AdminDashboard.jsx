import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarCheck,
  Package,
  ReceiptText,
  ShieldCheck,
  Users,
} from "lucide-react";
import Button from "../components/common/Button";
import { getAdminStats } from "../services/adminApi";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState("Loading admin dashboard...");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAdminStats();
        setStats(data);
        setStatus("");
      } catch {
        setStats(null);
        setStatus("Failed to load admin stats.");
      }
    };

    load();
  }, []);

  const statCards = useMemo(
    () => [
      {
        label: "Users",
        value: stats?.users ?? 0,
        icon: Users,
        tone: "green",
      },
      {
        label: "Products",
        value: stats?.products ?? 0,
        icon: Package,
        tone: "gold",
      },
      {
        label: "Orders",
        value: stats?.orders ?? 0,
        icon: ReceiptText,
        tone: "green",
      },
      {
        label: "Bookings",
        value: stats?.bookings ?? 0,
        icon: CalendarCheck,
        tone: "gold",
      },
    ],
    [stats]
  );

  const adminLinks = [
    {
      to: "/admin/products",
      title: "Manage Products",
      description: "Add, edit, disable, and organize digital products.",
      icon: Package,
      button: "Open Products",
    },
    {
      to: "/admin/orders",
      title: "View Orders",
      description: "Track payments, purchases, and customer order history.",
      icon: ReceiptText,
      button: "Open Orders",
    },
    {
      to: "/admin/bookings",
      title: "Counselling Bookings",
      description: "Review bookings and update counselling session status.",
      icon: CalendarCheck,
      button: "Open Bookings",
    },
  ];

  return (
    <section className="admin-page">
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">
            <ShieldCheck size={14} />
            Admin Area
          </p>

          <h1>
            Admin <span>Dashboard</span>
          </h1>

          <p>
            Manage products, orders, users, and counselling bookings from one
            focused control panel.
          </p>
        </div>

        <div className="admin-status-card">
          <span>Access Level</span>
          <strong>Admin</strong>
        </div>
      </header>

      {status && <p className="admin-status">{status}</p>}

      <div className="admin-stats-grid">
        {statCards.map((item) => {
          const Icon = item.icon;

          return (
            <article key={item.label} className={`admin-stat-card ${item.tone}`}>
              <div className="stat-icon">
                <Icon size={20} />
              </div>

              <div>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            </article>
          );
        })}
      </div>

      <div className="admin-section-title">
        <div>
          <h2>Management</h2>
          <p>Choose what you want to control. Thrilling, in a database sort of way.</p>
        </div>
      </div>

      <div className="admin-actions-grid">
        {adminLinks.map((item) => {
          const Icon = item.icon;

          return (
            <article key={item.to} className="admin-action-card">
              <div className="action-icon">
                <Icon size={22} />
              </div>

              <h3>{item.title}</h3>
              <p>{item.description}</p>

              <Link to={item.to}>
                <Button variant="outline">
                  {item.button}
                  <ArrowRight size={15} />
                </Button>
              </Link>
            </article>
          );
        })}
      </div>

      <style>{`
        .admin-page {
          padding: 28px 0 56px;
          font-family: Inter, "DM Sans", system-ui, sans-serif;
        }

        .admin-header {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: end;
          gap: 22px;
          margin-bottom: 20px;
          padding: 26px;
          border-radius: 26px;
          background:
            linear-gradient(135deg, rgba(22, 163, 74, 0.12), rgba(245, 216, 0, 0.06)),
            var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
        }

        .admin-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin: 0 0 10px;
          padding: 6px 10px;
          border-radius: 999px;
          background: rgba(22, 163, 74, 0.12);
          color: #16a34a;
          border: 1px solid rgba(22, 163, 74, 0.18);
          font-size: 0.68rem;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .admin-header h1 {
          margin: 0;
          color: var(--text);
          font-size: clamp(2.25rem, 4.4vw, 3.9rem);
          line-height: 0.98;
          letter-spacing: -0.065em;
          font-weight: 950;
        }

        .admin-header h1 span {
          background: linear-gradient(120deg, #16a34a, #d6b300);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .admin-header p {
          max-width: 630px;
          margin: 12px 0 0;
          color: var(--muted);
          font-size: 0.94rem;
          line-height: 1.62;
        }

        .admin-status-card {
          min-width: 150px;
          padding: 16px;
          border-radius: 20px;
          background: var(--bg);
          border: 1px solid var(--border);
          text-align: right;
        }

        .admin-status-card span {
          display: block;
          color: var(--muted);
          font-size: 0.78rem;
          font-weight: 800;
          margin-bottom: 6px;
        }

        .admin-status-card strong {
          display: block;
          color: #16a34a;
          font-size: 1.45rem;
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .admin-status {
          margin: 0 0 16px;
          color: var(--muted);
          font-weight: 800;
        }

        .admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 24px;
        }

        .admin-stat-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px;
          border-radius: 20px;
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.055);
        }

        .stat-icon {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: rgba(22, 163, 74, 0.12);
          color: #16a34a;
          flex-shrink: 0;
        }

        .admin-stat-card.gold .stat-icon {
          background: rgba(214, 179, 0, 0.14);
          color: #b89400;
        }

        .admin-stat-card strong {
          display: block;
          color: var(--text);
          font-size: 1.7rem;
          line-height: 1;
          letter-spacing: -0.05em;
        }

        .admin-stat-card span {
          display: block;
          margin-top: 5px;
          color: var(--muted);
          font-size: 0.82rem;
          font-weight: 800;
        }

        .admin-section-title {
          display: flex;
          justify-content: space-between;
          align-items: end;
          margin-bottom: 14px;
        }

        .admin-section-title h2 {
          margin: 0;
          font-size: 1.35rem;
          letter-spacing: -0.04em;
        }

        .admin-section-title p {
          margin: 6px 0 0;
          color: var(--muted);
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .admin-actions-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .admin-action-card {
          padding: 20px;
          border-radius: 22px;
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.055);
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .admin-action-card:hover {
          transform: translateY(-3px);
          border-color: rgba(22, 163, 74, 0.34);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.09);
        }

        .action-icon {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          background: rgba(22, 163, 74, 0.12);
          color: #16a34a;
          margin-bottom: 16px;
        }

        .admin-action-card h3 {
          margin: 0;
          color: var(--text);
          font-size: 1.15rem;
          letter-spacing: -0.035em;
        }

        .admin-action-card p {
          min-height: 52px;
          margin: 9px 0 16px;
          color: var(--muted);
          font-size: 0.88rem;
          line-height: 1.55;
        }

        .admin-action-card .btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 14px;
          font-size: 0.86rem;
        }

        @media (max-width: 980px) {
          .admin-stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .admin-actions-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 760px) {
          .admin-header {
            grid-template-columns: 1fr;
            padding: 22px;
          }

          .admin-status-card {
            width: 100%;
            text-align: left;
          }
        }

        @media (max-width: 520px) {
          .admin-stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default AdminDashboard;