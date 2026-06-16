// src/pages/Shop.jsx

import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  FileText,
  ShieldCheck,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { createPaymentOrder, verifyPayment } from "../services/paymentApi";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const getImageUrl = (thumbnail) => {
  if (!thumbnail) return null;
  if (thumbnail.startsWith("http")) return thumbnail;
  return `${API_URL}${thumbnail}`;
};

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Shop = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("checkoutProducts");

    try {
      const parsed = saved ? JSON.parse(saved) : [];
      setItems(Array.isArray(parsed) ? parsed : []);
    } catch {
      setItems([]);
    }
  }, []);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.price || 0), 0);
  }, [items]);

  const removeItem = (id) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    localStorage.setItem("checkoutProducts", JSON.stringify(updated));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("checkoutProducts");
  };

  const handlePay = useCallback(async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (items.length === 0) {
      alert("Your checkout list is empty.");
      return;
    }

    const productIds = items.map((item) => item.id);

    setPaying(true);

    try {
      const isScriptLoaded = await loadRazorpayScript();

      if (!isScriptLoaded) {
        alert("Unable to load Razorpay. Please check your internet connection.");
        setPaying(false);
        return;
      }

      const orderPayload = await createPaymentOrder(productIds);

      if (!orderPayload?.razorpayOrder) {
        throw new Error("Unable to create payment order.");
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderPayload.razorpayOrder.amount,
        currency: orderPayload.razorpayOrder.currency,
        name: "TrackPad",
        description: `${items.length} Digital Product Purchase`,
        order_id: orderPayload.razorpayOrder.id,
        method: { upi: true },
        handler: async function (response) {
          try {
            await verifyPayment({
              orderId: orderPayload.order.id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            localStorage.removeItem("checkoutProducts");
            navigate("/checkout-success");
          } catch (err) {
            alert(
              err.response?.data?.message ||
                "Payment was made, but verification failed."
            );
          } finally {
            setPaying(false);
          }
        },
        modal: {
          ondismiss: function () {
            setPaying(false);
          },
        },
        prefill: {
          email: user.email,
          contact: user.phone || "9999999999",
        },
        theme: {
          color: "#16a34a",
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          error.message ||
          "Payment failed. Please try again."
      );
      setPaying(false);
    }
  }, [items, user, navigate]);

  return (
    <section className="shop-page">
      <Link to="/products" className="back-link">
        <ArrowLeft size={15} />
        Back to products
      </Link>

      <header className="shop-header">
        <div>
          <span className="shop-pill">
            <ShoppingBag size={14} />
            Checkout Cart
          </span>

          <h1>Review your selected products</h1>

          <p>
            Pay once for all selected digital products. Like Zomato, except
            instead of food arriving cold, files arrive instantly.
          </p>
        </div>

        <div className="secure-box">
          <ShieldCheck size={18} />
          Secure Razorpay UPI checkout
        </div>
      </header>

      {items.length === 0 ? (
        <div className="empty-cart">
          <FileText size={34} />
          <h2>No products selected</h2>
          <p>Select products first from the products page.</p>

          <Link to="/products">Browse Products</Link>
        </div>
      ) : (
        <div className="checkout-layout">
          <div className="cart-list">
            {items.map((item) => {
              const price = Number(item.price || 0);
              const imageUrl = getImageUrl(item.thumbnail);

              return (
                <article className="cart-item" key={item.id}>
                  <div className="cart-image">
                    {imageUrl ? (
                      <img src={imageUrl} alt={item.title} />
                    ) : (
                      <FileText size={24} />
                    )}
                  </div>

                  <div className="cart-info">
                    <span>{item.type?.replaceAll("_", " ") || "Digital Product"}</span>
                    <h3>{item.title}</h3>
                    <p>{item.deliveryType || "Instant Access"}</p>
                  </div>

                  <strong className="cart-price">
                    {price > 0 ? `₹${price.toLocaleString("en-IN")}` : "Free"}
                  </strong>

                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 size={15} />
                  </button>
                </article>
              );
            })}
          </div>

          <aside className="summary-card">
            <h2>Order Summary</h2>

            <div className="summary-line">
              <span>Total items</span>
              <strong>{items.length}</strong>
            </div>

            <div className="summary-line">
              <span>Subtotal</span>
              <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
            </div>

            <div className="summary-line">
              <span>Delivery</span>
              <strong>Instant</strong>
            </div>

            <div className="summary-total">
              <span>Payable Amount</span>
              <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
            </div>

            <button
              type="button"
              className="pay-btn"
              onClick={handlePay}
              disabled={paying}
            >
              <CreditCard size={17} />
              {paying ? "Opening checkout..." : "Pay for all products"}
            </button>

            <button type="button" className="clear-cart" onClick={clearCart}>
              Clear cart
            </button>

            <div className="summary-trust">
              <CheckCircle2 size={14} />
              Access unlocks after successful payment verification.
            </div>
          </aside>
        </div>
      )}

      <style>{`
        .shop-page {
          width: min(1120px, 92%);
          margin: 0 auto;
          padding: 18px 0 42px;
          font-family: "Inter", "DM Sans", system-ui, sans-serif;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 14px;
          color: var(--muted);
          text-decoration: none;
          font-size: 0.82rem;
          font-weight: 850;
        }

        .shop-header {
          display: flex;
          justify-content: space-between;
          gap: 24px;
          align-items: center;
          padding: 26px;
          border-radius: 24px;
          background:
            radial-gradient(circle at top right, rgba(34, 197, 94, 0.12), transparent 38%),
            var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
          margin-bottom: 18px;
        }

        .shop-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 11px;
          border-radius: 999px;
          color: #22c55e;
          background: rgba(34, 197, 94, 0.08);
          border: 1px solid rgba(34, 197, 94, 0.15);
          font-size: 0.72rem;
          font-weight: 900;
          text-transform: uppercase;
        }

        .shop-header h1 {
          margin: 12px 0 8px;
          color: var(--text);
          font-size: clamp(1.7rem, 3vw, 2.45rem);
          line-height: 1;
          font-weight: 950;
          letter-spacing: -0.055em;
        }

        .shop-header p {
          max-width: 620px;
          margin: 0;
          color: var(--muted);
          font-size: 0.9rem;
          line-height: 1.55;
        }

        .secure-box {
          min-width: 230px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 13px 15px;
          border-radius: 16px;
          background: var(--bg);
          border: 1px solid var(--border);
          color: var(--text);
          font-size: 0.82rem;
          font-weight: 850;
        }

        .secure-box svg {
          color: #22c55e;
        }

        .checkout-layout {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 18px;
          align-items: start;
        }

        .cart-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .cart-item {
          display: grid;
          grid-template-columns: 86px 1fr auto auto;
          align-items: center;
          gap: 14px;
          padding: 12px;
          border-radius: 20px;
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
        }

        .cart-image {
          width: 86px;
          height: 72px;
          border-radius: 15px;
          background: var(--bg);
          overflow: hidden;
          display: grid;
          place-items: center;
          color: #22c55e;
        }

        .cart-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cart-info span {
          color: #22c55e;
          font-size: 0.65rem;
          font-weight: 900;
          text-transform: uppercase;
        }

        .cart-info h3 {
          margin: 5px 0;
          color: var(--text);
          font-size: 0.98rem;
          line-height: 1.2;
          font-weight: 950;
        }

        .cart-info p {
          margin: 0;
          color: var(--muted);
          font-size: 0.75rem;
          font-weight: 700;
        }

        .cart-price {
          color: #16a34a;
          font-size: 1rem;
          font-weight: 950;
          white-space: nowrap;
        }

        .remove-btn {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          border: 1px solid rgba(239, 68, 68, 0.18);
          background: rgba(239, 68, 68, 0.08);
          color: #ef4444;
          cursor: pointer;
        }

        .summary-card {
          position: sticky;
          top: 88px;
          padding: 18px;
          border-radius: 22px;
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
        }

        .summary-card h2 {
          margin: 0 0 16px;
          color: var(--text);
          font-size: 1.15rem;
          font-weight: 950;
        }

        .summary-line,
        .summary-total {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          padding: 11px 0;
          border-bottom: 1px solid var(--border);
          color: var(--muted);
          font-size: 0.86rem;
          font-weight: 750;
        }

        .summary-line strong {
          color: var(--text);
        }

        .summary-total {
          border-bottom: 0;
          margin-top: 4px;
          color: var(--text);
          font-size: 1rem;
        }

        .summary-total strong {
          color: #16a34a;
          font-size: 1.2rem;
          font-weight: 950;
        }

        .pay-btn {
          width: 100%;
          height: 46px;
          margin-top: 14px;
          border: 0;
          border-radius: 15px;
          background: linear-gradient(135deg, #f5d800, #22c55e);
          color: #08120c;
          font-weight: 950;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .pay-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .clear-cart {
          width: 100%;
          height: 40px;
          margin-top: 10px;
          border-radius: 14px;
          border: 1px solid var(--border);
          background: var(--bg);
          color: var(--muted);
          cursor: pointer;
          font-weight: 850;
        }

        .summary-trust {
          display: flex;
          align-items: flex-start;
          gap: 7px;
          margin-top: 13px;
          color: var(--muted);
          font-size: 0.74rem;
          line-height: 1.35;
          font-weight: 700;
        }

        .summary-trust svg {
          color: #22c55e;
          flex-shrink: 0;
        }

        .empty-cart {
          padding: 54px 24px;
          text-align: center;
          border-radius: 24px;
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
          color: var(--muted);
        }

        .empty-cart svg {
          color: #22c55e;
        }

        .empty-cart h2 {
          color: var(--text);
          margin: 12px 0 6px;
        }

        .empty-cart a {
          display: inline-flex;
          margin-top: 14px;
          padding: 11px 16px;
          border-radius: 999px;
          background: linear-gradient(135deg, #f5d800, #22c55e);
          color: #08120c;
          text-decoration: none;
          font-weight: 950;
        }

        @media (max-width: 900px) {
          .shop-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .secure-box {
            width: 100%;
          }

          .checkout-layout {
            grid-template-columns: 1fr;
          }

          .summary-card {
            position: relative;
            top: auto;
          }
        }

        @media (max-width: 620px) {
          .shop-page {
            width: min(100% - 28px, 1120px);
          }

          .cart-item {
            grid-template-columns: 72px 1fr;
          }

          .cart-price,
          .remove-btn {
            grid-column: span 1;
          }

          .cart-image {
            width: 72px;
            height: 64px;
          }
        }
      `}</style>
    </section>
  );
};

export default Shop;