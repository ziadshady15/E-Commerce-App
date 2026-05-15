import { useState, useEffect } from "react";
import Toast from "../components/Toast";
import { useAuth } from "../context/AuthContext";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// color stars
function Stars({ value }) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map(function (star) {
        return (
          <span
            key={star}
            style={{
              color: star <= value ? "#f0c040" : "#ccc",
              fontSize: "1rem",
            }}
          >
            ★
          </span>
        );
      })}
    </span>
  );
}

function AdminReviews() {
  const { token } = useAuth();

  const [products, setProducts] = useState([]); //kol el products
  const [reviews, setReviews] = useState([]); //kol el reviews

  const [loading, setLoading] = useState(true); //true kol ma mstanyeen data men server
  const [error, setError] = useState(null); //error msg
  const [deleteId, setDeleteId] = useState(null); //id el review ely 3ayzeno ytmsh
  const [toast, setToast] = useState(null); //notification success/fail
  const [filterProduct, setFilterProduct] = useState(""); //product id ely fel dropdown filter, law " " ya3ny all products

  useEffect(function () {
    loadAll();
  }, []); //awel ma page teftah y load all mara wahda

  // Loads products b3den load all reviews for each product
  async function loadAll() {
    setLoading(true);
    setError(null);

    try {
      const productResponse = await fetch(`${API_URL}/products`); //fetch kol products

      if (!productResponse.ok) {
        throw new Error("Failed to load products");
      }

      const productData = await productResponse.json();
      setProducts(productData); //store all products


      const reviewPromises = productData.map(function (product) {
        return fetch(`${API_URL}/reviews/product/${product._id}`) //promises array, l kol product a3ml fetch lel reviews bt3to
          .then(function (response) {
            if (response.ok) {
              return response.json(); //fetch succeded 
            }
            return []; //law fail return empty array 
          })
          .then(function (reviewsForThisProduct) {
            //add details el product l kol review
            return reviewsForThisProduct.map(function (review) {
              return {
                ...review,                      // (...) spread ->  keep all existing review fields
                productName: product.name,      //add product name
                productId: product._id,         //add product ID
              };
            });
          })
          .catch(function () {
            // If anything goes wrong, skip 
            return [];
          });
      });

      const reviewArrays = await Promise.all(reviewPromises); //astana kol el reviews fetches te5las

      // reviewArrays is an array of arrays, zay keda:
      // [
      //    [rev1, rev2],  
      //    [rev3],   
      //    []
      // ]
      // .flat() merges them into single array: [rev1, rev2, rev3]

      const allReviews = reviewArrays.flat();
      setReviews(allReviews);
    } catch (err) {
      setError(err.message);
    } finally {
      // Always stop the loading spinner
      setLoading(false);
    }
  }

  async function handleDelete() {
    try {
      // a3ml delete request lel selected review
      const response = await fetch(`${API_URL}/reviews/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to delete review");
      }

      setToast({ message: "Review deleted", type: "success" });

      setReviews(function (previousReviews) {
        return previousReviews.filter(function (review) {
          return review._id !== deleteId;  //asheel el deleted review men 8er ma a3ml refetch l kolo
        });
      });
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      // Close the confirmation modal f kol el cases
      setDeleteId(null);
    }
  }

  // Decide which reviews to show based on the dropdown filter
  let visibleReviews;
  if (filterProduct === "") {
    visibleReviews = reviews;   // If filterProduct is empty, show all reviews
  } else {
    visibleReviews = reviews.filter(function (review) {
      return review.productId === filterProduct; //show the reviews of this product bas
    });
  }

  // Converts date "2024-03-15T..." -> "Mar 15, 2024"
  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  // If loading failed, show the error and stop rendering the rest
  if (error) {
    return (
      <div className="alert alert-danger" style={{ borderRadius: 0 }}>
        {error}
      </div>
    );
  }

  return (
    <div>
      {/* Page header: title, count, and product filter dropdown */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h4 className="serif mb-0">Reviews</h4>
          <small className="text-muted">{visibleReviews.length} showing</small>
        </div>

        {/* Dropdown to filter reviews by product */}
        <select
          className="af-input"
          style={{ width: "auto", fontSize: "0.82rem" }}
          value={filterProduct}
          onChange={function (e) {
            setFilterProduct(e.target.value);
          }}
        >
          {/* Default option = show all */}
          <option value="">All Products</option>

          {/* One option per product */}
          {products.map(function (product) {
            return (
              <option key={product._id} value={product._id}>
                {product.name}
              </option>
            );
          })}
        </select>
      </div>

      {/* Show skeletons while loading */}
      {loading ? (
        <div>
          {[1, 2, 3].map(function (n) {
            return (
              <div key={n} className="skeleton mb-2" style={{ height: 80 }}></div>
            );
          })}
        </div>
      ) : visibleReviews.length === 0 ? (
        // No reviews to show
        <div className="text-center py-5 text-muted">No reviews found.</div>
      ) : (
        // The reviews list
        <div className="af-card" style={{ cursor: "default" }}>
          {visibleReviews.map(function (review, i) {
            const showBorder = i < visibleReviews.length - 1;

            return (
              <div
                key={review._id}
                className="p-3"
                style={{
                  borderBottom: showBorder ? "1px solid var(--border)" : "none",
                }}
              >
                <div className="d-flex justify-content-between align-items-start gap-2">
                  {/* Left side: review details */}
                  <div className="flex-grow-1">
                    {/* Which product this review is for */}
                    <span
                      className="chip mb-2 d-inline-block"
                      style={{ fontSize: "0.7rem" }}
                    >
                      {review.productName}
                    </span>

                    {/* Star rating + reviewer name + date, all in one row */}
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <Stars value={review.rating} />

                      <strong style={{ fontSize: "0.85rem" }}>
                        {/* Show "Anonymous" if the user has no name */}
                        {review.user?.name || "Anonymous"}
                      </strong>

                      {/* Only show the date if it exists */}
                      {review.createdAt && (
                        <small className="text-muted">
                          — {formatDate(review.createdAt)}
                        </small>
                      )}
                    </div>

                    {/* The review comment, only shown if one exists */}
                    {review.comment && (
                      <p
                        className="text-muted mb-0"
                        style={{ fontSize: "0.85rem", fontStyle: "italic" }}
                      >
                        "{review.comment}"
                      </p>
                    )}
                  </div>

                  {/* Right side: delete button */}
                  <button
                    onClick={function () {
                      setDeleteId(review._id); // open confirmation modal for this review
                    }}
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
            <h5 className="serif mb-2">Delete Review?</h5>
            <p className="text-muted mb-4" style={{ fontSize: "0.88rem" }}>
              This will permanently remove the review.
            </p>
            <div className="d-flex gap-2 justify-content-end">
              {/* Cancel: close the modal without doing anything */}
              <button
                className="btn-af-outline btn-af-sm"
                onClick={function () {
                  setDeleteId(null);
                }}
              >
                Cancel
              </button>

              {/* Confirm: actually send the delete request */}
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

      {/* Toast notification (success or error message) */}
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

export default AdminReviews;