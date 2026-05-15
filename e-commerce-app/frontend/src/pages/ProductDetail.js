import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import Toast from "../components/Toast";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

function validateReview(values) {
  const errors = {};
  if (!values.rating || values.rating < 1) errors.rating = "Please select a rating";
  
  // ADD THIS: Check if comment is empty or just spaces
  if (!values.comment || !values.comment.trim()) {
    errors.comment = "Please write a comment";
  }
  
  return errors;
}

function StarRating({ value, onChange, readOnly }) {
  return (
    <div className="d-flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            fontSize: "1.3rem",
            cursor: readOnly ? "default" : "pointer",
            color: star <= value ? "#f0c040" : "#ccc",
          }}
          onClick={() => !readOnly && onChange && onChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => { fetchProduct(); fetchReviews(); }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/products/${id}`);
      if (!res.ok) throw new Error("Product not found");
      setProduct(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_URL}/reviews/product/${id}`);
      if (res.ok) setReviews(await res.json());
    } catch {}
  };

  const handleAddToCart = async () => {
    if (!token) { navigate("/login"); return; }
    setAdding(true);
    const result = await addToCart(id, 1);
    setToast({ message: result.success ? `${product.name} added to cart!` : "Failed to add to cart", type: result.success ? "success" : "error" });
    setAdding(false);
  };

  const reviewFormik = useFormik({
    initialValues: { rating: 5, comment: "" },
    validate: validateReview,
    onSubmit: async (values, { setStatus, setSubmitting, resetForm }) => {
      if (!token) { navigate("/login"); return; }
      setStatus(null);
      try {
        const res = await fetch(`${API_URL}/reviews`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ productId: id, rating: values.rating, comment: values.comment }),
        });
        if (!res.ok) {
          const data = await res.json();
          setStatus(data.message || "Failed to submit review");
          return;
        }
        setToast({ message: "Review submitted!", type: "success" });
        resetForm();
        fetchReviews();
      } catch (err) {
        setStatus("Network error. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (loading) return (
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-md-6"><div className="skeleton" style={{ aspectRatio: "1" }}></div></div>
        <div className="col-md-6">
          <div className="skeleton mb-3" style={{ height: 32, width: "80%" }}></div>
          <div className="skeleton mb-2" style={{ height: 20, width: "40%" }}></div>
          <div className="skeleton" style={{ height: 16, width: "60%" }}></div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="container py-5">
      <div className="alert alert-danger" style={{ borderRadius: 0 }}>{error}</div>
    </div>
  );

  const avgRating = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : null;

  return (
    <div>
      <div className="container py-4 py-md-5">
        {/* Breadcrumb */}
        <nav className="mb-3">
          <ol className="breadcrumb" style={{ fontSize: "0.75rem" }}>
            <li className="breadcrumb-item">
              <span onClick={() => navigate("/")} style={{ cursor: "pointer", color: "var(--gray)" }}>Home</span>
            </li>
            <li className="breadcrumb-item">
              <span onClick={() => navigate("/gallery")} style={{ cursor: "pointer", color: "var(--gray)" }}>Gallery</span>
            </li>
            <li className="breadcrumb-item active">{product.name}</li>
          </ol>
        </nav>

        <div className="row g-5">
          {/* Image */}
          <div className="col-12 col-md-6">
            <div className="product-img-wrap" style={{ aspectRatio: "1", height: "auto" }}>
              {product.image
                ? <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <div className="product-img-placeholder"></div>
              }
            </div>
          </div>

          {/* Info */}
          <div className="col-12 col-md-6">
            <span className="eyebrow">{product.category?.name || "Frame"}</span>
            <h2 className="serif mb-2">{product.name}</h2>
            {/* Changed from $ to EGP here */}
            <p style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 12 }}>EGP {product.price}</p>

            {avgRating && (
              <div className="d-flex align-items-center gap-2 mb-3">
                <StarRating value={Math.round(avgRating)} readOnly />
                <span className="text-muted" style={{ fontSize: "0.78rem" }}>({reviews.length} reviews)</span>
              </div>
            )}

            <hr style={{ borderColor: "var(--border)" }} />

            {/* Stock */}
            <p className="mb-3 mt-3">
              <span className={`chip ${product.stock > 0 ? "" : "chip-dark"}`}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </p>

            <button
              className="btn-af w-100 mb-2"
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
            >
              <i className="bi bi-bag me-2"></i>
              {adding ? "Adding..." : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>

            <div className="d-flex justify-content-center gap-4 mt-2">
              <small className="text-muted">✓ Lifetime Warranty</small>
              <small className="text-muted">📦 Insured Shipping</small>
            </div>

            {product.description && (
              <div className="mt-4">
                <hr style={{ borderColor: "var(--border)" }} />
                <p className="text-muted" style={{ lineHeight: 1.8, fontSize: "0.88rem" }}>{product.description}</p>
              </div>
            )}

            {product.material && (
              <div className="d-flex justify-content-between mt-3 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
                <small className="text-muted">Material</small>
                <small style={{ fontWeight: 600 }}>{product.material}</small>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div style={{ background: "var(--white)", borderTop: "1px solid var(--border)" }} className="py-5">
        <div className="container">
          <h4 className="serif mb-4">Customer Reviews</h4>
          <div className="row g-4">
            {/* Existing reviews */}
            <div className="col-12 col-md-6">
              {reviews.length === 0
                ? <p className="text-muted">No reviews yet. Be the first!</p>
                : reviews.map((r) => (
                    <div key={r._id} style={{ background: "var(--cream)", border: "1px solid var(--border)", padding: "20px", marginBottom: 12 }}>
                      <div className="d-flex justify-content-between mb-1">
                        <strong style={{ fontSize: "0.88rem" }}>{r.user?.name || "Anonymous"}</strong>
                        <StarRating value={r.rating} readOnly />
                      </div>
                      {r.comment && (
                        <p className="text-muted mb-0" style={{ fontSize: "0.85rem", fontStyle: "italic" }}>"{r.comment}"</p>
                      )}
                    </div>
                  ))
              }
            </div>

            {/* Write review */}
            <div className="col-12 col-md-6">
              <h5 className="serif mb-3">Write a Review</h5>
              {!token ? (
                <div>
                  <p className="text-muted mb-2" style={{ fontSize: "0.85rem" }}>Please log in to leave a review.</p>
                  <button className="btn-af-outline btn-af-sm" onClick={() => navigate("/login")}>Login to Review</button>
                </div>
              ) : (
                <form onSubmit={reviewFormik.handleSubmit} noValidate>
                  {reviewFormik.status && (
                    <div className="alert alert-danger py-2 mb-3" style={{ fontSize: "0.83rem", borderRadius: 0 }}>
                      {reviewFormik.status}
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="af-label">Your Rating</label>
                    <StarRating
                      value={reviewFormik.values.rating}
                      onChange={(val) => reviewFormik.setFieldValue("rating", val)}
                    />
                    {reviewFormik.touched.rating && reviewFormik.errors.rating && (
                      <p className="af-error">{reviewFormik.errors.rating}</p>
                    )}
                  </div>

                  <div className="mb-3">
                  <label className="af-label">Comment *</label> 
                  <textarea
                    name="comment"
                    className="af-input"
                    rows={4}
                    value={reviewFormik.values.comment}
                    onChange={reviewFormik.handleChange}
                    onBlur={reviewFormik.handleBlur} /* ADDED THIS */
                    placeholder="Share your experience..."
                  />
                  {/* ADDED THIS: Display the error message */}
                  {reviewFormik.touched.comment && reviewFormik.errors.comment && (
                    <p className="af-error" style={{ color: "red", fontSize: "0.85rem", marginTop: "4px" }}>
                      {reviewFormik.errors.comment}
                    </p>
                  )}
                </div>

                  <button type="submit" className="btn-af" disabled={reviewFormik.isSubmitting}>
                    {reviewFormik.isSubmitting ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

export default ProductDetail;