import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

// Skeleton card for loading state
function SkeletonCard() {
  return (
    <div className="col-6 col-md-4">
      <div className="skeleton-card">
        <div className="skeleton-img skeleton-pulse" />
        <div className="skeleton-body">
          <div className="skeleton-line skeleton-pulse" style={{ width: "70%" }} />
          <div className="skeleton-line skeleton-pulse" style={{ width: "40%", marginTop: 6 }} />
        </div>
      </div>
    </div>
  );
}

function Gallery() {
  const [allProducts, setAllProducts] = useState([]);   // full list, fetched once
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTyped, setSearchTyped] = useState("");

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get("category") || "";
  const searchQuery = searchParams.get("search") || "";
  const sortBy = searchParams.get("sort") || "default";

  // Sync typed search with URL param on mount
  useEffect(() => {
    setSearchTyped(searchQuery);
  }, []); // eslint-disable-line

  // ✅ Single parallel fetch — runs ONCE on mount
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(API_URL + "/categories").then((r) => {
        if (!r.ok) throw new Error("categories");
        return r.json();
      }),
      fetch(API_URL + "/products").then((r) => {
        if (!r.ok) throw new Error("products");
        return r.json();
      }),
    ])
      .then(([cats, prods]) => {
        setCategories(cats);
        setAllProducts(prods);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load products. Please try again.");
        setLoading(false);
      });
  }, []); // ← only on mount; no more re-fetches on filter change

  const updateUrl = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    setSearchParams(newParams, { replace: true });
  };

  // ✅ Client-side filter + sort — no network calls
  const finalProducts = useMemo(() => {
    let list = [...allProducts];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      list = list.filter(
        (p) =>
          p.category === selectedCategory ||
          p.category?._id === selectedCategory
      );
    }

    if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sortBy === "name") list.sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }, [allProducts, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="container py-5">
      <style>{`
        /* ── Product cards ── */
        .product-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 1px solid #eee !important;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
        }
        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.1);
          border-color: #333 !important;
        }
        .img-container { overflow: hidden; }
        .product-card img {
          transition: transform 0.5s ease;
        }
        .product-card:hover img { transform: scale(1.08); }

        /* ── Skeleton loading ── */
        .skeleton-card {
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #eee;
          background: #fff;
        }
        .skeleton-img {
          height: 280px;
          background: #e9e9e9;
        }
        .skeleton-body {
          padding: 12px;
        }
        .skeleton-line {
          height: 12px;
          border-radius: 4px;
          background: #e9e9e9;
        }
        @keyframes shimmer {
          0%   { opacity: 1; }
          50%  { opacity: 0.4; }
          100% { opacity: 1; }
        }
        .skeleton-pulse {
          animation: shimmer 1.4s ease-in-out infinite;
        }

        /* ── Empty state ── */
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #999;
        }
        .empty-state h5 { color: #555; margin-bottom: 8px; }
      `}</style>

      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3">
          <h5 className="mb-4 serif">Filters</h5>

          {/* Search */}
          <div className="mb-4">
            <label className="small fw-bold text-muted mb-2">SEARCH</label>
            <div className="d-flex gap-2">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search frames..."
                value={searchTyped}
                onChange={(e) => setSearchTyped(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && updateUrl("search", searchTyped)
                }
              />
              <button
                className="btn btn-dark btn-sm"
                onClick={() => updateUrl("search", searchTyped)}
              >
                Search
              </button>
            </div>
          </div>

          {/* Collections */}
          <div className="mb-4">
            <label className="small fw-bold text-muted mb-2">COLLECTIONS</label>
            {[{ _id: "", name: "All Collections" }, ...categories].map((cat) => (
              <div className="form-check" key={cat._id || "all"}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="cat"
                  checked={selectedCategory === cat._id}
                  onChange={() => updateUrl("category", cat._id)}
                />
                <label className="form-check-label small">{cat.name}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="col-md-9">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="serif">
              The Gallery{" "}
              {!loading && (
                <span className="fs-6 text-muted fw-normal">
                  ({finalProducts.length} piece{finalProducts.length !== 1 ? "s" : ""})
                </span>
              )}
            </h3>
            <select
              className="form-select w-auto form-select-sm"
              value={sortBy}
              onChange={(e) => updateUrl("sort", e.target.value)}
            >
              <option value="default">Sort By</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>

          {/* Error */}
          {error && (
            <div className="alert alert-danger">{error}</div>
          )}

          {/* Loading skeletons */}
          {loading && (
            <div className="row g-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Products grid */}
          {!loading && !error && finalProducts.length > 0 && (
            <div className="row g-4">
              {finalProducts.map((p) => (
                <div className="col-6 col-md-4" key={p._id}>
                  <div
                    className="card h-100 product-card border-0 bg-white"
                    onClick={() => navigate("/product/" + p._id)}
                  >
                    <div className="img-container">
                      <img
                        src={p.image}
                        className="card-img-top"
                        alt={p.name}
                        loading="lazy"                  // ✅ lazy load
                        decoding="async"                // ✅ non-blocking decode
                        style={{ height: "280px", objectFit: "cover" }}
                      />
                    </div>
                    <div className="card-body text-center">
                      <h6
                        className="mb-1 text-uppercase small fw-bold"
                        style={{ letterSpacing: "1px" }}
                      >
                        {p.name}
                      </h6>
                      <p className="text-muted small mb-0">{p.price} EGP</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && finalProducts.length === 0 && (
            <div className="empty-state">
              <h5>No pieces found</h5>
              <p className="small">Try adjusting your filters or search term.</p>
              <button
                className="btn btn-outline-dark btn-sm mt-2"
                onClick={() => {
                  setSearchTyped("");
                  setSearchParams({});
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Gallery;