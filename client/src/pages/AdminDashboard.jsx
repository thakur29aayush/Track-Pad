import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import { getAdminStats } from "../services/adminApi";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getAdminStats().then(setStats).catch(() => setStats(null));
  }, []);

  return (
    <section>
      <h1>Admin Dashboard</h1>

      <div className="grid grid-3">
        <div className="card"><h2>{stats?.users ?? 0}</h2><p>Users</p></div>
        <div className="card"><h2>{stats?.products ?? 0}</h2><p>Products</p></div>
        <div className="card"><h2>{stats?.orders ?? 0}</h2><p>Orders</p></div>
        <div className="card"><h2>{stats?.bookings ?? 0}</h2><p>Bookings</p></div>
      </div>

      <br />

      <div className="actions">
        <Link to="/admin/products"><Button>Products</Button></Link>
        <Link to="/admin/orders"><Button variant="outline">Orders</Button></Link>
        <Link to="/admin/bookings"><Button variant="outline">Bookings</Button></Link>
      </div>
    </section>
  );
};

export default AdminDashboard;