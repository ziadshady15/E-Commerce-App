import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import Toast from "../components/Toast";
import { useAuth } from "../context/AuthContext";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

function validateProfile(values) {
  const errors = {};
  if (!values.name.trim())  errors.name  = "Name is required";
  if (!values.email) {
    errors.email = "Email is required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = "Enter a valid email";
  }
  if (values.password && values.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }
  if (values.profilePicture && !/^https?:\/\/.+/i.test(values.profilePicture)) {
    errors.profilePicture = "Must be a valid URL (starting with http or https)";
  }
  return errors;
}

const STATUS_CLASS = {
  pending:    "badge-pending",
  processing: "badge-processing",
  shipped:    "badge-shipped",
  delivered:  "badge-delivered",
  cancelled:  "badge-cancelled",
};

const TABS = [
  { key: "overview", icon: "bi-person",      label: "Overview" },
  { key: "orders",   icon: "bi-bag",         label: "My Orders" },
  { key: "settings", icon: "bi-gear",        label: "Settings" },
];

function Profile() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchProfile();
    fetchOrders();
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load profile");
      const data = await res.json();
      setProfile(data);
      formik.setValues({
        name: data.name || "",
        email: data.email || "",
        password: "",
        profilePicture: data.profilePicture || "",
      });
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    }
  };

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "", profilePicture: "" },
    validate: validateProfile,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setStatus(null);
      try {
        const body = { name: values.name, email: values.email };
        if (values.password) body.password = values.password;
        if (values.profilePicture) body.profilePicture = values.profilePicture;

        const res = await fetch(`${API_URL}/users/profile`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const data = await res.json();
          setStatus(data.message || "Update failed");
          return;
        }
        setToast({ message: "Profile updated successfully!", type: "success" });
        formik.setFieldValue("password", "");
        fetchProfile();
      } catch (err) {
        setStatus("Network error. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  if (loading) return <div className="container py-5 text-center text-muted">Loading...</div>;

  return (
    <div className="container py-4 py-md-5">
      <div className="row g-3">
        {/* Sidebar */}
        <div className="col-12 col-md-3">
          <div className="af-card" style={{ cursor: "default" }}>
            <div className="p-3 pb-2" style={{ borderBottom: "1px solid var(--border)" }}>
              <p className="mb-0" style={{ fontWeight: 600, fontSize: "0.85rem" }}>Account</p>
              <small className="text-muted">{profile?.role === "admin" ? "Admin Member" : "Premium Member"}</small>
            </div>
            {TABS.map((tab) => (
              <button
                key={tab.key}
                className={`sidebar-nav-item ${activeTab === tab.key ? "active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <i className={`bi ${tab.icon}`}></i>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main */}
        <div className="col-12 col-md-9">

          {/* ── Overview ── */}
          {activeTab === "overview" && (
            <div>
              <h2 className="serif mb-1">Overview</h2>
              <p className="text-muted mb-4" style={{ fontSize: "0.88rem" }}>A curated view of your activity.</p>

              {/* Stats */}
              <div className="row g-3 mb-4">
                {[
                  { label: "Orders Placed", value: orders.length,        badge: "ACTIVE" },
                  { label: "Total Spent",   value: `$${orders.reduce((s, o) => s + o.totalPrice, 0).toFixed(0)}`, badge: "TOTAL" },
                  { label: "Membership",    value: profile?.role === "admin" ? "Admin" : "Gold", badge: "TIER" },
                ].map((stat) => (
                  <div className="col-12 col-sm-4" key={stat.label}>
                    <div className="af-card p-3" style={{ cursor: "default" }}>
                      <small className="eyebrow">{stat.badge}</small>
                      <p className="serif mb-0" style={{ fontSize: "1.8rem" }}>{stat.value}</p>
                      <small className="text-muted" style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>{stat.label}</small>
                    </div>
                  </div>
                ))}
              </div>

              {/* User Card */}
              <div className="af-card p-3 mb-4 d-flex align-items-center gap-3" style={{ cursor: "default" }}>
                <div className="af-avatar">
                  {profile?.profilePicture
                    ? <img src={profile.profilePicture} alt="avatar" />
                    : profile?.name?.[0]?.toUpperCase()
                  }
                </div>
                <div className="flex-grow-1">
                  <p className="mb-0" style={{ fontWeight: 600 }}>{profile?.name}</p>
                  <small className="text-muted">{profile?.email}</small>
                </div>
                <button className="btn-af-outline btn-af-sm" onClick={() => setActiveTab("settings")}>
                  Edit Profile
                </button>
              </div>

              {/* Recent Orders */}
              <h5 className="serif mb-3">Recent Orders</h5>
              {orders.length === 0
                ? <p className="text-muted" style={{ fontSize: "0.88rem" }}>No orders yet.</p>
                : orders.slice(0, 3).map((order) => (
                    <div key={order._id} className="af-card p-3 mb-2" style={{ cursor: "default" }}>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <p className="mb-0" style={{ fontWeight: 600, fontSize: "0.88rem" }}>
                            Order #{order._id.slice(-8).toUpperCase()}
                          </p>
                          <small className="text-muted">Placed {formatDate(order.createdAt)}</small>
                          <div className="mt-1">
                            <span className={`status-badge ${STATUS_CLASS[order.status] || ""}`}>{order.status}</span>
                          </div>
                        </div>
                        <strong>${order.totalPrice.toFixed(2)}</strong>
                      </div>
                    </div>
                  ))
              }
              {orders.length > 3 && (
                <button className="btn-af-outline btn-af-sm mt-2" onClick={() => setActiveTab("orders")}>
                  View all orders →
                </button>
              )}
            </div>
          )}

          {/* ── Orders ── */}
          {activeTab === "orders" && (
            <div>
              <h2 className="serif mb-1">My Orders</h2>
              <p className="text-muted mb-4" style={{ fontSize: "0.88rem" }}>Track and manage your frame orders.</p>

              {orders.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-bag" style={{ fontSize: "3rem", color: "var(--gray)" }}></i>
                  <h5 className="serif mt-3 mb-2">No orders yet</h5>
                  <button className="btn-af" onClick={() => navigate("/gallery")}>Browse Gallery</button>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order._id} className="af-card p-4 mb-3" style={{ cursor: "default" }}>
                    <div className="d-flex justify-content-between mb-2">
                      <div>
                        <p className="mb-0" style={{ fontWeight: 600 }}>Order #{order._id.slice(-8).toUpperCase()}</p>
                        <small className="text-muted">Placed {formatDate(order.createdAt)}</small>
                      </div>
                      <div className="text-end">
                        <strong>${order.totalPrice.toFixed(2)}</strong><br />
                        <span className={`status-badge ${STATUS_CLASS[order.status] || ""}`}>{order.status}</span>
                      </div>
                    </div>
                    <hr style={{ borderColor: "var(--border)" }} />
                    {order.items.map((item, i) => (
                      <div key={i} className="d-flex justify-content-between mb-1">
                        <small className="text-muted">{item.product?.name || "Frame"} × {item.quantity}</small>
                        <small>${(item.price * item.quantity).toFixed(2)}</small>
                      </div>
                    ))}
                    {order.shippingAddress && (
                      <small className="text-muted d-block mt-2">
                        📍 {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.country}
                      </small>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* ── Settings ── */}
          {activeTab === "settings" && (
            <div>
              <h2 className="serif mb-1">Account Settings</h2>
              <p className="text-muted mb-4" style={{ fontSize: "0.88rem" }}>Update your personal information.</p>

              <div className="af-card p-4" style={{ maxWidth: 500, cursor: "default" }}>
                {formik.status && (
                  <div className="alert alert-danger py-2 mb-3" style={{ borderRadius: 0, fontSize: "0.83rem" }}>
                    {formik.status}
                  </div>
                )}

                <form onSubmit={formik.handleSubmit} noValidate>
                  {/* Profile Picture Preview */}
                  {formik.values.profilePicture && !formik.errors.profilePicture && (
                    <div className="mb-3 text-center">
                      <div className="af-avatar mx-auto" style={{ width: 80, height: 80, fontSize: "2rem" }}>
                        <img src={formik.values.profilePicture} alt="preview" />
                      </div>
                    </div>
                  )}

                  {/* Profile Picture URL */}
                  <div className="mb-3">
                    <label className="af-label">Profile Picture URL</label>
                    <input
                      type="text"
                      name="profilePicture"
                      className={`af-input ${formik.touched.profilePicture && formik.errors.profilePicture ? "is-invalid" : ""}`}
                      value={formik.values.profilePicture}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="https://example.com/photo.jpg"
                    />
                    {formik.touched.profilePicture && formik.errors.profilePicture && (
                      <p className="af-error">{formik.errors.profilePicture}</p>
                    )}
                  </div>

                  {/* Name */}
                  <div className="mb-3">
                    <label className="af-label">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      className={`af-input ${formik.touched.name && formik.errors.name ? "is-invalid" : ""}`}
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <p className="af-error">{formik.errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label className="af-label">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      className={`af-input ${formik.touched.email && formik.errors.email ? "is-invalid" : ""}`}
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <p className="af-error">{formik.errors.email}</p>
                    )}
                  </div>

                  {/* New Password */}
                  <div className="mb-4">
                    <label className="af-label">New Password (leave blank to keep current)</label>
                    <input
                      type="password"
                      name="password"
                      className={`af-input ${formik.touched.password && formik.errors.password ? "is-invalid" : ""}`}
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="••••••••"
                    />
                    {formik.touched.password && formik.errors.password && (
                      <p className="af-error">{formik.errors.password}</p>
                    )}
                  </div>

                  <button type="submit" className="btn-af w-100" disabled={formik.isSubmitting}>
                    {formik.isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </form>

                <hr style={{ borderColor: "var(--border)", marginTop: 24, marginBottom: 20 }} />
                <button
                  className="btn-af-outline w-100"
                  style={{ borderColor: "#c0392b", color: "#c0392b" }}
                  onClick={() => { logout(); navigate("/"); }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

export default Profile;
