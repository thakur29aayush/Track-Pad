import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/common/Button";
import { getProductBySlug } from "../services/productApi";
import { createPaymentOrder, verifyPayment } from "../services/paymentApi";
import { useAuth } from "../context/AuthContext";

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("Loading...");
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProductBySlug(slug);
        setProduct(data);
        setStatus("");
      } catch {
        setStatus("Product not found.");
      }
    };

    load();
  }, [slug]);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBuy = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setPaying(true);

    try {
      const loaded = await loadRazorpay();

      if (!loaded) {
        alert("Razorpay failed to load.");
        return;
      }

      const data = await createPaymentOrder([product.id]);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.razorpayOrder.amount,
        currency: data.razorpayOrder.currency,
        name: "GreenVault",
        description: product.title,
        order_id: data.razorpayOrder.id,
        method: {
          upi: true,
          card: false,
          netbanking: false,
          wallet: false,
        },
        handler: async function (response) {
          await verifyPayment({
            orderId: data.order.id,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });

          navigate("/checkout-success");
        },
        prefill: {
          email: user.email,
        },
        theme: {
          color: "#16a34a",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      alert(error.response?.data?.message || "Payment failed.");
    } finally {
      setPaying(false);
    }
  };

  if (status) return <p>{status}</p>;
  if (!product) return null;

  return (
    <section className="grid">
      <div className="card">
        {product.thumbnail ? (
          <img src={product.thumbnail} alt={product.title} className="product-img" />
        ) : (
          <div className="product-img" />
        )}

        <p className="badge">{product.type.replaceAll("_", " ")}</p>
        <h1>{product.title}</h1>
        <p>{product.description}</p>
        <h2>₹{product.price}</h2>
        <p>Delivery: {product.deliveryType}</p>

        <Button onClick={handleBuy} disabled={paying}>
          {paying ? "Opening Payment..." : "Buy with UPI"}
        </Button>
      </div>
    </section>
  );
};

export default ProductDetails;