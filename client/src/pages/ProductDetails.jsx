import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  Lock,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import Button from "../components/common/Button";
import { getProductBySlug } from "../services/productApi";
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

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("Loading product details...");
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      try {
        setStatus("Loading product details...");

        const data = await getProductBySlug(slug);

        if (!isMounted) return;

        if (data) {
          setProduct(data);
          setStatus("");
        } else {
          setStatus("Product not found.");
        }
      } catch (err) {
        if (isMounted) setStatus("Product not found.");
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const imageUrl = useMemo(
    () => getImageUrl(product?.thumbnail),
    [product?.thumbnail]
  );

  const price = useMemo(() => Number(product?.price || 0), [product?.price]);
  const oldPrice = useMemo(() => Math.round(price * 2), [price]);

  const productType = useMemo(() => {
    return product?.type
      ? product.type.replaceAll("_", " ").toLowerCase()
      : "digital product";
  }, [product?.type]);

  const deliveryLabel = useMemo(() => {
    const labels = {
      LINK: "Private access link",
      FILE: "Downloadable file",
      BOTH: "Link + file delivery",
      BOOKING: "Paid booking",
    };

    return labels[product?.deliveryType] || product?.deliveryType || "Instant Download";
  }, [product?.deliveryType]);

  const DeliveryIcon = useMemo(() => {
    if (product?.deliveryType === "FILE") return Download;
    if (product?.deliveryType === "LINK") return ExternalLink;
    return FileText;
  }, [product?.deliveryType]);

  const handleBuy = useCallback(async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!product?.id) {
      alert("Invalid product. Please refresh and try again.");
      return;
    }

    setPaying(true);

    try {
      const isScriptLoaded = await loadRazorpayScript();

      if (!isScriptLoaded) {
        alert("Unable to load Razorpay. Please check your internet connection.");
        setPaying(false);
        return;
      }

      const orderPayload = await createPaymentOrder([product.id]);

      if (!orderPayload?.razorpayOrder) {
        throw new Error("Unable to create payment order.");
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderPayload.razorpayOrder.amount,
        currency: orderPayload.razorpayOrder.currency,
        name: "TrackPad",
        description: product.title || "Digital Product Purchase",
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
  }, [user, product, navigate]);

  if (status) {
    return (
      <section className="product-detail-page">
        <div className="state-card" role="alert">
          <p>{status}</p>

          {status === "Product not found." && (
            <Link to="/products" className="state-link">
              <Button variant="outline">Back to Products</Button>
            </Link>
          )}
        </div>

        <style>{`
          .product-detail-page {
            width: min(1120px, 92%);
            margin: 0 auto;
            padding: 28px 0 64px;
            font-family: "Inter", "DM Sans", system-ui, sans-serif;
          }

          .state-card {
            max-width: 430px;
            margin: 70px auto;
            padding: 30px 24px;
            border-radius: 22px;
            background:
              radial-gradient(circle at top, rgba(34, 197, 94, 0.08), transparent 36%),
              var(--card, #ffffff);
            border: 1px solid var(--border, #e2e8f0);
            text-align: center;
            box-shadow: var(--shadow, 0 18px 45px rgba(15, 23, 42, 0.06));
          }

          .state-card p {
            margin: 0 0 16px;
            color: var(--text, #0f172a);
            font-weight: 800;
          }

          .state-link {
            text-decoration: none;
          }
        `}</style>
      </section>
    );
  }

  if (!product) return null;

  return (
    <section className="product-detail-page">
      <Link to="/products" className="back-link">
        <ArrowLeft size={16} />
        Back to products
      </Link>

      <div className="detail-shell">
        <div className="media-card">
          {imageUrl ? (
            <img src={imageUrl} alt={`Cover for ${product.title}`} />
          ) : (
            <div className="media-placeholder">
              <FileText size={42} strokeWidth={1.5} />
              <span>
                {product.title?.trim()?.slice(0, 1)?.toUpperCase() || "P"}
              </span>
            </div>
          )}
        </div>

        <article className="info-card">
          <div className="top-row">
            <span className="type-pill">{productType}</span>

            <span className="secure-pill">
              <ShieldCheck size={14} />
              Secure UPI Gateway
            </span>
          </div>

          <h1>{product.title || "Untitled Digital Blueprint"}</h1>

          <p className="description">
            {product.description ||
              "No analytical breakdowns documented for this item."}
          </p>

          <div className="purchase-box">
            <div className="price-area">
              <span className="price-label">One-time investment</span>

              <div className="detail-price-stack">
                {price > 0 && (
                  <span className="detail-old-price">
                    ₹{oldPrice.toLocaleString("en-IN")}
                  </span>
                )}

                <strong className={price > 0 ? "sale-price" : "free-price"}>
                  {price > 0
                    ? `₹${price.toLocaleString("en-IN")}`
                    : "Free access"}
                </strong>

                {price > 0 && <span className="discount-badge">50% OFF</span>}
              </div>
            </div>

            <div className="delivery-box">
              <DeliveryIcon size={16} />
              {deliveryLabel}
            </div>
          </div>

          <div className="benefits-list">
            <div>
              <CheckCircle2 size={16} />
              Pay once, access forever
            </div>

            <div>
              <Download size={16} />
              Delivered instantly post-payment
            </div>

            <div>
              <Lock size={16} />
              Stored safely in account vault
            </div>
          </div>

          <Button onClick={handleBuy} disabled={paying} style={{ width: "100%" }}>
            {paying ? (
              "Opening secure checkout..."
            ) : (
              <>
                <ShoppingBag size={16} />
                {price > 0 ? "Buy with UPI Gateway" : "Claim Free Instant Access"}
              </>
            )}
          </Button>

          {!user && (
            <p className="login-note">
              Login with email OTP before completing checkout.
            </p>
          )}
        </article>
      </div>

      <div className="detail-extra">
        <div>
          <BadgeCheck size={18} />
          <h3>After purchase deployment</h3>
          <p>
            This operational bundle registers permanently to your private library
            dashboard profile instantly upon payment acknowledgement hooks.
          </p>
        </div>

        <div>
          <DeliveryIcon size={18} />
          <h3>Distribution Logistics</h3>
          <p>
            Delivery configuration runs via <strong>{deliveryLabel}</strong>{" "}
            verification filters. Access paths initialize within your vault
            environment automatically.
          </p>
        </div>
      </div>

      <style>{`
        .product-detail-page {
          width: min(1120px, 92%);
          margin: 0 auto;
          padding: 22px 0 60px;
          font-family: "Inter", "DM Sans", system-ui, sans-serif;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 18px;
          color: var(--muted, #64748b);
          text-decoration: none;
          font-size: 0.86rem;
          font-weight: 850;
          transition: color 0.18s ease, transform 0.18s ease;
        }

        .back-link:hover {
          color: #22c55e;
          transform: translateX(-2px);
        }

        .detail-shell {
          display: grid;
          grid-template-columns: 0.95fr 1.05fr;
          gap: 22px;
          align-items: start;
        }

        .media-card {
          position: sticky;
          top: 86px;
          min-height: 430px;
          overflow: hidden;
          border-radius: 26px;
          background:
            radial-gradient(circle at top right, rgba(245, 216, 0, 0.12), transparent 34%),
            linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(245, 216, 0, 0.05)),
            var(--card, #ffffff);
          border: 1px solid var(--border, #e2e8f0);
          box-shadow: var(--shadow, 0 18px 45px rgba(15, 23, 42, 0.06));
        }

        .media-card::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(to top, rgba(15, 23, 42, 0.08), transparent 45%);
        }

        .media-card img {
          width: 100%;
          height: 100%;
          min-height: 430px;
          object-fit: cover;
          display: block;
        }

        .media-placeholder {
          min-height: 430px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #22c55e;
        }

        .media-placeholder span {
          font-size: 4.5rem;
          font-weight: 950;
          letter-spacing: -0.08em;
          line-height: 1;
        }

        .info-card {
          position: relative;
          overflow: hidden;
          padding: 26px;
          border-radius: 26px;
          background:
            radial-gradient(circle at top right, rgba(34, 197, 94, 0.09), transparent 38%),
            linear-gradient(145deg, rgba(255,255,255,0.055), rgba(255,255,255,0.015)),
            var(--card, #ffffff);
          border: 1px solid var(--border, #e2e8f0);
          box-shadow: var(--shadow, 0 18px 45px rgba(15, 23, 42, 0.06));
        }

        .top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }

        .type-pill,
        .secure-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 11px;
          border-radius: 999px;
          font-size: 0.7rem;
          font-weight: 900;
        }

        .type-pill {
          color: #22c55e;
          background: rgba(34, 197, 94, 0.08);
          border: 1px solid rgba(34, 197, 94, 0.16);
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }

        .secure-pill {
          color: var(--muted, #64748b);
          background: var(--bg, #f8fafc);
          border: 1px solid var(--border, #e2e8f0);
          white-space: nowrap;
        }

        .secure-pill svg {
          color: #22c55e;
        }

        .info-card h1 {
          margin: 0;
          max-width: 680px;
          color: var(--text, #0f172a);
          font-size: clamp(1.85rem, 4vw, 3rem);
          line-height: 1;
          font-weight: 950;
          letter-spacing: -0.055em;
        }

        .description {
          margin: 14px 0 22px;
          color: var(--muted, #64748b);
          font-size: 0.92rem;
          line-height: 1.65;
          font-weight: 550;
        }

        .purchase-box {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 16px;
          margin-bottom: 18px;
          padding: 16px;
          border-radius: 20px;
          background:
            radial-gradient(circle at top left, rgba(34, 197, 94, 0.1), transparent 42%),
            var(--bg, #f8fafc);
          border: 1px solid var(--border, #e2e8f0);
        }

        .price-label {
          display: block;
          margin-bottom: 8px;
          color: var(--muted, #64748b);
          font-size: 0.72rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .detail-price-stack {
          display: flex;
          align-items: flex-end;
          gap: 10px;
          flex-wrap: wrap;
        }

        .detail-old-price {
          color: #ef4444;
          font-size: 1.65rem;
          line-height: 1;
          font-weight: 950;
          text-decoration: line-through;
          opacity: 0.9;
        }

        .sale-price {
          color: #16a34a;
          font-size: 1.15rem;
          line-height: 1;
          font-weight: 950;
          padding: 5px 10px;
          border-radius: 999px;
          background: rgba(34, 197, 94, 0.09);
          border: 1px solid rgba(34, 197, 94, 0.16);
        }

        .free-price {
          color: #16a34a;
          font-size: 1.75rem;
          line-height: 1;
          font-weight: 950;
        }

        .discount-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 5px 8px;
          border-radius: 999px;
          background: rgba(34, 197, 94, 0.09);
          color: #16a34a;
          border: 1px solid rgba(34, 197, 94, 0.16);
          font-size: 0.66rem;
          font-weight: 950;
          letter-spacing: 0.06em;
        }

        .delivery-box {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 10px 12px;
          border-radius: 14px;
          background: var(--card, #ffffff);
          border: 1px solid var(--border, #e2e8f0);
          color: var(--text, #0f172a);
          font-size: 0.78rem;
          font-weight: 850;
          white-space: nowrap;
        }

        .delivery-box svg {
          color: #22c55e;
          flex-shrink: 0;
        }

        .benefits-list {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 9px;
          margin-bottom: 18px;
        }

        .benefits-list div {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 10px;
          border-radius: 14px;
          background: var(--bg, #f8fafc);
          border: 1px solid var(--border, #e2e8f0);
          color: var(--muted, #64748b);
          font-size: 0.74rem;
          font-weight: 800;
          line-height: 1.35;
        }

        .benefits-list svg {
          color: #22c55e;
          flex-shrink: 0;
        }

        .login-note {
          margin: 12px 0 0;
          color: var(--muted, #64748b);
          text-align: center;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .detail-extra {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin-top: 18px;
        }

        .detail-extra > div {
          position: relative;
          padding: 18px;
          border-radius: 22px;
          background:
            linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015)),
            var(--card, #ffffff);
          border: 1px solid var(--border, #e2e8f0);
          box-shadow: var(--shadow, 0 18px 45px rgba(15, 23, 42, 0.06));
        }

        .detail-extra svg {
          color: #22c55e;
          margin-bottom: 10px;
        }

        .detail-extra h3 {
          margin: 0 0 6px;
          font-size: 0.98rem;
          color: var(--text, #0f172a);
          font-weight: 950;
          letter-spacing: -0.025em;
        }

        .detail-extra p {
          margin: 0;
          color: var(--muted, #64748b);
          font-size: 0.84rem;
          line-height: 1.55;
          font-weight: 550;
        }

        .detail-extra strong {
          color: var(--text, #0f172a);
          font-weight: 900;
        }

        @media (max-width: 990px) {
          .detail-shell {
            grid-template-columns: 1fr;
          }

          .media-card {
            position: relative;
            top: auto;
          }

          .media-card,
          .media-card img,
          .media-placeholder {
            min-height: 330px;
          }

          .benefits-list {
            grid-template-columns: 1fr;
          }

          .detail-extra {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 620px) {
          .product-detail-page {
            width: min(100% - 28px, 1120px);
            padding-top: 16px;
          }

          .back-link {
            margin-bottom: 14px;
          }

          .info-card {
            padding: 20px;
            border-radius: 22px;
          }

          .media-card {
            border-radius: 22px;
          }

          .media-card,
          .media-card img,
          .media-placeholder {
            min-height: 280px;
          }

          .top-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .purchase-box {
            grid-template-columns: 1fr;
            padding: 14px;
          }

          .detail-price-stack {
            align-items: center;
          }

          .detail-old-price {
            font-size: 1.35rem;
          }

          .sale-price {
            font-size: 1rem;
          }

          .delivery-box {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
};

export default React.memo(ProductDetails);