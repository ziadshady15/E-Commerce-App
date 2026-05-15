import { useState, useEffect } from "react";
import Toast from "../components/Toast";
import { useAuth } from "../context/AuthContext"; //3ashan ngeeb bayanat el current user

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

function AdminUsers() {
  const { token, user: currentUser } = useAuth(); //neb3t req lel backend b token el current admin

  const [users, setUsers] = useState([]); //list users
  const [loading, setLoading] = useState(true); //hal bayanat lesa bthaml?
  const [error, setError] = useState(null); //error msg law hasal haga 8alat
  const [deleteId, setDeleteId] = useState(null); //id el user ely 3ayzen nmsaho
  const [toast, setToast] = useState(null); //notify msg

  useEffect(() => {
    fetchUsers(); //awel ma page teftah ynady fn.
  }, []); // [] ya3ny one time only


  async function fetchUsers() {
    setLoading(true); //ybd2 loading
    setError(null);

    try {
      const response = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }, //by3ml get request 3ashan yet2akd bel token en da el admin
      });

      if (!response.ok) {
        throw new Error("Failed to load users");
      }

      const data = await response.json(); //get data

      setUsers(Array.isArray(data) ? data : []); //save data el users fe array
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    try {
      const response = await fetch(`${API_URL}/users/${deleteId}`, {
        method: "DELETE", 
        headers: { Authorization: `Bearer ${token}` },
      }); //delete request bel id

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setToast({ message: "User deleted successfully", type: "success" });

      setUsers(function (previousUsers) {
        return previousUsers.filter(function (u) {
          return u._id !== deleteId;
        });
      }); //bnemsah el user men el page men 8er ma ne3ml reload
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setDeleteId(null);
    }
  }

  function getInitial(name) {
    if (name) {
      return name[0].toUpperCase(); //nerg3 awl harf men el esm (uppercase) yethat ka avatar placeholder
    }
    return "?";
  }

  if (error) {
    return (
      <div className="alert alert-danger" style={{ borderRadius: 0 }}>
        {error}
      </div>
    );
  } //error msg law loading failed

  return (
    <div>
      {/* Page header: title + total user count */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="serif mb-0">Users</h4>
          <small className="text-muted">{users.length} total</small>
        </div>
      </div>

      {/* Show skeleton placeholders while loading */}
      {loading ? (
        <div>
          {[1, 2, 3, 4].map(function (n) {
            return (
              <div key={n} className="skeleton mb-2" style={{ height: 60 }}></div>
            );
          })}
        </div>
      ) : users.length === 0 ? (
        // Show a message if the server returned zero users
        <div className="text-center py-5 text-muted">No users found.</div>
      ) : (
        // Show the list of users
        <div className="af-card" style={{ cursor: "default" }}>
          {users.map(function (u, i) {
            // Whether this row is NOT the last one (used to draw a divider line)
            const showBorder = i < users.length - 1;

            return (
              <div
                key={u._id}
                className="d-flex align-items-center gap-3 p-3"
                style={{
                  borderBottom: showBorder ? "1px solid var(--border)" : "none",
                }}
              >
                {/* Avatar: show profile picture if available, otherwise show initials */}
                <div
                  className="af-avatar"
                  style={{ width: 40, height: 40, fontSize: "1rem", flexShrink: 0 }}
                >
                  {u.profilePicture ? (
                    <img src={u.profilePicture} alt={u.name} />
                  ) : (
                    getInitial(u.name)
                  )}
                </div>

                {/* User name and email */}
                <div className="flex-grow-1">
                  <p className="mb-0" style={{ fontWeight: 600, fontSize: "0.88rem" }}>
                    {u.name}
                  </p>
                  <small className="text-muted">{u.email}</small>
                </div>

                {/* Role badge (e.g. "admin" or "user") */}
                <div>
                  <span
                    className={`chip ${u.role === "admin" ? "chip-dark" : ""}`}
                    style={{ fontSize: "0.7rem" }}
                  >
                    {u.role || "user"}
                  </span>
                </div>

                {/* Delete button — hidden for the currently logged-in admin */}
                <div>
                  {u._id === currentUser?.id ? (
                    // Can't delete yourself
                    <small className="text-muted">(You)</small>
                  ) : (
                    <button
                      onClick={function () {
                        setDeleteId(u._id); // Open the confirmation modal for this user
                      }}
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
            );
          })}
        </div>
      )}

      {/* Delete confirmation modal — only shown when deleteId is set */}
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
              {/* Cancel: just close the modal */}
              <button
                className="btn-af-outline btn-af-sm"
                onClick={function () {
                  setDeleteId(null);
                }}
              >
                Cancel
              </button>

              {/* Confirm: actually delete the user */}
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

      {/* Toast notification (success or error) */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={function () {
            setToast(null);
          }}
        />
      )}
    </div>
  );
}

export default AdminUsers;