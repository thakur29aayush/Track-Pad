import { Trash2 } from "lucide-react";

const OrdersTable = ({ orders = [], onDeleteOrder }) => {
  const statusClass = (status) => String(status || "").toLowerCase();

  const formatAmount = (amount) => {
    const value = Number(amount || 0);
    return `₹${value.toLocaleString("en-IN")}`;
  };

  if (!orders.length) {
    return (
      <div className="admin-table-empty">
        <h3>No orders found</h3>
        <p>Orders will appear here after customers complete checkout.</p>

        <style>{`
          .admin-table-empty {
            padding: 30px 18px;
            border-radius: 18px;
            background: var(--card);
            border: 1px solid var(--border);
            text-align: center;
            box-shadow: var(--shadow);
          }

          .admin-table-empty h3 {
            margin: 0 0 6px;
            font-size: 1.12rem;
            letter-spacing: -0.025em;
          }

          .admin-table-empty p {
            margin: 0;
            color: var(--muted);
            font-size: 0.84rem;
            line-height: 1.5;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="admin-table-card">
      <div className="admin-table-head">
        <h2>Orders</h2>
        <span>{orders.length} records</span>
      </div>

      <div className="admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Products</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => {
              const products =
                order.items
                  ?.map((item) => item.product?.title)
                  .filter(Boolean)
                  .join(", ") || "No products";

              return (
                <tr key={order.id}>
                  <td>
                    <span className="table-user">
                      {order.user?.email || "Unknown user"}
                    </span>
                  </td>

                  <td>
                    <strong className="table-amount">
                      {formatAmount(order.totalAmount)}
                    </strong>
                  </td>

                  <td>
                    <span className={`order-status ${statusClass(order.status)}`}>
                      {order.status || "Unknown"}
                    </span>
                  </td>

                  <td>
                    <span className="table-products">{products}</span>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="delete-order-btn"
                      onClick={() => onDeleteOrder?.(order.id)}
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <style>{`
        .admin-table-card {
          overflow: hidden;
          border-radius: 18px;
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
        }

        .admin-table-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border-bottom: 1px solid var(--border);
        }

        .admin-table-head h2 {
          margin: 0;
          font-size: 1.08rem;
          letter-spacing: -0.03em;
        }

        .admin-table-head span {
          color: var(--muted);
          font-size: 0.78rem;
          font-weight: 800;
        }

        .admin-table-wrap {
          width: 100%;
          overflow-x: auto;
        }

        .admin-table-card table {
          width: 100%;
          min-width: 820px;
          border-collapse: collapse;
        }

        .admin-table-card th,
        .admin-table-card td {
          padding: 12px 16px;
          border-bottom: 1px solid var(--border);
          text-align: left;
          font-size: 0.84rem;
          vertical-align: middle;
        }

        .admin-table-card th {
          color: var(--muted);
          font-size: 0.68rem;
          font-weight: 900;
          letter-spacing: 0.11em;
          text-transform: uppercase;
          background: rgba(22, 163, 74, 0.045);
          white-space: nowrap;
        }

        .admin-table-card tr:last-child td {
          border-bottom: none;
        }

        .admin-table-card tbody tr:hover {
          background: rgba(22, 163, 74, 0.035);
        }

        .table-user {
          color: var(--text);
          font-weight: 700;
          word-break: break-word;
        }

        .table-amount {
          color: var(--text);
          font-weight: 900;
          white-space: nowrap;
        }

        .table-products {
          display: -webkit-box;
          max-width: 460px;
          overflow: hidden;
          color: var(--muted);
          font-weight: 700;
          line-height: 1.45;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .order-status {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 82px;
          padding: 6px 9px;
          border-radius: 999px;
          background: var(--bg);
          border: 1px solid var(--border);
          font-size: 0.68rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          white-space: nowrap;
        }

        .order-status.paid,
        .order-status.completed,
        .order-status.success {
          color: #16a34a;
          border-color: rgba(22, 163, 74, 0.24);
          background: rgba(22, 163, 74, 0.08);
        }

        .order-status.pending,
        .order-status.processing {
          color: #b89400;
          border-color: rgba(184, 148, 0, 0.24);
          background: rgba(245, 216, 0, 0.09);
        }

        .order-status.failed,
        .order-status.refunded,
        .order-status.cancelled,
        .order-status.canceled {
          color: var(--danger);
          border-color: rgba(220, 38, 38, 0.22);
          background: rgba(220, 38, 38, 0.08);
        }

        .delete-order-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 10px;
          border-radius: 999px;
          border: 1px solid rgba(220, 38, 38, 0.22);
          background: rgba(220, 38, 38, 0.08);
          color: var(--danger);
          font-size: 0.72rem;
          font-weight: 900;
          cursor: pointer;
        }

        @media (max-width: 640px) {
          .admin-table-head {
            padding: 13px 14px;
          }

          .admin-table-card th,
          .admin-table-card td {
            padding: 11px 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default OrdersTable;