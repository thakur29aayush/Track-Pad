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

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      await createCounsellingBooking(form);
      setStatus("Booking request created successfully. Payment can be attached next.");
    } catch (error) {
      setStatus(error.response?.data?.message || "Booking failed.");
    }
  };

  return (
    <section className="counselling-page">
      <form className="counselling-card" onSubmit={submit}>
        <h1>Book Counselling Session</h1>

        <select
          className="select"
          value={form.productId}
          onChange={(e) => update("productId", e.target.value)}
        >
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title} - ₹{p.price}
            </option>
          ))}
        </select>

        <input
          className="input"
          placeholder="Name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          required
        />
        <input
          className="input"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          required
        />
        <input
          className="input"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
        />
        <input
          className="input"
          type="datetime-local"
          value={form.preferredDate}
          onChange={(e) => update("preferredDate", e.target.value)}
        />
        <textarea
          className="textarea"
          placeholder="Message"
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
        />

        {status && <p className="status">{status}</p>}

        <Button type="submit">Book Session</Button>
      </form>

      <style>{`
        .counselling-page {
          padding: 28px 12px 48px;
          display: flex;
          justify-content: center;
          font-family: Inter, "DM Sans", system-ui, sans-serif;
        }

        .counselling-card {
          width: 100%;
          max-width: 440px;
          display: grid;
          gap: 12px;
          padding: 22px;
          border-radius: 20px;
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: 0 8px 22px rgba(0,0,0,0.04);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .counselling-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 32px rgba(0,0,0,0.07);
        }

        .counselling-card h1 {
          margin: 0 0 10px;
          font-size: clamp(1.85rem, 4vw, 2.4rem);
          font-weight: 900;
          color: var(--text);
          text-align: center;
        }

        .input,
        .select,
        .textarea {
          width: 100%;
          padding: 9px 12px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--bg);
          font-size: 0.88rem;
          color: var(--text);
          font-weight: 700;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .input:focus,
        .select:focus,
        .textarea:focus {
          border-color: rgba(22, 163, 74, 0.55);
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.08);
          outline: none;
        }

        .textarea {
          min-height: 80px;
          resize: vertical;
        }

        .select {
          cursor: pointer;
        }

        .status {
          font-size: 0.84rem;
          font-weight: 700;
          color: #16a34a;
          margin-bottom: 2px;
          text-align: center;
        }

        @media (max-width: 540px) {
          .counselling-card {
            padding: 18px;
          }

          .counselling-card h1 {
            font-size: clamp(1.6rem, 12vw, 2rem);
          }
        }
      `}</style>
    </section>
  );
};

export default Counselling;