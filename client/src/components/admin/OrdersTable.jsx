const OrdersTable = ({ orders }) => {
  return (
    <div className="card table-wrap">
      <h2>Orders</h2>

      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Products</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.user?.email}</td>
              <td>₹{order.totalAmount}</td>
              <td>{order.status}</td>
              <td>{order.items?.map((item) => item.product.title).join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;