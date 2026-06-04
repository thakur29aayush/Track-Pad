import { useEffect, useState } from "react";
import BookingsTable from "../components/admin/BookingsTable";
import { getAdminBookings } from "../services/adminApi";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);

  const load = async () => {
    const data = await getAdminBookings();
    setBookings(data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <section>
      <BookingsTable bookings={bookings} onUpdated={load} />
    </section>
  );
};

export default AdminBookings;