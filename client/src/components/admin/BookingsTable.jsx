import { updateBooking } from "../../services/adminApi";

const BookingsTable = ({ bookings, onUpdated }) => {
  const handleChange = async (id, status) => {
    await updateBooking(id, status);
    onUpdated();
  };

  return (
    <div className="card table-wrap">
      <h2>Counselling Bookings</h2>

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
                  className="select"
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
  );
};

export default BookingsTable;