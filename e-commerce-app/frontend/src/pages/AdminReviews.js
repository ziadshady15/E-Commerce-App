import { useState, useEffect } from "react";
import Toast from "../components/Toast";
import { useAuth } from "../context/AuthContext";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Simple read-only star display
function Stars({ value }) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{ color: star <= value ? "#f0c040" : "#ccc", fontSize: "1rem" }}
        >
          ★
        </span>
      ))}
    </span>
  );
}

function AdminReviews() {
  const { token } = useAuth();

  // We need to load all products first, then load reviews for each product
  const [products, setProducts]   = useState([]);
  const [reviews, setReviews]     = useState([]); // flat list of all reviews
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [deleteId, setDeleteId]   = useState(null);
  const [toast, setToast]         = useState(null);

  // Filter by product
  const [filterProduct, setFilterProduct] = useState(""); // empty = show all

  useEffect(() => {
    loadAll();
  }, []);

  // Load all products, then fetch reviews for each one
  const loadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Get all products (public endpoint, no auth needed)
      const prodRes = await fetch(`${API_URL}/products`);
      if (!prodRes.ok) throw new Error("Failed to load products");
      const prodData = await prodRes.json();
      setProducts(prodData);

      // 2. For each product, fetch its reviews in parallel
      const reviewPromises = prodData.map((p) =>
        fetch(`${API_URL}/reviews/product/${p._id}`)
          .then((r) => (r.ok ? r.json() : []))
          .then((revs) =>
            // Attach product name to each review so we can display it
            revs.map((rev) => ({ ...rev, productName: p.name, productId: p._id }))
          )
          .catch(() => [])
      );

      const results = await Promise.all(reviewPromises);
      // Flatten array of arrays into one flat list
      const allReviews = results.flat();
      setReviews(allReviews);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_URL}/reviews/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete review");
      setToast({ message: "Review deleted", type: "success" });
      // Remove from local state immediately
      setReviews((prev) => prev.filter((r) => r._id !== deleteId));
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setDeleteId(null);
    }
  };

  // Filter reviews based on selected product
  const visibleReviews =
    filterProduct
      ? reviews.filter((r) => r.productId === filterProduct)
      : reviews;

  // Format date
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
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h4 className="serif mb-0">Reviews</h4>
          <small className="text-muted">{visibleReviews.length} showing</small>
        </div>

        {/* Filter by product dropdown */}
        <select
          className="af-input"
          style={{ width: "auto", fontSize: "0.82rem" }}
          value={filterProduct}
          onChange={(e) => setFilterProduct(e.target.value)}
        >
          <option value="">All Products</option>
          {products.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div>
          {[1, 2, 3].map((n) => (
            <div key={n} className="skeleton mb-2" style={{ height: 80 }}></div>
          ))}
        </div>
      ) : visibleReviews.length === 0 ? (
        <div className="text-center py-5 text-muted">No reviews found.</div>
      ) : (
        <div className="af-card" style={{ cursor: "default" }}>
          {visibleReviews.map((review, i) => (
            <div
              key={review._id}
              className="p-3"
              style={{
                borderBottom:
                  i < visibleReviews.length - 1
                    ? "1px solid var(--border)"
                    : "none",
              }}
            >
              <div className="d-flex justify-content-between align-items-start gap-2">
                {/* Review content */}
                <div className="flex-grow-1">
                  {/* Product name */}
                  <span className="chip mb-2 d-inline-block" style={{ fontSize: "0.7rem" }}>
                    {review.productName}
                  </span>

                  <div className="d-flex align-items-center gap-2 mb-1">
                    {/* Star rating */}
                    <Stars value={review.rating} />
                    {/* Reviewer name */}
                    <strong style={{ fontSize: "0.85rem" }}>
                      {review.user?.name || "Anonymous"}
                    </strong>
                    {/* Date */}
                    {review.createdAt && (
                      <small className="text-muted">
                        — {formatDate(review.createdAt)}
                      </small>
                    )}
                  </div>

                  {/* Comment */}
                  {review.comment && (
                    <p
                      className="text-muted mb-0"
                      style={{ fontSize: "0.85rem", fontStyle: "italic" }}
                    >
                      "{review.comment}"
                    </p>
                  )}
                </div>

                {/* Delete button */}
                <button
                  onClick={() => setDeleteId(review._id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#c0392b",
                    fontSize: "1rem",
                    flexShrink: 0,
                  }}
                  title="Delete review"
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirm Modal */}
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
            <h5 className="serif mb-2">Delete Review?</h5>
            <p className="text-muted mb-4" style={{ fontSize: "0.88rem" }}>
              This will permanently remove the review.
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

export default AdminReviews;
