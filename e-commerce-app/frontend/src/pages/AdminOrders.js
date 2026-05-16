import { useState, useEffect } from "react";
import Toast from "../components/Toast";
import { useAuth } from "../context/AuthContext";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Status badge CSS classes 
const STATUS_CLASS = {
  pending:    "badge-pending",
  processing: "badge-processing",
  shipped:    "badge-shipped",
  delivered:  "badge-delivered",
  cancelled:  "badge-cancelled",
};

// All possible order statuses
const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"];

function AdminOrders() {
  const { token } = useAuth();
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [toast, setToast]     = useState(null);

  // anhy order
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load orders");
      const data = await res.json();
      //3lshan lw data=null y3ml crash lw ma kansh array
      if (Array.isArray(data)) {
        setOrders(data);
      } 
      else {
        setOrders([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update a single order's status
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
      setOrders((prev) =>
        //8yr el status fel order elly et3ml update bs w5ly ba2y el orders zay ma homa
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setUpdatingId(null);
    }
  };

  // Format date nicely
  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  if (error) return (
    <div className="alert alert-danger" style={{ borderRadius: 0 }}>{error}</div>
  );

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="serif mb-0">Orders</h4>
          <small className="text-muted">{orders.length} total</small>
        </div>
      </div>

      {loading ? (
        // Skeleton loader while fetching
        <div>
          {[1, 2, 3].map((n) => (
            <div key={n} className="skeleton mb-3" style={{ height: 80 }}></div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-5 text-muted">No orders yet.</div>
      ) : (
        <div className="af-card" style={{ cursor: "default" }}>
          {orders.map((order, i) => (
            <div
              key={order._id}
              className="p-3"
              style={{
                borderBottom:
                  i < orders.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              <div className="row g-2 align-items-center">
                {/* Order ID & Date */}
                <div className="col-12 col-sm-3">
                  <p className="mb-0" style={{ fontWeight: 600, fontSize: "0.88rem" }}>
                    #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <small className="text-muted">{formatDate(order.createdAt)}</small>
                </div>

                {/* User Info */}
                <div className="col-12 col-sm-3">
                  <small className="text-muted d-block">
                    {order.user?.name || "—"}
                  </small>
                  <small className="text-muted">{order.user?.email || ""}</small>
                </div>

                {/* Total */}
                <div className="col-6 col-sm-2">
                  <strong style={{ fontSize: "0.88rem" }}>
                    {order.totalPrice?.toFixed(2)} EGP
                  </strong>
                </div>

                {/* Current Status Badge */}
                <div className="col-6 col-sm-2">
                  <span
                    className={`status-badge ${STATUS_CLASS[order.status] || ""}`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Status Dropdown to change it */}
                <div className="col-12 col-sm-2">
                  <select
                    className="af-input"
                    style={{ fontSize: "0.78rem", padding: "6px 10px" }}
                    value={order.status}
                    disabled={
                      updatingId === order._id || 
                      order.status === "delivered" || 
                      order.status === "cancelled"
                    }
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Order items (collapsed list) */}
              {order.items && order.items.length > 0 && (
                <div className="mt-2">
                  {order.items.map((item, idx) => (
                    <small key={idx} className="text-muted d-block">
                      • {item.product?.name || "Frame"} × {item.quantity} —{" "}
                      {(item.price * item.quantity).toFixed(2)} EGP
                    </small>
                  ))}
                </div>
              )}

              {/* Shipping address */}
              {order.shippingAddress && (
                <small className="text-muted d-block mt-1">
                  📍 {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
                  {order.shippingAddress.country}
                </small>
              )}
            </div>
          ))}
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default AdminOrders;
