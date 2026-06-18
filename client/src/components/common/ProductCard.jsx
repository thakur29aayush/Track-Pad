import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Download,
  FileText,
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
  return amount <= 0 ? "Free" : `₹${amount.toLocaleString("en-IN")}`;
};

const getOldPrice = (price) => {
  const amount = Number(price || 0);
  if (amount <= 0) return null;
  return Math.round(amount * 2);
};

const ProductCard = ({ product }) => {
  if (!product) return null;

  const imageUrl = useMemo(
    () => getImageUrl(product.thumbnail || product.image),
    [product.thumbnail, product.image]
  );

  const oldPrice = useMemo(() => getOldPrice(product.price), [product.price]);
  const isFree = useMemo(() => Number(product.price || 0) <= 0, [product.price]);

  const formattedType = useMemo(() => formatLabel(product.type), [product.type]);
  const formattedDelivery = useMemo(
    () => formatLabel(product.deliveryType),
    [product.deliveryType]
  );

  const displayPrice = useMemo(() => formatPrice(product.price), [product.price]);

  return (
    <article className="product-card">
      <Link
        to={`/products/${product.slug}`}
        className="product-card-link"
        aria-label={`View details for ${product.title || "product"}`}
      >
        <div className="product-media">
          <div className="product-badges">
            {product.isFeatured && (
              <span className="floating-badge featured">
                <Star size={10} fill="currentColor" />
                Featured
              </span>
            )}
          </div>

          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.title || "Product thumbnail"}
              loading="lazy"
            />
          ) : (
            <div className="product-placeholder">
              <FileText size={34} strokeWidth={1.6} />
              <strong>
                {product.title?.trim()?.slice(0, 1)?.toUpperCase() || "P"}
              </strong>
            </div>
          )}

          <div className="media-overlay">
            <span>
              View details
              <ArrowRight size={13} strokeWidth={2.5} />
            </span>
          </div>
        </div>

        <div className="product-body">
          <div className="product-top-row">
            <span className="type-pill">
              <Zap size={10} fill="currentColor" />
              {formattedType}
            </span>

            <div className="price-stack">
              {oldPrice && !isFree && (
                <span className="old-price">
                  ₹{oldPrice.toLocaleString("en-IN")}
                </span>
              )}

              <strong className={isFree ? "free-price" : "sale-price"}>
                {displayPrice}
              </strong>
            </div>
          </div>

          <h3>{product.title || "Untitled Product"}</h3>

          <p>
            {product.description ||
              "No description available for this digital asset."}
          </p>

          <div className="product-info-row">
            <span>
              <Download size={13} />
              {formattedDelivery}
            </span>

            <span>
              <BadgeCheck size={13} />
              Instant access
            </span>
          </div>

          <div className="product-bottom">
            <span>Digital Assets</span>

            <div className="action-trigger">
              View product
              <ArrowRight size={14} strokeWidth={2.5} />
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
            radial-gradient(circle at top left, rgba(34, 197, 94, 0.07), transparent 34%),
            linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.015)),
            var(--card, #ffffff);
          border: 1px solid var(--border, #e2e8f0);
          box-shadow: var(--shadow, 0 18px 45px rgba(15, 23, 42, 0.06));
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
            radial-gradient(circle at top right, rgba(245, 216, 0, 0.12), transparent 38%),
            radial-gradient(circle at bottom left, rgba(34, 197, 94, 0.08), transparent 42%);
          opacity: 0;
          transition: opacity 0.22s ease;
          z-index: 1;
        }

        .product-card:hover {
          transform: translateY(-5px);
          border-color: rgba(34, 197, 94, 0.3);
          box-shadow:
            0 22px 48px rgba(15, 23, 42, 0.1),
            0 14px 26px rgba(34, 197, 94, 0.08);
        }

        .product-card:hover::before {
          opacity: 1;
        }

        .product-card-link {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          height: 100%;
          color: inherit;
          text-decoration: none;
        }

        .product-media {
          position: relative;
          height: 190px;
          overflow: hidden;
          background:
            linear-gradient(135deg, rgba(34, 197, 94, 0.08), rgba(245, 216, 0, 0.06)),
            var(--bg, #f8fafc);
          border-bottom: 1px solid var(--border, #e2e8f0);
        }

        .product-media img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
          display: block;
          padding: 12px;
          background: var(--bg, #f8fafc);
          transition:
            transform 0.35s ease,
            filter 0.35s ease;
        }

        .product-card:hover .product-media img {
          transform: scale(1.02);
          filter: saturate(1.05) contrast(1.02);
        }

        .product-badges {
          position: absolute;
          top: 12px;
          left: 12px;
          right: 12px;
          z-index: 4;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          pointer-events: none;
        }

        .floating-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 5px 8px;
          border-radius: 999px;
          font-size: 0.62rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 8px 18px rgba(15, 23, 42, 0.1);
        }

        .floating-badge.featured {
          color: #15803d;
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid rgba(34, 197, 94, 0.22);
        }

        .product-placeholder {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          color: #22c55e;
          opacity: 0.9;
        }

        .product-placeholder strong {
          font-size: 2.7rem;
          font-weight: 950;
          letter-spacing: -0.06em;
          line-height: 1;
        }

        .media-overlay {
          position: absolute;
          inset: 0;
          z-index: 3;
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
          padding: 12px;
          background:
            linear-gradient(to top, rgba(15, 23, 42, 0.34), transparent 58%);
          opacity: 0;
          transition: opacity 0.22s ease;
        }

        .product-card:hover .media-overlay {
          opacity: 1;
        }

        .media-overlay span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 12px;
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.92);
          color: #ffffff;
          font-size: 0.73rem;
          font-weight: 850;
          box-shadow: 0 12px 22px rgba(0, 0, 0, 0.22);
        }

        .product-body {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding: 15px;
        }

        .product-top-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 11px;
        }

        .type-pill {
          min-width: 0;
          max-width: 52%;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #22c55e;
          font-size: 0.64rem;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .price-stack {
          display: flex;
          align-items: flex-end;
          gap: 7px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .old-price {
          color: #ef4444;
          font-size: 1.02rem;
          font-weight: 950;
          line-height: 1;
          text-decoration: line-through;
          opacity: 0.88;
        }

        .sale-price {
          color: #16a34a;
          font-size: 0.82rem;
          font-weight: 900;
          line-height: 1;
          padding: 3px 8px;
          border-radius: 999px;
          background: rgba(34, 197, 94, 0.09);
          border: 1px solid rgba(34, 197, 94, 0.14);
        }

        .free-price {
          color: #16a34a;
          font-size: 1rem;
          font-weight: 950;
          line-height: 1;
        }

        .product-body h3 {
          margin: 0 0 7px;
          color: var(--text, #0f172a);
          font-size: 1.06rem;
          line-height: 1.25;
          letter-spacing: -0.025em;
          font-weight: 900;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-body p {
          min-height: 38px;
          margin: 0 0 13px;
          color: var(--muted, #64748b);
          font-size: 0.82rem;
          line-height: 1.48;
          font-weight: 550;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-info-row {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
          margin-top: auto;
          margin-bottom: 13px;
        }

        .product-info-row span {
          min-width: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 7px 9px;
          border-radius: 12px;
          background: var(--bg, #f8fafc);
          border: 1px solid var(--border, #e2e8f0);
          color: var(--muted, #64748b);
          font-size: 0.7rem;
          font-weight: 800;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .product-info-row svg {
          color: #22c55e;
          flex-shrink: 0;
        }

        .product-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding-top: 12px;
          border-top: 1px solid var(--border, #e2e8f0);
          color: var(--muted, #64748b);
          font-size: 0.76rem;
          font-weight: 800;
        }

        .product-bottom .action-trigger {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #16a34a;
          font-weight: 950;
          transition: transform 0.2s ease;
        }

        .product-card:hover .action-trigger {
          transform: translateX(4px);
        }

        @media (max-width: 520px) {
          .product-media {
            height: 165px;
          }

          .product-media img {
            padding: 10px;
          }

          .price-stack {
            flex-direction: column;
            align-items: flex-end;
            gap: 4px;
          }

          .product-info-row {
            grid-template-columns: 1fr;
            gap: 7px;
          }
        }
      `}</style>
    </article>
  );
};

export default React.memo(ProductCard);