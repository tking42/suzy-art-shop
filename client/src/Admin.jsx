import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ConfirmModal from "./components/ConfirmModal";
import "./Admin.css";

const emptyForm = { name: "", description: "", price: "", stock: "", image: "" };

// Attach the admin JWT to every request from this page
const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
});

const Admin = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
      setProducts(res.data);
    } catch {
      setError("Failed to load products");
    }
  };

  const openAdd = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      stock: product.stock,
      image: product.image || "",
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
    setError("");
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
    };

    try {
      if (editingId) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/products/${editingId}`,
          payload,
          authHeaders()
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/products`,
          payload,
          authHeaders()
        );
      }
      await fetchProducts();
      cancelForm();
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogout();
      } else {
        setError(err.response?.data?.message || "Failed to save product");
      }
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/products/${deleteTarget._id}`,
        authHeaders()
      );
      await fetchProducts();
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogout();
      } else {
        setError("Failed to delete product");
      }
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div className="admin-page">
      {deleteTarget && (
        <ConfirmModal
          message={`Delete "${deleteTarget.name}"? This cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <header className="admin-header">
        <h1>Admin</h1>
        <button className="admin-btn" onClick={handleLogout}>Log Out</button>
      </header>

      <main className="admin-main">
        <div className="admin-section-header">
          <h2>Products</h2>
          {!showForm && (
            <button className="admin-btn admin-btn--primary" onClick={openAdd}>
              + Add Product
            </button>
          )}
        </div>

        {error && <p className="admin-error">{error}</p>}

        {showForm && (
          <form onSubmit={handleSubmit} className="admin-form">
            <h3>{editingId ? "Edit Product" : "New Product"}</h3>
            <div className="admin-form-grid">
              <div className="admin-field">
                <label>Name</label>
                <input name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="admin-field">
                <label>Price (£)</label>
                <input name="price" type="number" min="0" step="0.01" value={formData.price} onChange={handleChange} required />
              </div>
              <div className="admin-field">
                <label>Stock</label>
                <input name="stock" type="number" min="0" value={formData.stock} onChange={handleChange} required />
              </div>
              <div className="admin-field">
                <label>Image path or URL</label>
                <input name="image" value={formData.image} onChange={handleChange} placeholder="images/products/filename.jpg" />
              </div>
              <div className="admin-field admin-field--full">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} />
              </div>
            </div>
            <div className="admin-form-actions">
              <button type="button" className="admin-btn" onClick={cancelForm}>Cancel</button>
              <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
                {saving ? "Saving..." : editingId ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </form>
        )}

        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className={editingId === product._id ? "admin-row--editing" : ""}>
                <td>{product.name}</td>
                <td>£{product.price.toFixed(2)}</td>
                <td>{product.stock}</td>
                <td className="admin-actions">
                  <button className="admin-btn admin-btn--small" onClick={() => openEdit(product)}>Edit</button>
                  <button className="admin-btn admin-btn--small admin-btn--danger" onClick={() => setDeleteTarget(product)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default Admin;
