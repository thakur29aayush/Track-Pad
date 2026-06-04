import { useEffect, useState } from "react";
import { CalendarCheck, RefreshCw } from "lucide-react";
import BookingsTable from "../components/admin/BookingsTable";
import { getAdminBookings } from "../services/adminApi";
import Button from "../components/common/Button";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("Loading bookings...");

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

  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;
  const confirmedCount = bookings.filter((b) => b.status === "CONFIRMED").length;

  return (
    <section className="admin-bookings-page">
      <header className="admin-bookings-header">
        <div>
          <p className="admin-bookings-eyebrow">
            <CalendarCheck size={13} />
            Admin Bookings
          </p>

          <h1>
            Counselling <span>Bookings</span>
          </h1>

          <p>
            Review counselling requests, preferred dates, and update booking
            status from one place.
          </p>
        </div>

        <div className="admin-bookings-summary">
          <strong>{bookings.length}</strong>
          <span>total bookings</span>
        </div>
      </header>

      <div className="booking-stats-row">
        <div>
          <strong>{pendingCount}</strong>
          <span>Pending</span>
        </div>

        <div>
          <strong>{confirmedCount}</strong>
          <span>Confirmed</span>
        </div>

        <Button variant="outline" onClick={load}>
          <RefreshCw size={14} />
          Refresh
        </Button>
      </div>

      {status && <p className="admin-bookings-status">{status}</p>}

      {!status && <BookingsTable bookings={bookings} onUpdated={load} />}

      <style>{`
        .admin-bookings-page {
          padding: 18px 0 42px;
          font-family: Inter, "DM Sans", system-ui, sans-serif;
        }

        .admin-bookings-header {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: end;
          gap: 16px;
          margin-bottom: 14px;
          padding: 20px;
          border-radius: 22px;
          background: linear-gradient(135deg, rgba(22,163,74,0.1), rgba(245,216,0,0.045)), var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
        }

        .admin-bookings-eyebrow {
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

        .admin-bookings-header p {
          max-width: 570px;
          margin: 8px 0 0;
          color: var(--muted);
          font-size: 0.86rem;
          line-height: 1.55;
        }

        .admin-bookings-summary {
          min-width: 130px;
          padding: 13px;
          border-radius: 16px;
          background: var(--bg);
          border: 1px solid var(--border);
          text-align: right;
        }

        .admin-bookings-summary strong {
          display: block;
          color: #16a34a;
          font-size: 1.35rem;
        }

        .admin-bookings-summary span {
          display: block;
          margin-top: 5px;
          color: var(--muted);
          font-size: 0.72rem;
          font-weight: 800;
        }

        .booking-stats-row {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 10px;
          align-items: stretch;
          margin-bottom: 14px;
        }

        .booking-stats-row > div {
          padding: 10px 12px;
          border-radius: 14px;
          background: var(--card);
          border: 1px solid var(--border);
          text-align: center;
        }

        .booking-stats-row strong {
          display: block;
          color: #16a34a;
          font-size: 1.2rem;
        }

        .booking-stats-row span {
          display: block;
          margin-top: 4px;
          color: var(--muted);
          font-size: 0.72rem;
          font-weight: 800;
        }

        .booking-stats-row .btn {
          align-self: center;
          justify-self: end;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 12px;
          font-size: 0.82rem;
        }

        .admin-bookings-status {
          margin: 0 0 12px;
          color: var(--muted);
          font-size: 0.84rem;
          font-weight: 700;
        }

        @media (max-width: 760px) {
          .admin-bookings-header {
            grid-template-columns: 1fr;
            padding: 18px;
          }

          .admin-bookings-summary {
            width: 100%;
            text-align: left;
          }

          .booking-stats-row {
            grid-template-columns: 1fr;
          }

          .booking-stats-row .btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};

export default AdminBookings;