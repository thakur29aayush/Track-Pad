import { useEffect, useState } from "react";
import {
  CalendarCheck,
  Clock,
  Mail,
  MessageSquareText,
  Phone,
  Sparkles,
  User,
} from "lucide-react";
import Button from "../components/common/Button";
import { getProducts } from "../services/productApi";
import { createCounsellingBooking } from "../services/adminApi";

const initialForm = {
  productId: "",
  name: "",
  email: "",
  phone: "",
  preferredDate: "",
  message: "",
};

const Counselling = () => {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProducts();

        const counsellingProducts = Array.isArray(data)
          ? data.filter((p) => p.deliveryType === "BOOKING")
          : [];

        setProducts(counsellingProducts);

        if (counsellingProducts[0]) {
          setForm((prev) => ({
            ...prev,
            productId: counsellingProducts[0].id,
          }));
        }
      } catch {
        setStatus("Failed to load counselling sessions.");
        setStatusType("error");
      }
    };

    load();
  }, []);

  const selectedProduct = products.find(
    (product) => String(product.id) === String(form.productId)
  );

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setStatus("");
    setStatusType("");

    try {
      await createCounsellingBooking(form);

      setStatus("Booking request created successfully.");
      setStatusType("success");

      setForm((prev) => ({
        ...initialForm,
        productId: prev.productId,
      }));
    } catch (error) {
      setStatus(error.response?.data?.message || "Booking failed.");
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="counselling-page">
      <div className="counselling-shell">
        <div className="counselling-info">
          <p className="counselling-eyebrow">
            <Sparkles size={13} />
            Guided Support
          </p>

          <h1>
            Book a <span>session.</span>
          </h1>

          <p>
            Choose your session, add your details, and request a preferred time.
            We’ll confirm the next steps after reviewing your booking.
          </p>

          <div className="session-card">
            <div className="session-icon">
              <CalendarCheck size={18} />
            </div>

            <div>
              <span>Selected session</span>
              <strong>{selectedProduct?.title || "Choose a session"}</strong>
              <small>
                {selectedProduct
                  ? `₹${Number(selectedProduct.price || 0).toLocaleString(
                      "en-IN"
                    )}`
                  : "No booking product available"}
              </small>
            </div>
          </div>

          <div className="support-grid">
            <div>
              <Clock size={15} />
              Preferred time
            </div>

            <div>
              <Mail size={15} />
              Email follow-up
            </div>

            <div>
              <MessageSquareText size={15} />
              Personal note
            </div>
          </div>
        </div>

        <form className="counselling-form" onSubmit={submit}>
          <div className="form-head">
            <h2>Session Details</h2>
            <p>Keep it simple. Forms are already mankind’s punishment.</p>
          </div>

          <label className="field">
            <span>Session</span>
            <select
              value={form.productId}
              onChange={(e) => update("productId", e.target.value)}
              required
            >
              {products.length ? (
                products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} - ₹{p.price}
                  </option>
                ))
              ) : (
                <option value="">No counselling sessions available</option>
              )}
            </select>
          </label>

          <div className="field-row">
            <label className="field">
              <span>Name</span>
              <div className="input-wrap">
                <User size={15} />
                <input
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  required
                />
              </div>
            </label>

            <label className="field">
              <span>Phone</span>
              <div className="input-wrap">
                <Phone size={15} />
                <input
                  placeholder="Phone"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                />
              </div>
            </label>
          </div>

          <label className="field">
            <span>Email</span>
            <div className="input-wrap">
              <Mail size={15} />
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                required
              />
            </div>
          </label>

          <label className="field">
            <span>Preferred date and time</span>
            <div className="input-wrap">
              <CalendarCheck size={15} />
              <input
                type="datetime-local"
                value={form.preferredDate}
                onChange={(e) => update("preferredDate", e.target.value)}
              />
            </div>
          </label>

          <label className="field">
            <span>Message</span>
            <textarea
              placeholder="What would you like support with?"
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
            />
          </label>

          {status && <p className={`status ${statusType}`}>{status}</p>}

          <Button type="submit" disabled={loading || !products.length}>
            {loading ? "Creating booking..." : "Book Session"}
          </Button>
        </form>
      </div>

      <style>{`
        .counselling-page {
          padding: 16px 0 42px;
          font-family: Inter, "DM Sans", system-ui, sans-serif;
        }

        .counselling-shell {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 420px;
          gap: 24px;
          align-items: center;
        }

        .counselling-info {
          position: relative;
          padding: 22px;
          border-radius: 26px;
          background:
            radial-gradient(circle at top left, rgba(22, 163, 74, 0.14), transparent 38%),
            linear-gradient(135deg, rgba(22, 163, 74, 0.08), rgba(245, 216, 0, 0.04)),
            var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
          overflow: hidden;
        }

        .counselling-info::after {
          content: "";
          position: absolute;
          right: -70px;
          bottom: -80px;
          width: 210px;
          height: 210px;
          border-radius: 999px;
          background: rgba(245, 216, 0, 0.11);
          filter: blur(14px);
          pointer-events: none;
        }

        .counselling-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin: 0 0 10px;
          padding: 5px 9px;
          border-radius: 999px;
          background: rgba(22, 163, 74, 0.12);
          border: 1px solid rgba(22, 163, 74, 0.18);
          color: #16a34a;
          font-size: 0.64rem;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .counselling-info h1 {
          position: relative;
          z-index: 1;
          max-width: 520px;
          margin: 0;
          color: var(--text);
          font-size: clamp(2rem, 4.2vw, 3.4rem);
          line-height: 0.98;
          letter-spacing: -0.06em;
          font-weight: 950;
        }

        .counselling-info h1 span {
          background: linear-gradient(120deg, #16a34a, #d6b300);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .counselling-info > p {
          position: relative;
          z-index: 1;
          max-width: 500px;
          margin: 13px 0 0;
          color: var(--muted);
          font-size: 0.9rem;
          line-height: 1.58;
        }

        .session-card {
          position: relative;
          z-index: 1;
          max-width: 400px;
          display: flex;
          gap: 12px;
          align-items: center;
          margin-top: 18px;
          padding: 13px;
          border-radius: 17px;
          background: var(--bg);
          border: 1px solid var(--border);
        }

        .session-icon {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background: rgba(22, 163, 74, 0.12);
          color: #16a34a;
          flex-shrink: 0;
        }

        .session-card span,
        .session-card small {
          display: block;
          color: var(--muted);
          font-size: 0.72rem;
          font-weight: 800;
        }

        .session-card strong {
          display: block;
          margin: 2px 0;
          color: var(--text);
          font-size: 0.95rem;
          line-height: 1.25;
        }

        .support-grid {
          position: relative;
          z-index: 1;
          max-width: 400px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 9px;
          margin-top: 12px;
        }

        .support-grid div {
          min-height: 72px;
          display: grid;
          place-items: center;
          gap: 6px;
          padding: 10px;
          border-radius: 15px;
          background: var(--bg);
          border: 1px solid var(--border);
          color: var(--muted);
          font-size: 0.78rem;
          font-weight: 800;
          text-align: center;
        }

        .support-grid svg {
          color: #16a34a;
        }

        .counselling-form {
          width: 100%;
          display: grid;
          gap: 10px;
          padding: 18px;
          border-radius: 24px;
          background: var(--card);
          border: 1px solid rgba(22, 163, 74, 0.18);
          box-shadow: 0 18px 48px rgba(0, 0, 0, 0.11);
        }

        .form-head h2 {
          margin: 0;
          color: var(--text);
          font-size: 1.25rem;
          letter-spacing: -0.04em;
        }

        .form-head p {
          margin: 4px 0 0;
          color: var(--muted);
          font-size: 0.78rem;
          line-height: 1.45;
        }

        .field {
          display: grid;
          gap: 5px;
        }

        .field span {
          color: var(--text);
          font-size: 0.72rem;
          font-weight: 900;
        }

        .field-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
        }

        .input-wrap,
        .field select,
        .field textarea {
          width: 100%;
          border: 1px solid var(--border);
          border-radius: 12px;
          background: var(--bg);
          color: var(--text);
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
        }

        .input-wrap {
          min-height: 41px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 10px;
          color: #16a34a;
        }

        .input-wrap input,
        .field select,
        .field textarea {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: var(--text);
          font-size: 0.82rem;
          font-weight: 700;
        }

        .field select {
          min-height: 41px;
          padding: 0 10px;
          cursor: pointer;
        }

        .field textarea {
          min-height: 72px;
          padding: 9px 10px;
          resize: vertical;
          line-height: 1.45;
        }

        .input-wrap:focus-within,
        .field select:focus,
        .field textarea:focus {
          border-color: rgba(22, 163, 74, 0.55);
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.08);
        }

        .status {
          margin: 0;
          padding: 8px 10px;
          border-radius: 11px;
          font-size: 0.78rem;
          font-weight: 800;
          line-height: 1.45;
          text-align: center;
        }

        .status.success {
          background: rgba(22, 163, 74, 0.1);
          color: #16a34a;
        }

        .status.error {
          background: rgba(220, 38, 38, 0.1);
          color: var(--danger);
        }

        .counselling-form .btn {
          width: 100%;
          margin-top: 2px;
          padding: 11px 14px;
          font-size: 0.86rem;
        }

        @media (max-width: 920px) {
          .counselling-shell {
            grid-template-columns: 1fr;
            gap: 18px;
          }

          .counselling-form {
            max-width: 520px;
          }
        }

        @media (max-width: 560px) {
          .counselling-page {
            padding-top: 8px;
          }

          .counselling-info {
            padding: 18px;
            border-radius: 22px;
          }

          .counselling-info h1 {
            font-size: clamp(1.9rem, 11vw, 2.85rem);
          }

          .support-grid {
            grid-template-columns: 1fr;
          }

          .support-grid div {
            min-height: auto;
            display: flex;
            justify-content: flex-start;
            text-align: left;
          }

          .field-row {
            grid-template-columns: 1fr;
          }

          .counselling-form {
            padding: 16px;
            border-radius: 20px;
          }
        }
      `}</style>
    </section>
  );
};

export default Counselling;