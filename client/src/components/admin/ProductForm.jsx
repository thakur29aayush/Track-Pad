import { useEffect, useRef, useState } from "react";
import { ImagePlus, Trash2, UploadCloud } from "lucide-react";
import Button from "../common/Button";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const getImageUrl = (image) => {
  if (!image) return "";
  if (image.startsWith("http")) return image;
  return `${API_URL}${image}`;
};

const initialState = {
  title: "",
  // description: "",
  pricingType: "PAID",
  price: 499,
  type: "DIGITAL_PRODUCT",
  deliveryType: "LINK",
  thumbnail: null,
  tutorialImage: null,
  deliveryUrl: "",
  fileUrl: "",
  isActive: true,
};

const ProductForm = ({
  product = null,
  onSubmit,
  submitLabel = "Save Product",
}) => {
  const thumbnailInputRef = useRef(null);
  const tutorialInputRef = useRef(null);

  const [form, setForm] = useState(initialState);

  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [tutorialPreview, setTutorialPreview] = useState("");

  const [thumbnailName, setThumbnailName] = useState("");
  const [tutorialName, setTutorialName] = useState("");

  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const isFree = form.pricingType === "FREE";

  const isLinkDelivery =
    form.deliveryType === "LINK" || form.deliveryType === "BOTH";

  const isFileDelivery =
    form.deliveryType === "FILE" || form.deliveryType === "BOTH";

  useEffect(() => {
    if (!product) {
      setForm(initialState);
      setThumbnailPreview("");
      setTutorialPreview("");
      setThumbnailName("");
      setTutorialName("");
      return;
    }

    setForm({
      title: product.title || "",
      // description: product.description || "",
      pricingType: Number(product.price || 0) <= 0 ? "FREE" : "PAID",
      price: Number(product.price || 0),
      type: product.type || "DIGITAL_PRODUCT",
      deliveryType: product.deliveryType || "LINK",
      thumbnail: null,
      tutorialImage: null,
      deliveryUrl: product.deliveryUrl || "",
      fileUrl: product.fileUrl || "",
      isActive: product.isActive ?? true,
    });

    setThumbnailPreview(getImageUrl(product.thumbnail));
    setTutorialPreview(getImageUrl(product.tutorialImage));

    setThumbnailName(product.thumbnail ? "Existing thumbnail image" : "");
    setTutorialName(product.tutorialImage ? "Existing tutorial image" : "");
  }, [product]);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePricingTypeChange = (value) => {
    setForm((prev) => ({
      ...prev,
      pricingType: value,
      price: value === "FREE" ? 0 : prev.price || 499,
    }));
  };

  const resetThumbnail = () => {
    update("thumbnail", null);
    setThumbnailPreview("");
    setThumbnailName("");

    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = "";
    }
  };

  const resetTutorialImage = () => {
    update("tutorialImage", null);
    setTutorialPreview("");
    setTutorialName("");

    if (tutorialInputRef.current) {
      tutorialInputRef.current.value = "";
    }
  };

  const handleImageChange = (e, field) => {
    const file = e.target.files?.[0];

    if (!file) {
      if (field === "thumbnail") resetThumbnail();
      if (field === "tutorialImage") resetTutorialImage();
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    update(field, file);

    if (field === "thumbnail") {
      setThumbnailName(file.name);
      setThumbnailPreview(previewUrl);
    }

    if (field === "tutorialImage") {
      setTutorialName(file.name);
      setTutorialPreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setStatus("");

    try {
      const formData = new FormData();

      formData.append("title", form.title.trim());
      // formData.append("description", form.description.trim());
      formData.append("price", isFree ? 0 : Number(form.price));
      formData.append("type", form.type);
      formData.append("deliveryType", form.deliveryType);
      formData.append("isActive", form.isActive);

      if (form.thumbnail) {
        formData.append("thumbnail", form.thumbnail);
      }

      if (form.tutorialImage) {
        formData.append("tutorialImage", form.tutorialImage);
      }

      if (isLinkDelivery) {
        formData.append("deliveryUrl", form.deliveryUrl.trim());
      }

      if (isFileDelivery) {
        formData.append("fileUrl", form.fileUrl.trim());
      }

      await onSubmit(formData);

      if (!product) {
        setForm(initialState);
        resetThumbnail();
        resetTutorialImage();
      }

      setStatus("Product saved successfully.");
    } catch (error) {
      setStatus(error.response?.data?.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="admin-product-form" onSubmit={handleSubmit}>
      <label>
        <span>Title</span>
        <input
          placeholder="Product title"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          required
        />
      </label>

      {/* <label>
        <span>Description</span>
        <textarea
          placeholder="Short product description"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          required
        />
      </label> */}

      <div className="form-row">
        <label>
          <span>Pricing</span>
          <select
            value={form.pricingType}
            onChange={(e) => handlePricingTypeChange(e.target.value)}
          >
            <option value="PAID">Paid</option>
            <option value="FREE">Free</option>
          </select>
        </label>

        <label className={isFree ? "field-muted" : ""}>
          <span>Price</span>
          <input
            type="number"
            min="0"
            placeholder="499"
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
            disabled={isFree}
            required={!isFree}
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          <span>Type</span>
          <select
            value={form.type}
            onChange={(e) => update("type", e.target.value)}
          >
            <option value="NOTION_TEMPLATE">Notion</option>
            <option value="HABIT_TRACKER">Habit</option>
            <option value="DIGITAL_PRODUCT">Digital</option>
            <option value="COUNSELLING">Counselling</option>
            <option value="OTHER">Other</option>
          </select>
        </label>

        <label>
          <span>Delivery Type</span>
          <select
            value={form.deliveryType}
            onChange={(e) => update("deliveryType", e.target.value)}
          >
            <option value="LINK">Link</option>
            <option value="FILE">File</option>
            <option value="BOTH">Both</option>
            <option value="BOOKING">Booking</option>
          </select>
        </label>
      </div>

      <div className="image-field">
        <span>Thumbnail Image</span>

        <input
          ref={thumbnailInputRef}
          type="file"
          accept="image/*"
          className="image-input"
          onChange={(e) => handleImageChange(e, "thumbnail")}
        />

        <div
          className={`image-uploader ${thumbnailPreview ? "has-preview" : ""}`}
          onClick={() => thumbnailInputRef.current?.click()}
          role="button"
          tabIndex={0}
        >
          {thumbnailPreview ? (
            <img src={thumbnailPreview} alt="Thumbnail preview" />
          ) : (
            <div className="image-empty">
              <div className="image-icon">
                <UploadCloud size={25} />
              </div>

              <div className="image-text">
                <strong>Upload product thumbnail</strong>
                <small>This appears on product cards and product details.</small>
              </div>

              <div className="image-choose-btn">
                <ImagePlus size={16} />
                Choose Thumbnail
              </div>
            </div>
          )}

          {thumbnailPreview && (
            <div className="image-change-btn">
              <ImagePlus size={16} />
              Change Thumbnail
            </div>
          )}
        </div>

        {thumbnailName && (
          <div className="image-meta">
            <p>{thumbnailName}</p>

            <button type="button" onClick={resetThumbnail}>
              <Trash2 size={13} />
              Remove
            </button>
          </div>
        )}
      </div>

      <div className="image-field">
        <span>Tutorial Image</span>

        <input
          ref={tutorialInputRef}
          type="file"
          accept="image/*"
          className="image-input"
          onChange={(e) => handleImageChange(e, "tutorialImage")}
        />

        <div
          className={`image-uploader ${tutorialPreview ? "has-preview" : ""}`}
          onClick={() => tutorialInputRef.current?.click()}
          role="button"
          tabIndex={0}
        >
          {tutorialPreview ? (
            <img src={tutorialPreview} alt="Tutorial preview" />
          ) : (
            <div className="image-empty">
              <div className="image-icon">
                <UploadCloud size={25} />
              </div>

              <div className="image-text">
                <strong>Upload tutorial image</strong>
                <small>This appears on the product details page.</small>
              </div>

              <div className="image-choose-btn">
                <ImagePlus size={16} />
                Choose Tutorial Image
              </div>
            </div>
          )}

          {tutorialPreview && (
            <div className="image-change-btn">
              <ImagePlus size={16} />
              Change Tutorial
            </div>
          )}
        </div>

        {tutorialName && (
          <div className="image-meta">
            <p>{tutorialName}</p>

            <button type="button" onClick={resetTutorialImage}>
              <Trash2 size={13} />
              Remove
            </button>
          </div>
        )}
      </div>

      <div className="form-row">
        <label className={!isLinkDelivery ? "field-muted" : ""}>
          <span>Delivery URL</span>
          <input
            type="url"
            placeholder="Private product link"
            value={form.deliveryUrl}
            onChange={(e) => update("deliveryUrl", e.target.value)}
            disabled={!isLinkDelivery}
          />
        </label>

        <label className={!isFileDelivery ? "field-muted" : ""}>
          <span>File URL</span>
          <input
            type="url"
            placeholder="Download file URL"
            value={form.fileUrl}
            onChange={(e) => update("fileUrl", e.target.value)}
            disabled={!isFileDelivery}
          />
        </label>
      </div>

      {isFree && (
        <p className="free-note">
          This product will be saved as free with price ₹0.
        </p>
      )}

      {status && <p className="form-status">{status}</p>}

      <Button type="submit" disabled={saving}>
        {saving ? "Saving..." : submitLabel}
      </Button>

      <style>{`
        .admin-product-form {
          display: grid;
          gap: 12px;
        }

        .admin-product-form label,
        .image-field {
          display: grid;
          gap: 6px;
        }

        .admin-product-form span,
        .image-field > span {
          color: var(--text);
          font-size: 0.74rem;
          font-weight: 900;
          letter-spacing: 0.01em;
        }

        .admin-product-form input,
        .admin-product-form textarea,
        .admin-product-form select {
          width: 100%;
          min-height: 42px;
          border: 1px solid var(--border);
          outline: none;
          border-radius: 12px;
          background: var(--bg);
          color: var(--text);
          padding: 9px 11px;
          font-size: 0.84rem;
          font-weight: 700;
          transition:
            border-color 0.18s ease,
            box-shadow 0.18s ease,
            opacity 0.18s ease;
        }

        .admin-product-form textarea {
          min-height: 76px;
          resize: vertical;
          line-height: 1.45;
        }

        .admin-product-form select {
          cursor: pointer;
        }

        .admin-product-form input:focus,
        .admin-product-form textarea:focus,
        .admin-product-form select:focus {
          border-color: rgba(22, 163, 74, 0.55);
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.09);
        }

        .admin-product-form input:disabled {
          opacity: 0.48;
          cursor: not-allowed;
        }

        .field-muted span {
          color: var(--muted);
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .image-input {
          display: none;
        }

        .image-uploader {
          width: 100%;
          min-height: 230px;
          overflow: hidden;
          border-radius: 14px;
          border: 1px dashed rgba(22, 163, 74, 0.45);
          background:
            radial-gradient(circle at top left, rgba(22, 163, 74, 0.16), transparent 34%),
            radial-gradient(circle at bottom right, rgba(214, 179, 0, 0.14), transparent 30%),
            var(--bg);
          cursor: pointer;
          display: grid;
          place-items: center;
          padding: 22px 16px;
          transition:
            transform 0.18s ease,
            border-color 0.18s ease,
            box-shadow 0.18s ease;
        }

        .image-uploader:hover {
          transform: translateY(-1px);
          border-color: rgba(22, 163, 74, 0.8);
          box-shadow: 0 14px 30px rgba(0, 0, 0, 0.08);
        }

        .image-uploader.has-preview {
          position: relative;
          padding: 0;
          border-style: solid;
        }

        .image-uploader img {
          width: 100%;
          height: 230px;
          object-fit: contain;
          background: #fff;
          display: block;
        }

        .image-empty {
          width: 100%;
          display: grid;
          place-items: center;
          gap: 16px;
          text-align: center;
        }

        .image-icon {
          width: 70px;
          height: 70px;
          display: grid;
          place-items: center;
          border-radius: 18px;
          color: #16a34a;
          background: rgba(22, 163, 74, 0.12);
          border: 1px solid rgba(22, 163, 74, 0.22);
        }

        .image-text {
          display: grid;
          gap: 7px;
        }

        .image-text strong {
          color: var(--text);
          font-size: 1rem;
          font-weight: 950;
          letter-spacing: -0.02em;
        }

        .image-text small {
          color: var(--muted);
          font-size: 0.76rem;
          font-weight: 800;
        }

        .image-choose-btn,
        .image-change-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: min(100%, 340px);
          min-height: 44px;
          padding: 10px 18px;
          border-radius: 999px;
          background: rgba(3, 9, 5, 0.72);
          color: #fff;
          font-size: 0.84rem;
          font-weight: 950;
          backdrop-filter: blur(12px);
        }

        .image-change-btn {
          position: absolute;
          left: 14px;
          right: 14px;
          bottom: 14px;
          width: auto;
        }

        .image-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 9px 11px;
          border-radius: 12px;
          background: var(--bg);
          border: 1px solid var(--border);
        }

        .image-meta p {
          margin: 0;
          color: var(--muted);
          font-size: 0.78rem;
          font-weight: 800;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .image-meta button {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          border: 0;
          background: rgba(220, 38, 38, 0.09);
          color: #dc2626;
          padding: 6px 9px;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 900;
          cursor: pointer;
          white-space: nowrap;
        }

        .free-note,
        .form-status {
          margin: 0;
          padding: 9px 11px;
          border-radius: 11px;
          background: rgba(22, 163, 74, 0.1);
          color: #16a34a;
          font-size: 0.8rem;
          font-weight: 800;
          line-height: 1.45;
        }

        .admin-product-form .btn {
          width: 100%;
          margin-top: 2px;
          padding: 11px 14px;
          font-size: 0.86rem;
        }

        @media (max-width: 560px) {
          .form-row {
            grid-template-columns: 1fr;
          }

          .image-uploader {
            min-height: 210px;
            padding: 20px 14px;
          }

          .image-uploader img {
            height: 210px;
          }

          .image-icon {
            width: 64px;
            height: 64px;
            border-radius: 16px;
          }
        }
      `}</style>
    </form>
  );
};

export default ProductForm;