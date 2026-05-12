import { useState, useEffect } from "react";
import Toast from "../components/Toast";
import { useAuth } from "../context/AuthContext";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"];

// le kol status css class
const STATUS_CLASS = {
  pending:    "badge-pending",
  processing: "badge-processing",
  shipped:    "badge-shipped",
  delivered:  "badge-delivered",
  cancelled:  "badge-cancelled",
};

function AdminOrders() {
  const { token } = useAuth();

  const [orders, setOrders]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [toast, setToast]         = useState(null);
  const [updatingId, setUpdatingId] = useState(null); //3lshan 23rf anhy order ely byt3mlo update

  // awl ma el page tfth y3ml fetch lel orders 3alatol
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) 
        throw new Error("Failed to load orders");
      const data = await res.json(); //bnhwlha le json 
      setOrders(Array.isArray(data) ? data : []);//ne handle lw el data msh array tb2a fadya
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId); 
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) 
        throw new Error("Failed to update status");

      setToast({ message: "Order status updated!", type: "success" });

      // Update the order in local state so the UI changes immediately without refetching
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))//nlf 3ala kol el orders we ne check bel order id lw hwa hn8yr el status
      );
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    }
    setUpdatingId(null);
  };
//y3ml handle lel date bas msh aktr yb2a readable aktr may 11,2026 msln
  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day:   "numeric",
      year:  "numeric",
    });

  // UI 
  if (error) return (
    <div className="alert alert-danger">{error}</div>
  );

  return (
    <div className="container py-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="serif mb-0">Orders</h4>
          <small className="text-muted">{orders.length} total</small>
        </div>
      </div>

      {/* Loading skeletons */}
      {loading ? (
        <div>
          {[1, 2, 3].map((n) => (
            <div key={n} className="placeholder-glow mb-3">
              <div className="placeholder w-100" style={{ height: 80 }}></div>
            </div>
          ))}
        </div>

      ) : orders.length === 0 ? (
        <div className="text-center py-5 text-muted">No orders yet.</div>

      ) : (
        // Orders list
        <div className="card">
          {orders.map((order, i) => (
            <div
              key={order._id}
              className="p-3"
              style={{ borderBottom: i < orders.length - 1 ? "1px solid #dee2e6" : "none" }}
            >
              {/* Main row: ID, user, price, status, dropdown */}
              <div className="row g-2 align-items-center">

                {/* Order ID and date */}
                <div className="col-12 col-sm-3">
                  <p className="mb-0 fw-semibold" style={{ fontSize: "0.88rem" }}>
                    #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <small className="text-muted">{formatDate(order.createdAt)}</small>
                </div>

                {/* Customer name and email */}
                <div className="col-12 col-sm-3">
                  <small className="text-muted d-block">{order.user?.name  || "—"}</small>
                  <small className="text-muted">      {order.user?.email || ""}</small>
                </div>

                {/* Total price */}
                <div className="col-6 col-sm-2">
                  <strong style={{ fontSize: "0.88rem" }}>
                    {order.totalPrice?.toFixed(2)} EGP
                  </strong>
                </div>

                {/* Status badge */}
                <div className="col-6 col-sm-2">
                  <span className={`status-badge ${STATUS_CLASS[order.status] || ""}`}>
                    {order.status}
                  </span>
                </div>

                {/* Dropdown to change status */}
                <div className="col-12 col-sm-2">
                  <select
                    className="form-select form-select-sm"
                    value={order.status}
                    disabled={updatingId === order._id} // disable while saving
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {/* Capitalize first letter: "pending" → "Pending" */}
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Order items list */}
              {order.items && order.items.length > 0 && (
                <div className="mt-2">
                  {order.items.map((item, idx) => (
                    <small key={idx} className="text-muted d-block">
                      • {item.product?.name || "Frame"} × {item.quantity} — {(item.price * item.quantity).toFixed(2)} EGP
                    </small>
                  ))}
                </div>
              )}

              {/* Shipping address */}
              {order.shippingAddress && (
                <small className="text-muted d-block mt-1">
                  📍 {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.country}
                </small>
              )}

            </div>
          ))}
        </div>
      )}

      {/* Toast notification */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

    </div>
  );
}

export default AdminOrders;