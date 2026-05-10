import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

function Gallery() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("default");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const catFromUrl = searchParams.get("category");
    if (catFromUrl) setSelectedCategory(catFromUrl);
    fetchCategories();
  }, []);

  useEffect(() => { fetchProducts(); }, [search, selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${API_URL}/products?`;
      if (search) url += `search=${encodeURIComponent(search)}&`;
      if (selectedCategory) url += `category=${selectedCategory}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load products.");
      setProducts(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/categories`);
      if (res.ok) setCategories(await res.json());
    } catch {}
  };

  const getSorted = () => {
    const sorted = [...products];
    if (sortBy === "price-asc")  return sorted.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") return sorted.sort((a, b) => b.price - a.price);
    if (sortBy === "name")       return sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  };

  const sorted = getSorted();

  return (
    <div className="container py-4 py-md-5">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb" style={{ fontSize: "0.75rem" }}>
          <li className="breadcrumb-item">
            <span onClick={() => navigate("/")} style={{ cursor: "pointer", color: "var(--gray)" }}>Home</span>
          </li>
          <li className="breadcrumb-item active">Gallery</li>
        </ol>
      </nav>

      <div className="row g-4">
        {/* ── Sidebar Filters ── */}
        <div className="col-12 col-md-3">
          <p className="eyebrow fw-semibold">Filters</p>
          <p className="eyebrow mb-3">Refine Your Selection</p>

          {/* Search */}
          <div className="mb-3">
            <label className="af-label">Search</label>
            <input
              type="text"
              className="af-input"
              placeholder="Search frames..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <hr style={{ borderColor: "var(--border)" }} />

          {/* Category */}
          <p className="af-label mt-3">Category</p>
          {[{ _id: "", name: "All" }, ...categories].map((cat) => (
            <div key={cat._id} className="form-check mb-1">
              <input
                className="form-check-input"
                type="radio"
                id={`cat-${cat._id}`}
                name="category"
                checked={selectedCategory === cat._id}
                onChange={() => setSelectedCategory(cat._id)}
              />
              <label className="form-check-label" htmlFor={`cat-${cat._id}`} style={{ fontSize: "0.85rem" }}>
                {cat.name}
              </label>
            </div>
          ))}
        </div>

        {/* ── Products ── */}
        <div className="col-12 col-md-9">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h4 className="serif mb-0">Available Frames</h4>
            <select
              className="af-input"
              style={{ width: "auto" }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Popularity</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>

          {error && <div className="alert alert-danger" style={{ borderRadius: 0 }}>{error}</div>}

          {loading ? (
            <div className="row g-3">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div className="col-12 col-sm-6 col-md-4" key={n}>
                  <div className="skeleton" style={{ height: 220 }}></div>
                  <div className="skeleton mt-2" style={{ height: 14 }}></div>
                </div>
              ))}
            </div>
          ) : sorted.length === 0 ? (
            <div className="text-center py-5">
              <h5>No frames found</h5>
              <p className="text-muted mb-3">Try adjusting your search or filters</p>
              <button className="btn-af-outline btn-af-sm" onClick={() => { setSearch(""); setSelectedCategory(""); }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="row g-3">
                {sorted.map((p) => (
                  <div className="col-12 col-sm-6 col-md-4" key={p._id}>
                    <div
                      className="af-card"
                      onClick={() => navigate(`/product/${p._id}`)}
                      style={{ cursor: "pointer" }}
                    >
                     
                    <div style={{ position: "relative", width: "100%", paddingBottom: "133%" }}>
                        {p.image
                          ? <img
                              src={p.image}
                              alt={p.name}
                              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          : <div style={{ position: "absolute", inset: 0, background: "#f0ece6" }}></div>
                        }
                      </div>
                      <div className="p-3">
                        <div className="d-flex justify-content-between">
                          <span style={{ fontWeight: 500, maxWidth: "65%", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{p.name}</span>
                          <span style={{ fontWeight: 700 }}>{p.price} EGP</span>
                        </div>
                        <p className="text-muted mb-0" style={{ fontSize: "0.75rem" }}>
                          {[p.material, p.category?.name].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-center text-muted mt-4" style={{ fontSize: "0.75rem" }}>
                Showing {sorted.length} frame{sorted.length !== 1 ? "s" : ""}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Gallery;
