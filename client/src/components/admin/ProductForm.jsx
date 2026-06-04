import { useState } from "react";
import Button from "../common/Button";

const initialState = {
  title: "",
  description: "",
  price: 499,
  type: "DIGITAL_PRODUCT",
  deliveryType: "LINK",
  thumbnail: "",
  deliveryUrl: "",
  fileUrl: "",
  isActive: true,
};

const ProductForm = ({ onSubmit }) => {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState("");

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await onSubmit({
        ...form,
        price: Number(form.price),
        thumbnail: form.thumbnail || null,
        deliveryUrl: form.deliveryUrl || null,
        fileUrl: form.fileUrl || null,
      });

      setForm(initialState);
      setStatus("Product saved.");
    } catch (error) {
      setStatus(error.response?.data?.message || "Failed to save product.");
    }
  };

  return (
    <form className="form card" onSubmit={handleSubmit}>
      <h2>Add Product</h2>

      <input className="input" placeholder="Title" value={form.title} onChange={(e) => update("title", e.target.value)} required />

      <textarea className="textarea" placeholder="Description" value={form.description} onChange={(e) => update("description", e.target.value)} required />

      <input className="input" type="number" placeholder="Price" value={form.price} onChange={(e) => update("price", e.target.value)} required />

      <select className="select" value={form.type} onChange={(e) => update("type", e.target.value)}>
        <option value="NOTION_TEMPLATE">Notion Template</option>
        <option value="HABIT_TRACKER">Habit Tracker</option>
        <option value="DIGITAL_PRODUCT">Digital Product</option>
        <option value="COUNSELLING">Counselling</option>
        <option value="OTHER">Other</option>
      </select>

      <select className="select" value={form.deliveryType} onChange={(e) => update("deliveryType", e.target.value)}>
        <option value="LINK">Link</option>
        <option value="FILE">File</option>
        <option value="BOTH">Both</option>
        <option value="BOOKING">Booking</option>
      </select>

      <input className="input" placeholder="Thumbnail URL" value={form.thumbnail} onChange={(e) => update("thumbnail", e.target.value)} />

      <input className="input" placeholder="Delivery URL" value={form.deliveryUrl} onChange={(e) => update("deliveryUrl", e.target.value)} />

      <input className="input" placeholder="File URL" value={form.fileUrl} onChange={(e) => update("fileUrl", e.target.value)} />

      {status && <p>{status}</p>}

      <Button type="submit">Save Product</Button>
    </form>
  );
};

export default ProductForm;