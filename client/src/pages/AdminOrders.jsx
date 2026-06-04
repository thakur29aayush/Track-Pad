import { useEffect, useState } from "react";
import OrdersTable from "../components/admin/OrdersTable";
import { getAdminOrders } from "../services/adminApi";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getAdminOrders().then(setOrders).catch(() => setOrders([]));
  }, []);

  return (
    <section>
      <OrdersTable orders={orders} />
    </section>
  );
};

export default AdminOrders;