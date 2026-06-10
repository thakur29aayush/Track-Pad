import { useEffect, useMemo, useState } from "react";
import {
  CalendarCheck,
  CalendarClock,
  CalendarX,
  CheckCircle2,
  Clock,
  RefreshCw,
} from "lucide-react";
import BookingsTable from "../components/admin/BookingsTable";
import { getAdminBookings } from "../services/adminApi";
import Button from "../components/common/Button";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("Loading bookings...");
  const [filter, setFilter] = useState("ALL");

  const load = async () => {
    try {
      setStatus("Loading bookings...");
      const data = await getAdminBookings();
      setBookings(Array.isArray(data) ? data : []);
      setStatus("");
    } catch {
      setBookings([]);
      setStatus("Failed to load bookings.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => ({
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "PENDING").length,
    confirmed: bookings.filter((b) => b.status === "CONFIRMED").length,
    cancelled: bookings.filter((b) => b.status === "CANCELLED").length,
  }), [bookings]);

  const filteredBookings = useMemo(() => {
    if (filter === "ALL") return bookings;
    return bookings.filter((b) => b.status === filter);
  }, [bookings, filter]);

  const filterTabs = [
    { key: "ALL", label: "All", count: stats.total, icon: CalendarCheck },
    { key: "PENDING", label: "Pending", count: stats.pending, icon: Clock },
    { key: "CONFIRMED", label: "Confirmed", count: stats.confirmed, icon: CheckCircle2 },
    { key: "CANCELLED", label: "Cancelled", count: stats.cancelled, icon: CalendarX },
  ];

  return (
    <section className="admin-bookings-page">
      <header className="admin-bookings-header">
        <div>
          <p className="eyebrow"><CalendarCheck size={13} /> Admin Bookings</p>
          <h1>Counselling <span>Bookings</span></h1>
          <p>Review counselling requests, preferred dates, and update booking status from one place.</p>
        </div>
        <div className="header-right">
          <div className="header-total">
            <CalendarClock size={16} className="total-icon" />
            <div>
              <strong>{bookings.length}</strong>
              <span>Total Bookings</span>
            </div>
          </div>
          <button type="button" className="header-btn" onClick={load}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </header>

      <div className="bookings-stats-row">
        {[
          { label: "Total", value: stats.total, icon: CalendarCheck, tone: "green" },
          { label: "Pending", value: stats.pending, icon: Clock, tone: "gold" },
          { label: "Confirmed", value: stats.confirmed, icon: CheckCircle2, tone: "green" },
          { label: "Cancelled", value: stats.cancelled, icon: CalendarX, tone: "red" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="booking-stat-card">
              <div className={`booking-stat-icon ${s.tone}`}><Icon size={16} /></div>
              <div>
                <p className="stat-label">{s.label}</p>
                <p className="stat-val">{s.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bookings-toolbar">
        <div className="filter-tabs">
          {filterTabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                type="button"
                className={`filter-tab ${filter === t.key ? "active" : ""}`}
                onClick={() => setFilter(t.key)}
              >
                <Icon size={13} />
                {t.label}
                <em>{t.count}</em>
              </button>
            );
          })}
        </div>
      </div>

      {status && <p className="admin-bookings-status">{status}</p>}

      {!status && <BookingsTable bookings={filteredBookings} onUpdated={load} />}

      <style>{`
        * { scrollbar-width: thin; scrollbar-color: var(--border) transparent; }
        *::-webkit-scrollbar { width: 6px; height: 6px; }
        *::-webkit-scrollbar-track { background: transparent; }
        *::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }
        *::-webkit-scrollbar-corner { background: transparent; }

        .admin-bookings-page {
          padding: 18px 0 42px;
          font-family: Inter, "DM Sans", system-ui, sans-serif;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .admin-bookings-header {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: end;
          gap: 16px;
          padding: 22px;
          border-radius: 22px;
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin: 0 0 8px;
          padding: 4px 10px;
          border-radius: 999px;
          background: rgba(22,163,74,0.12);
          color: #16a34a;
          border: 1px solid rgba(22,163,74,0.2);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .admin-bookings-header h1 {
          margin: 0;
          color: var(--text);
          font-size: clamp(1.9rem, 3.8vw, 3rem);
          line-height: 1;
          letter-spacing: -0.055em;
          font-weight: 950;
        }

        .admin-bookings-header h1 span {
          background: linear-gradient(120deg, #16a34a, #d6b300);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .admin-bookings-header > div > p {
          max-width: 570px;
          margin: 8px 0 0;
          color: var(--muted);
          font-size: 0.86rem;
          line-height: 1.55;
        }

        .header-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
        }

        .header-total {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 14px;
          background: var(--bg);
          border: 1px solid var(--border);
        }

        .total-icon { color: #16a34a; }

        .header-total strong {
          display: block;
          color: #16a34a;
          font-size: 1.25rem;
          font-weight: 950;
          letter-spacing: -0.04em;
          line-height: 1;
        }

        .header-total span {
          display: block;
          margin-top: 3px;
          color: var(--muted);
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .header-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          font-size: 0.78rem;
          white-space: nowrap;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: var(--bg);
          color: var(--text);
          cursor: pointer;
          font-weight: 850;
        }

        .bookings-stats-row {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
        }

        .booking-stat-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 13px 14px;
          border-radius: 14px;
          background: var(--card);
          border: 1px solid var(--border);
        }

        .booking-stat-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }

        .booking-stat-icon.green { background: rgba(22,163,74,0.12); color: #16a34a; }
        .booking-stat-icon.gold  { background: rgba(214,179,0,0.14); color: #b89400; }
        .booking-stat-icon.red   { background: rgba(239,68,68,0.12); color: #ef4444; }

        .stat-label {
          margin: 0;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--muted);
        }

        .stat-val {
          margin: 2px 0 0;
          font-size: 1.25rem;
          font-weight: 950;
          color: var(--text);
          letter-spacing: -0.04em;
        }

        .bookings-toolbar {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .filter-tabs {
          display: flex;
          gap: 4px;
          padding: 4px;
          border-radius: 13px;
          background: var(--card);
          border: 1px solid var(--border);
        }

        .filter-tab {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 13px;
          border-radius: 9px;
          border: 0;
          background: transparent;
          color: var(--muted);
          font-size: 0.78rem;
          font-weight: 800;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
          white-space: nowrap;
        }

        .filter-tab.active { background: #16a34a; color: #fff; }

        .filter-tab em {
          font-style: normal;
          font-size: 10px;
          padding: 1px 5px;
          border-radius: 99px;
          background: rgba(255,255,255,0.2);
        }

        .filter-tab:not(.active) em {
          background: rgba(22,163,74,0.12);
          color: #16a34a;
        }

        .admin-bookings-status {
          padding: 10px 14px;
          border-radius: 12px;
          background: rgba(22,163,74,0.1);
          color: #16a34a;
          font-size: 0.8rem;
          font-weight: 700;
          margin: 0;
        }

        @media (max-width: 760px) {
          .admin-bookings-header { grid-template-columns: 1fr; padding: 18px; }
          .header-right { align-items: flex-start; }
          .header-total, .header-btn { width: 100%; }
          .header-btn { justify-content: center; }
          .bookings-stats-row { grid-template-columns: repeat(2, 1fr); }
          .filter-tabs { overflow-x: auto; width: 100%; }
        }
      `}</style>
    </section>
  );
};

export default AdminBookings;