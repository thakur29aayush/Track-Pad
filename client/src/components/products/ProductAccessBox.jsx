// ProductAccessBox.jsx
import { Download, ExternalLink, FileText } from "lucide-react";

const ProductAccessBox = ({ purchase }) => {
  const product = purchase.product;

  return (
    <article className="access-card">
      <div className="access-top">
        <div className="access-icon">
          <FileText size={18} />
        </div>

        <span>{product?.type?.replaceAll("_", " ") || "Product"}</span>
      </div>

      <h3>{product?.title}</h3>

      <p>{product?.description}</p>

      <div className="access-actions">
        {purchase.accessUrl && (
          <a href={purchase.accessUrl} target="_blank" rel="noreferrer">
            <ExternalLink size={14} />
            Open Link
          </a>
        )}

        {purchase.fileUrl && (
          <a href={purchase.fileUrl} target="_blank" rel="noreferrer">
            <Download size={14} />
            Download
          </a>
        )}
      </div>

      <style>{`
        .access-card {
          padding: 14px;
          border-radius: 18px;
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .access-card:hover {
          transform: translateY(-2px);
          border-color: rgba(22, 163, 74, 0.3);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
        }

        .access-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 10px;
        }

        .access-icon {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: rgba(22, 163, 74, 0.12);
          color: #16a34a;
        }

        .access-top span {
          color: #16a34a;
          font-size: 0.64rem;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-align: right;
        }

        .access-card h3 {
          margin: 0;
          color: var(--text);
          font-size: 1rem;
          line-height: 1.25;
          letter-spacing: -0.03em;
        }

        .access-card p {
          min-height: 40px;
          margin: 8px 0 12px;
          color: var(--muted);
          font-size: 0.82rem;
          line-height: 1.45;
        }

        .access-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          padding-top: 10px;
          border-top: 1px solid var(--border);
        }

        .access-actions a {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 7px 10px;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 900;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .access-actions a:first-child {
          background: linear-gradient(135deg, #16a34a, #d6b300);
          color: #08120c;
        }

        .access-actions a:last-child {
          background: var(--bg);
          color: #16a34a;
          border: 1px solid var(--border);
        }
      `}</style>
    </article>
  );
};

export default ProductAccessBox;