import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Download,
  FileText,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const getImageUrl = (thumbnail) => {
  if (!thumbnail) return null;
  if (thumbnail.startsWith("http")) return thumbnail;

  return `${API_URL}${thumbnail}`;
};

const formatLabel = (value) => {
  if (!value) return "Digital Product";

  return String(value)
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatPrice = (price) => {
  const amount = Number(price || 0);

  if (amount <= 0) return "Free";

  return `₹${amount.toLocaleString("en-IN")}`;
};

const getOldPrice = (price) => {
  const amount = Number(price || 0);
  if (amount <= 0) return null;

  return Math.round(amount * 1.5);
};

const isNewProduct = (createdAt) => {
  if (!createdAt) return false;

  const created = new Date(createdAt).getTime();
  if (Number.isNaN(created)) return false;

  const diffDays = (Date.now() - created) / (1000 * 60 * 60 * 24);

  return diffDays <= 14;
};

const ProductCard = ({ product }) => {
  const imageUrl = getImageUrl(product.thumbnail || product.image);
  const oldPrice = getOldPrice(product.price);
  const isFree = Number(product.price || 0) <= 0;
  const isNew = isNewProduct(product.createdAt);

  return (
    <article className="product-card">
      <Link to={`/products/${product.slug}`} className="product-card-link">
        <div className="product-media">
          <div className="product-badges">
            {product.isFeatured && (
              <span className="floating-badge featured">
                <Star size={11} />
                Featured
              </span>
            )}

            {isNew && (
              <span className="floating-badge new">
                <Sparkles size={11} />
                New
              </span>
            )}
          </div>

          {imageUrl ? (
            <img src={imageUrl} alt={product.title || "Product"} />
          ) : (
            <div className="product-placeholder">
              <FileText size={38} />
              <strong>{product.title?.slice(0, 1) || "P"}</strong>
            </div>
          )}

          <div className="media-overlay">
            <span>
              View details
              <ArrowRight size={13} />
            </span>
          </div>
        </div>

        <div className="product-body">
          <div className="product-meta">
            <span className="type-pill">
              <Zap size={11} />
              {formatLabel(product.type)}
            </span>

            <div className="price-stack">
              {oldPrice && !isFree && (
                <span className="old-price">
                  ₹{oldPrice.toLocaleString("en-IN")}
                </span>
              )}

              <strong className={isFree ? "free-price" : ""}>
                {formatPrice(product.price)}
              </strong>
            </div>
          </div>

          <h3>{product.title || "Untitled Product"}</h3>

          <p>{product.description || "No description available."}</p>

          <div className="product-info-row">
            <span>
              <Download size={13} />
              {formatLabel(product.deliveryType)}
            </span>

            <span>
              <BadgeCheck size={13} />
              Instant access
            </span>
          </div>

          <div className="product-bottom">
            <span>Digital product</span>

            <div>
              View product
              <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </Link>

      <style>{`
        .product-card {
          position: relative;
          overflow: hidden;
          border-radius: 22px;
          background:
            linear-gradient(180deg, rgba(22,163,74,0.025), transparent 42%),
            var(--card);
          border: 1px solid var(--border);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.055);
          transition:
            transform 0.22s ease,
            border-color 0.22s ease,
            box-shadow 0.22s ease;
        }

        .product-card::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(circle at top left, rgba(22,163,74,0.12), transparent 34%),
            radial-gradient(circle at bottom right, rgba(214,179,0,0.10), transparent 32%);
          opacity: 0;
          transition: opacity 0.22s ease;
        }

        .product-card:hover {
          transform: translateY(-5px);
          border-color: rgba(22, 163, 74, 0.36);
          box-shadow: 0 20px 48px rgba(0, 0, 0, 0.105);
        }

        .product-card:hover::before {
          opacity: 1;
        }

        .product-card-link {
          position: relative;
          z-index: 1;
          display: block;
          color: inherit;
          text-decoration: none;
          height: 100%;
        }

        .product-media {
          position: relative;
          height: 178px;
          overflow: hidden;
          background:
            linear-gradient(135deg, rgba(22, 163, 74, 0.14), rgba(214, 179, 0, 0.09)),
            var(--bg);
          border-bottom: 1px solid var(--border);
        }

        .product-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.28s ease, filter 0.28s ease;
        }

        .product-card:hover .product-media img {
          transform: scale(1.055);
          filter: saturate(1.05);
        }

        .product-badges {
          position: absolute;
          top: 11px;
          left: 11px;
          right: 11px;
          z-index: 3;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          pointer-events: none;
        }

        .floating-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 8px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          backdrop-filter: blur(12px);
          box-shadow: 0 10px 22px rgba(0,0,0,0.10);
        }

        .floating-badge.featured {
          color: #16a34a;
          background: rgba(255,255,255,0.88);
          border: 1px solid rgba(22,163,74,0.22);
        }

        .floating-badge.new {
          margin-left: auto;
          color: #9a7a00;
          background: rgba(255,255,255,0.88);
          border: 1px solid rgba(214,179,0,0.28);
        }

        .product-placeholder {
          height: 100%;
          display: grid;
          place-items: center;
          gap: 5px;
          color: #16a34a;
        }

        .product-placeholder strong {
          font-size: 3.1rem;
          font-weight: 950;
          letter-spacing: -0.08em;
          line-height: 0.8;
        }

        .media-overlay {
          position: absolute;
          inset: auto 12px 12px 12px;
          z-index: 2;
          display: flex;
          justify-content: flex-end;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.2s ease, transform 0.2s ease;
        }

        .product-card:hover .media-overlay {
          opacity: 1;
          transform: translateY(0);
        }

        .media-overlay span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 10px;
          border-radius: 999px;
          background: rgba(15,23,42,0.78);
          color: white;
          font-size: 0.74rem;
          font-weight: 900;
          backdrop-filter: blur(12px);
        }

        .product-body {
          padding: 16px;
        }

        .product-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 11px;
        }

        .type-pill {
          min-width: 0;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #16a34a;
          font-size: 0.66rem;
          font-weight: 950;
          letter-spacing: 0.095em;
          text-transform: uppercase;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .price-stack {
          display: inline-flex;
          align-items: baseline;
          gap: 7px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .old-price {
          color: var(--muted);
          font-size: 0.76rem;
          font-weight: 850;
          text-decoration: line-through;
          opacity: 0.72;
        }

        .price-stack strong {
          color: var(--text);
          font-size: 1.04rem;
          font-weight: 950;
          letter-spacing: -0.035em;
        }

        .price-stack .free-price {
          color: #16a34a;
        }

        .product-body h3 {
          margin: 0;
          color: var(--text);
          font-size: 1.12rem;
          line-height: 1.22;
          letter-spacing: -0.04em;
          font-weight: 950;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-body p {
          min-height: 44px;
          margin: 9px 0 13px;
          color: var(--muted);
          font-size: 0.85rem;
          line-height: 1.52;
          font-weight: 600;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-info-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 13px;
        }

        .product-info-row span {
          min-width: 0;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 9px;
          border-radius: 12px;
          background: var(--bg);
          border: 1px solid var(--border);
          color: var(--muted);
          font-size: 0.72rem;
          font-weight: 850;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .product-info-row svg {
          color: #16a34a;
          flex-shrink: 0;
        }

        .product-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding-top: 13px;
          border-top: 1px solid var(--border);
          color: var(--muted);
          font-size: 0.8rem;
          font-weight: 850;
        }

        .product-bottom > span {
          white-space: nowrap;
        }

        .product-bottom div {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #16a34a;
          font-weight: 950;
          white-space: nowrap;
          transition: transform 0.18s ease;
        }

        .product-card:hover .product-bottom div {
          transform: translateX(2px);
        }

        @media (max-width: 520px) {
          .product-media {
            height: 165px;
          }

          .product-info-row {
            grid-template-columns: 1fr;
          }

          .product-bottom {
            align-items: flex-start;
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>
    </article>
  );
};

export default ProductCard;