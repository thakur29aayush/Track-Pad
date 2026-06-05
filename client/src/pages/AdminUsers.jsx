import { useEffect, useMemo, useState } from "react";
import {
  Ban,
  CheckCircle2,
  Edit3,
  Mail,
  Phone,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  Trash2,
  User,
  Users,
  X,
} from "lucide-react";
import {
  deleteUser,
  getAdminUsers,
  suspendUser,
  unsuspendUser,
  updateUser,
} from "../services/adminApi";

const emptyEditForm = {
  name: "",
  email: "",
  phone: "",
  role: "USER",
  isVerified: false,
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("Loading users...");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [savingId, setSavingId] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState(emptyEditForm);

  const loadUsers = async () => {
    try {
      setStatus("Loading users...");
      const data = await getAdminUsers();
      setUsers(Array.isArray(data?.users) ? data.users : Array.isArray(data) ? data : []);
      setStatus("");
    } catch (error) {
      console.error(error);
      setUsers([]);
      setStatus("Failed to load users.");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const duplicateEmails = useMemo(() => {
    const counts = {};

    users.forEach((user) => {
      const email = user.email?.toLowerCase();
      if (email) counts[email] = (counts[email] || 0) + 1;
    });

    return counts;
  }, [users]);

  const filteredUsers = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) return users;

    return users.filter((user) => {
      return (
        user.name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.phone?.toLowerCase().includes(term) ||
        user.role?.toLowerCase().includes(term)
      );
    });
  }, [users, search]);

  const startEdit = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "USER",
      isVerified: Boolean(user.isVerified),
    });
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setEditForm(emptyEditForm);
  };

  const updateEditForm = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const patchUserInState = (id, updated) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              ...updated,
              counts: user.counts,
              totalPurchases: user.totalPurchases,
              totalSpent: user.totalSpent,
              productsBought: user.productsBought,
              orders: user.orders,
              bookings: user.bookings,
            }
          : user
      )
    );
  };

  const handleSave = async () => {
    if (!editingUser) return;

    try {
      setSavingId(editingUser.id);

      const updated = await updateUser(editingUser.id, {
        name: editForm.name.trim(),
        email: editForm.email.trim().toLowerCase(),
        phone: editForm.phone.trim(),
        role: editForm.role,
        isVerified: editForm.isVerified,
      });

      patchUserInState(editingUser.id, updated);
      setStatus("User updated successfully.");
      cancelEdit();
    } catch (error) {
      console.error(error);
      setStatus(error.response?.data?.message || "Failed to update user.");
    } finally {
      setSavingId("");
    }
  };

  const handleSuspend = async (user) => {
    try {
      const res = await suspendUser(user.id);
      const updated = res.user || res;

      patchUserInState(user.id, {
        ...updated,
        isSuspended: true,
      });

      setStatus("User suspended successfully.");
    } catch (error) {
      console.error(error);
      setStatus(error.response?.data?.message || "Failed to suspend user.");
    }
  };

  const handleUnsuspend = async (user) => {
    try {
      const res = await unsuspendUser(user.id);
      const updated = res.user || res;

      patchUserInState(user.id, {
        ...updated,
        isSuspended: false,
      });

      setStatus("User unsuspended successfully.");
    } catch (error) {
      console.error(error);
      setStatus(error.response?.data?.message || "Failed to unsuspend user.");
    }
  };

  const handleDelete = async (user) => {
    const confirmed = window.confirm(
      `Delete ${user.email || "this user"}?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(user.id);
      await deleteUser(user.id);

      setUsers((prev) => prev.filter((item) => item.id !== user.id));
      setStatus("User deleted successfully.");
    } catch (error) {
      console.error(error);
      setStatus(error.response?.data?.message || "Failed to delete user.");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <section className="admin-users-page">
      <header className="admin-users-header">
        <div>
          <p className="admin-eyebrow">
            <ShieldCheck size={13} />
            Admin Control
          </p>

          <h1>
            Manage <span>Users.</span>
          </h1>

          <p>
            Edit users, suspend accounts, review purchases, and remove accounts
            when needed.
          </p>
        </div>

        <button type="button" onClick={loadUsers} className="refresh-btn">
          <RefreshCw size={14} />
          Refresh
        </button>
      </header>

      <div className="users-toolbar">
        <div className="users-search">
          <Search size={15} />
          <input
            type="text"
            placeholder="Search name, email, phone, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="users-count">
          <Users size={15} />
          {filteredUsers.length} users
        </div>
      </div>

      {status && <p className="admin-status">{status}</p>}

      {editingUser && (
        <div className="edit-panel">
          <div className="edit-panel-header">
            <div>
              <h3>Edit User</h3>
              <p>Orders and purchases stay read-only, as they should.</p>
            </div>

            <button type="button" className="close-edit-btn" onClick={cancelEdit}>
              <X size={15} />
            </button>
          </div>

          <div className="edit-grid">
            <label>
              <span>Name</span>
              <input
                value={editForm.name}
                onChange={(e) => updateEditForm("name", e.target.value)}
                placeholder="User name"
              />
            </label>

            <label>
              <span>Email</span>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => updateEditForm("email", e.target.value)}
                placeholder="email@example.com"
              />
            </label>

            <label>
              <span>Phone</span>
              <input
                value={editForm.phone}
                onChange={(e) => updateEditForm("phone", e.target.value)}
                placeholder="Phone number"
              />
            </label>

            <label>
              <span>Role</span>
              <select
                value={editForm.role}
                onChange={(e) => updateEditForm("role", e.target.value)}
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={editForm.isVerified}
                onChange={(e) => updateEditForm("isVerified", e.target.checked)}
              />
              <span>Verified user</span>
            </label>
          </div>

          <div className="edit-actions">
            <button type="button" className="cancel-btn" onClick={cancelEdit}>
              Cancel
            </button>

            <button
              type="button"
              className="save-btn"
              disabled={savingId === editingUser.id}
              onClick={handleSave}
            >
              <Save size={14} />
              {savingId === editingUser.id ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}

      <div className="users-table-wrap">
        <table className="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Purchases</th>
              <th>Orders</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                const emailKey = user.email?.toLowerCase();
                const isDuplicate = emailKey && duplicateEmails[emailKey] > 1;

                return (
                  <tr key={user.id} className={isDuplicate ? "duplicate-row" : ""}>
                    <td>
                      <div className="user-cell">
                        <div className="avatar">
                          <User size={15} />
                        </div>

                        <div>
                          <strong>{user.name || "No Name"}</strong>
                          <span>ID: {user.id}</span>

                          {isDuplicate && (
                            <em className="duplicate-badge">Duplicate</em>
                          )}
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="icon-text">
                        <Mail size={13} />
                        {user.email || "N/A"}
                      </span>
                    </td>

                    <td>
                      <span className="icon-text">
                        <Phone size={13} />
                        {user.phone || "N/A"}
                      </span>
                    </td>

                    <td>
                      <span className={`role-badge ${user.role || "user"}`}>
                        {user.role || "USER"}
                      </span>
                    </td>

                    <td>
                      {user.isSuspended ? (
                        <span className="suspended-badge">Suspended</span>
                      ) : (
                        <span className="active-badge">Active</span>
                      )}
                    </td>

                    <td>{user.counts?.purchases ?? user.totalPurchases ?? 0}</td>
                    <td>{user.counts?.orders ?? user.orders?.length ?? 0}</td>

                    <td>
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <td>
                      <div className="action-group">
                        <button
                          type="button"
                          className="edit-btn"
                          onClick={() => startEdit(user)}
                        >
                          <Edit3 size={12} />
                          Edit
                        </button>

                        {user.isSuspended ? (
                          <button
                            type="button"
                            className="unsuspend-btn"
                            onClick={() => handleUnsuspend(user)}
                          >
                            <CheckCircle2 size={12} />
                            Unsuspend
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="suspend-btn"
                            onClick={() => handleSuspend(user)}
                          >
                            <Ban size={12} />
                            Suspend
                          </button>
                        )}

                        <button
                          type="button"
                          className="delete-user-btn"
                          disabled={deletingId === user.id}
                          onClick={() => handleDelete(user)}
                        >
                          <Trash2 size={12} />
                          {deletingId === user.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className="empty-cell">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .admin-users-page {
          padding: 16px 0 40px;
          font-family: Inter, "DM Sans", system-ui, sans-serif;
        }

        .admin-users-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 14px;
          margin-bottom: 12px;
          padding: 18px;
          border-radius: 20px;
          background:
            linear-gradient(135deg, rgba(22,163,74,0.1), rgba(245,216,0,0.045)),
            var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
        }

        .admin-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin: 0 0 7px;
          padding: 5px 8px;
          border-radius: 999px;
          background: rgba(22, 163, 74, 0.12);
          color: #16a34a;
          border: 1px solid rgba(22,163,74,0.18);
          font-size: 0.6rem;
          font-weight: 900;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .admin-users-header h1 {
          margin: 0;
          font-size: clamp(1.8rem, 3.4vw, 2.75rem);
          line-height: 1;
          letter-spacing: -0.055em;
          font-weight: 950;
          color: var(--text);
        }

        .admin-users-header h1 span {
          background: linear-gradient(120deg,#16a34a,#d6b300);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .admin-users-header p {
          max-width: 560px;
          margin: 7px 0 0;
          color: var(--muted);
          font-size: 0.82rem;
          line-height: 1.5;
        }

        .refresh-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 11px;
          font-size: 0.78rem;
          white-space: nowrap;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: var(--bg);
          color: var(--text);
          cursor: pointer;
          font-weight: 850;
        }

        .users-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .users-search {
          flex: 1;
          min-width: 260px;
          min-height: 40px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 12px;
          border-radius: 999px;
          background: var(--card);
          border: 1px solid var(--border);
          color: #16a34a;
        }

        .users-search:focus-within {
          border-color: rgba(22, 163, 74, 0.55);
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.08);
        }

        .users-search input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: var(--text);
          font-size: 0.84rem;
          font-weight: 700;
        }

        .users-count {
          min-height: 40px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 0 12px;
          border-radius: 999px;
          background: rgba(22, 163, 74, 0.12);
          color: #16a34a;
          font-weight: 900;
          font-size: 0.78rem;
          border: 1px solid rgba(22,163,74,0.18);
        }

        .admin-status {
          margin: 0 0 10px;
          color: var(--muted);
          font-weight: 700;
          font-size: 0.8rem;
        }

        .edit-panel {
          margin-bottom: 12px;
          padding: 16px;
          border-radius: 18px;
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
        }

        .edit-panel-header {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 12px;
        }

        .edit-panel-header h3 {
          margin: 0;
          color: var(--text);
          font-size: 1rem;
        }

        .edit-panel-header p {
          margin: 4px 0 0;
          color: var(--muted);
          font-size: 0.78rem;
          line-height: 1.45;
        }

        .close-edit-btn {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          border: 1px solid var(--border);
          background: var(--bg);
          color: var(--text);
          cursor: pointer;
          flex-shrink: 0;
        }

        .edit-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .edit-grid label {
          display: grid;
          gap: 5px;
        }

        .edit-grid label span {
          color: var(--text);
          font-size: 0.72rem;
          font-weight: 900;
        }

        .edit-grid input,
        .edit-grid select {
          min-height: 40px;
          border: 1px solid var(--border);
          border-radius: 11px;
          background: var(--bg);
          color: var(--text);
          padding: 8px 10px;
          outline: none;
          font-size: 0.82rem;
          font-weight: 700;
        }

        .edit-grid input:focus,
        .edit-grid select:focus {
          border-color: rgba(22, 163, 74, 0.55);
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.08);
        }

        .checkbox-label {
          display: flex !important;
          align-items: center;
          gap: 8px !important;
        }

        .checkbox-label input {
          width: 15px;
          height: 15px;
          min-height: auto;
        }

        .edit-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          margin-top: 12px;
        }

        .cancel-btn,
        .save-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 0;
          padding: 8px 11px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 0.78rem;
          font-weight: 900;
        }

        .cancel-btn {
          background: var(--bg);
          color: var(--muted);
          border: 1px solid var(--border);
        }

        .save-btn {
          background: #16a34a;
          color: #fff;
        }

        .save-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .users-table-wrap {
          overflow-x: auto;
          border-radius: 18px;
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
        }

        .users-table {
          width: 100%;
          min-width: 1160px;
          border-collapse: collapse;
        }

        .users-table th,
        .users-table td {
          padding: 11px 12px;
          text-align: left;
          border-bottom: 1px solid var(--border);
          font-size: 0.8rem;
          color: var(--text);
          vertical-align: middle;
        }

        .users-table th {
          color: var(--muted);
          font-size: 0.66rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 950;
          background: rgba(22, 163, 74, 0.045);
          white-space: nowrap;
        }

        .users-table tr:last-child td {
          border-bottom: 0;
        }

        .users-table tbody tr {
          transition: background 0.18s ease;
        }

        .users-table tbody tr:hover {
          background: rgba(22, 163, 74, 0.03);
        }

        .duplicate-row {
          background: rgba(239, 68, 68, 0.04);
        }

        .user-cell {
          display: flex;
          align-items: center;
          gap: 9px;
          min-width: 210px;
        }

        .avatar {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: rgba(22,163,74,0.12);
          color: #16a34a;
          flex-shrink: 0;
        }

        .user-cell strong {
          display: block;
          font-size: 0.84rem;
          color: var(--text);
          line-height: 1.2;
        }

        .user-cell span {
          display: block;
          max-width: 170px;
          margin-top: 2px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 0.68rem;
          color: var(--muted);
        }

        .duplicate-badge {
          display: inline-flex;
          margin-top: 4px;
          padding: 3px 6px;
          border-radius: 999px;
          background: rgba(239,68,68,0.12);
          color: #ef4444;
          border: 1px solid rgba(239,68,68,0.18);
          font-style: normal;
          font-size: 0.62rem;
          font-weight: 900;
        }

        .icon-text {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          max-width: 210px;
          color: var(--muted);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .role-badge,
        .active-badge,
        .suspended-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 5px 8px;
          border-radius: 999px;
          font-size: 0.66rem;
          font-weight: 950;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .role-badge {
          background: rgba(22,163,74,0.12);
          color: #16a34a;
          border: 1px solid rgba(22,163,74,0.18);
        }

        .role-badge.ADMIN,
        .role-badge.admin {
          background: rgba(214,179,0,0.14);
          color: #b89400;
          border-color: rgba(214,179,0,0.24);
        }

        .active-badge {
          background: rgba(22,163,74,0.12);
          color: #16a34a;
          border: 1px solid rgba(22,163,74,0.18);
        }

        .suspended-badge {
          background: rgba(239,68,68,0.12);
          color: #ef4444;
          border: 1px solid rgba(239,68,68,0.2);
        }

        .action-group {
          display: flex;
          gap: 5px;
          flex-wrap: wrap;
          min-width: 220px;
        }

        .edit-btn,
        .suspend-btn,
        .unsuspend-btn,
        .delete-user-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          border: 0;
          padding: 7px 9px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 0.7rem;
          font-weight: 900;
          white-space: nowrap;
        }

        .edit-btn {
          background: rgba(59,130,246,0.12);
          color: #3b82f6;
        }

        .suspend-btn {
          background: rgba(245,158,11,0.14);
          color: #d97706;
        }

        .unsuspend-btn {
          background: rgba(22,163,74,0.12);
          color: #16a34a;
        }

        .delete-user-btn {
          background: rgba(239,68,68,0.12);
          color: #ef4444;
        }

        .delete-user-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .empty-cell {
          text-align: center !important;
          color: var(--muted) !important;
          font-weight: 800;
          padding: 24px !important;
        }

        @media (max-width: 760px) {
          .admin-users-page {
            padding-top: 10px;
          }

          .admin-users-header {
            align-items: flex-start;
            flex-direction: column;
            padding: 16px;
          }

          .refresh-btn {
            width: 100%;
            justify-content: center;
          }

          .users-search {
            min-width: 100%;
          }

          .users-count {
            width: 100%;
            justify-content: center;
          }

          .edit-grid {
            grid-template-columns: 1fr;
          }

          .edit-actions {
            flex-direction: column;
          }

          .cancel-btn,
          .save-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};

export default AdminUsers;