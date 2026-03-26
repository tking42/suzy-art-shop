import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ConfirmModal from "./components/ConfirmModal";
import { ToastContext } from "./context/ToastContext";
import "./Admin.css";

const emptyForm = { name: "", description: "", price: "", stock: "", image: "" };
const API = import.meta.env.VITE_API_URL;
const SERVER_BASE = API.replace(/\/api$/, "");

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
});

const Admin = () => {
  const navigate = useNavigate();
  const { addToast } = useContext(ToastContext);
  const [tab, setTab] = useState("products");

  // ── Products state ──────────────────────────────────
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [uploading, setUploading] = useState(false);

  // ── Orders state ────────────────────────────────────
  const [orders, setOrders] = useState([]);
  const [shipTarget, setShipTarget] = useState(null);

  // ── Shared state ────────────────────────────────────
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  // ── Products ────────────────────────────────────────

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/products`);
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("image", file);
      const res = await axios.post(`${API}/upload`, form, {
        headers: {
          ...authHeaders().headers,
          "Content-Type": "multipart/form-data",
        },
      });
      setFormData((prev) => ({ ...prev, image: res.data.url }));
    } catch {
      setError("Image upload failed");
    } finally {
      setUploading(false);
    }
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
        await axios.put(`${API}/products/${editingId}`, payload, authHeaders());
        addToast("Product updated");
      } else {
        await axios.post(`${API}/products`, payload, authHeaders());
        addToast("Product added");
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
      await axios.delete(`${API}/products/${deleteTarget._id}`, authHeaders());
      await fetchProducts();
      addToast("Product deleted");
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

  // ── Orders ──────────────────────────────────────────

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API}/orders`, authHeaders());
      setOrders(res.data);
    } catch {
      setError("Failed to load orders");
    }
  };

  const confirmShip = async () => {
    try {
      const res = await axios.put(`${API}/orders/${shipTarget._id}/ship`, {}, authHeaders());
      setOrders((prev) => prev.map((o) => (o._id === res.data._id ? res.data : o)));
      addToast("Order marked as shipped — customer notified");
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogout();
      } else {
        addToast("Failed to mark order as shipped", "error");
      }
    } finally {
      setShipTarget(null);
    }
  };

  const formatAddress = (addr) => {
    if (!addr) return "—";
    return [addr.name, addr.line1, addr.line2, addr.city, addr.postcode]
      .filter(Boolean)
      .join(", ");
  };

  // ── Auth ────────────────────────────────────────────

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
      {shipTarget && (
        <ConfirmModal
          message={`Mark order from ${shipTarget.email} as shipped? A shipping email will be sent to the customer.`}
          onConfirm={confirmShip}
          onCancel={() => setShipTarget(null)}
        />
      )}

      <header className="admin-header">
        <h1>Admin</h1>
        <button className="admin-btn" onClick={handleLogout}>Log Out</button>
      </header>

      <main className="admin-main">
        <div className="admin-tabs">
          <button
            className={`admin-tab${tab === "products" ? " admin-tab--active" : ""}`}
            onClick={() => { setTab("products"); setError(""); }}
          >
            Products
          </button>
          <button
            className={`admin-tab${tab === "orders" ? " admin-tab--active" : ""}`}
            onClick={() => { setTab("orders"); setError(""); fetchOrders(); }}
          >
            Orders
          </button>
        </div>

        {error && <p className="admin-error">{error}</p>}

        {/* ── Products Tab ── */}
        {tab === "products" && (
          <>
            <div className="admin-section-header">
              <h2>Products</h2>
              {!showForm && (
                <button className="admin-btn admin-btn--primary" onClick={openAdd}>
                  + Add Product
                </button>
              )}
            </div>

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
                    <label>Image</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                    {uploading && <span style={{ fontSize: "0.8rem", color: "#555" }}>Uploading...</span>}
                    {formData.image && (
                      <img
                        src={formData.image.startsWith("/uploads") ? `${SERVER_BASE}${formData.image}` : formData.image}
                        alt="preview"
                        style={{ marginTop: 8, maxHeight: 120, maxWidth: "100%", objectFit: "contain" }}
                      />
                    )}
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
          </>
        )}

        {/* ── Orders Tab ── */}
        {tab === "orders" && (
          <>
            <div className="admin-section-header">
              <h2>Orders</h2>
            </div>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Ship To</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td style={{ whiteSpace: "nowrap" }}>{new Date(order.createdAt).toLocaleDateString("en-GB")}</td>
                    <td>{order.email || "—"}</td>
                    <td>
                      {order.items.map((item) => (
                        <div key={item._id} style={{ fontSize: "0.85rem" }}>
                          {item.name} x{item.quantity}
                        </div>
                      ))}
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>£{order.total.toFixed(2)}</td>
                    <td style={{ fontSize: "0.85rem" }}>{formatAddress(order.shippingAddress)}</td>
                    <td>
                      <span className={`admin-status admin-status--${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      {order.status === "Paid" && (
                        <button
                          className="admin-btn admin-btn--small admin-btn--primary"
                          onClick={() => setShipTarget(order)}
                        >
                          Mark Shipped
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", color: "#999", padding: "32px 0" }}>No orders yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </main>
    </div>
  );
};

export default Admin;
