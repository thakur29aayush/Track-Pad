import { useEffect, useState } from "react";
import Button from "../components/common/Button";
import { getProducts } from "../services/productApi";
import { createCounsellingBooking } from "../services/adminApi";

const Counselling = () => {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("");
  const [form, setForm] = useState({
    productId: "",
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    message: "",
  });

  useEffect(() => {
    const load = async () => {
      const data = await getProducts();
      const counsellingProducts = data.filter((p) => p.deliveryType === "BOOKING");
      setProducts(counsellingProducts);

      if (counsellingProducts[0]) {
        setForm((prev) => ({ ...prev, productId: counsellingProducts[0].id }));
      }
    };

    load();
  }, []);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      await createCounsellingBooking(form);
      setStatus("Booking request created. Payment flow can be attached next.");
    } catch (error) {
      setStatus(error.response?.data?.message || "Booking failed.");
    }
  };

  return (
    <section>
      <form className="form card" onSubmit={submit}>
        <h1>Book Counselling</h1>

        <select className="select" value={form.productId} onChange={(e) => update("productId", e.target.value)}>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title} - ₹{p.price}
            </option>
          ))}
        </select>

        <input className="input" placeholder="Name" value={form.name} onChange={(e) => update("name", e.target.value)} required />
        <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => update("email", e.target.value)} required />
        <input className="input" placeholder="Phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
        <input className="input" type="datetime-local" value={form.preferredDate} onChange={(e) => update("preferredDate", e.target.value)} />
        <textarea className="textarea" placeholder="Message" value={form.message} onChange={(e) => update("message", e.target.value)} />

        {status && <p>{status}</p>}

        <Button type="submit">Book Session</Button>
      </form>
    </section>
  );
};

export default Counselling;