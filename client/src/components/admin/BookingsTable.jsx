import { updateBooking } from "../../services/adminApi";

const BookingsTable = ({ bookings, onUpdated }) => {
  const handleChange = async (id, status) => {
    await updateBooking(id, status);
    onUpdated();
  };

  if (!bookings.length) {
    return (
      <div className="admin-table-empty">
        <h3>No bookings yet</h3>
        <p>New counselling bookings will appear here.</p>

        <style>{`
          .admin-table-empty {
            padding: 38px 20px;
            border-radius: 22px;
            background: var(--card);
            border: 1px solid var(--border);
            text-align: center;
            box-shadow: var(--shadow);
          }

          .admin-table-empty h3 {
            margin: 0 0 8px;
            font-size: 1.3rem;
            letter-spacing: -0.03em;
          }

          .admin-table-empty p {
            margin: 0;
            color: var(--muted);
            font-size: 0.9rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="admin-table-card">
      <div className="admin-table-head">
        <h2>Counselling Bookings</h2>
        <span>{bookings.length} records</span>
      </div>

      <div className="admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Preferred Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.name}</td>
                <td>{booking.email}</td>
                <td>
                  {booking.preferredDate
                    ? new Date(booking.preferredDate).toLocaleString()
                    : "Not selected"}
                </td>
                <td>
                  <select
                    className={`booking-status ${booking.status.toLowerCase()}`}
                    value={booking.status}
                    onChange={(e) => handleChange(booking.id, e.target.value)}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .admin-table-card {
          overflow: hidden;
          border-radius: 22px;
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
        }

        .admin-table-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
          padding: 18px;
          border-bottom: 1px solid var(--border);
        }

        .admin-table-head h2 {
          margin: 0;
          font-size: 1.25rem;
          letter-spacing: -0.035em;
        }

        .admin-table-head span {
          color: var(--muted);
          font-size: 0.82rem;
          font-weight: 800;
        }

        .admin-table-wrap {
          overflow-x: auto;
        }

        .admin-table-card table {
          width: 100%;
          border-collapse: collapse;
        }

        .admin-table-card th,
        .admin-table-card td {
          padding: 14px 18px;
          border-bottom: 1px solid var(--border);
          text-align: left;
          font-size: 0.88rem;
        }

        .admin-table-card th {
          color: var(--muted);
          font-size: 0.72rem;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          background: rgba(22, 163, 74, 0.05);
        }

        .admin-table-card tr:last-child td {
          border-bottom: none;
        }

        .booking-status {
          min-width: 130px;
          padding: 8px 10px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: var(--bg);
          color: var(--text);
          font-size: 0.82rem;
          font-weight: 850;
          outline: none;
          cursor: pointer;
        }

        .booking-status.pending {
          color: #b89400;
        }

        .booking-status.confirmed,
        .booking-status.completed {
          color: #16a34a;
        }

        .booking-status.cancelled {
          color: var(--danger);
        }
      `}</style>
    </div>
  );
};

export default BookingsTable;