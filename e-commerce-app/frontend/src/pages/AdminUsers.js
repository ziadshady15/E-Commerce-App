import { useState, useEffect } from "react";
import Toast from "../components/Toast";
import { useAuth } from "../context/AuthContext";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

function AdminUsers() {
  const { token, user: currentUser } = useAuth();
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [deleteId, setDeleteId] = useState(null); // Which user to confirm delete
  const [toast, setToast]     = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load users");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_URL}/users/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete user");
      setToast({ message: "User deleted successfully", type: "success" });
      // Remove user from local state immediately
      setUsers((prev) => prev.filter((u) => u._id !== deleteId));
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setDeleteId(null);
    }
  };

  // Get initials for avatar placeholder
  const getInitial = (name) => (name ? name[0].toUpperCase() : "?");

  if (error) return (
    <div className="alert alert-danger" style={{ borderRadius: 0 }}>{error}</div>
  );

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="serif mb-0">Users</h4>
          <small className="text-muted">{users.length} total</small>
        </div>
      </div>

      {loading ? (
        // Skeleton loading placeholders
        <div>
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="skeleton mb-2" style={{ height: 60 }}></div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-5 text-muted">No users found.</div>
      ) : (
        <div className="af-card" style={{ cursor: "default" }}>
          {users.map((u, i) => (
            <div
              key={u._id}
              className="d-flex align-items-center gap-3 p-3"
              style={{
                borderBottom:
                  i < users.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              {/* Avatar */}
              <div className="af-avatar" style={{ width: 40, height: 40, fontSize: "1rem", flexShrink: 0 }}>
                {u.profilePicture ? (
                  <img src={u.profilePicture} alt={u.name} />
                ) : (
                  getInitial(u.name)
                )}
              </div>

              {/* Name & Email */}
              <div className="flex-grow-1">
                <p className="mb-0" style={{ fontWeight: 600, fontSize: "0.88rem" }}>
                  {u.name}
                </p>
                <small className="text-muted">{u.email}</small>
              </div>

              {/* Role badge */}
              <div>
                <span
                  className={`chip ${u.role === "admin" ? "chip-dark" : ""}`}
                  style={{ fontSize: "0.7rem" }}
                >
                  {u.role || "user"}
                </span>
              </div>

              {/* Delete button — don't allow admin to delete themselves */}
              <div>
                {u._id === currentUser?.id ? (
                  <small className="text-muted">(You)</small>
                ) : (
                  <button
                    onClick={() => setDeleteId(u._id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#c0392b",
                      fontSize: "1rem",
                    }}
                    title="Delete user"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div
          className="modal d-flex"
          style={{
            background: "rgba(0,0,0,0.5)",
            position: "fixed",
            inset: 0,
            zIndex: 300,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "var(--white)",
              width: "100%",
              maxWidth: 400,
              border: "1px solid var(--border)",
              padding: "32px",
            }}
          >
            <h5 className="serif mb-2">Delete User?</h5>
            <p className="text-muted mb-4" style={{ fontSize: "0.88rem" }}>
              This action cannot be undone. The user's data will be permanently removed.
            </p>
            <div className="d-flex gap-2 justify-content-end">
              <button
                className="btn-af-outline btn-af-sm"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>
              <button
                className="btn-af btn-af-sm btn-af-danger"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
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

export default AdminUsers;
