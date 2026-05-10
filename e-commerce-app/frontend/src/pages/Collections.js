import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const BG_COLORS = [
  "linear-gradient(135deg, #3a3025 0%, #6b5d4e 100%)",
  "linear-gradient(135deg, #2c3e50 0%, #4a6741 100%)",
  "linear-gradient(135deg, #5d4037 0%, #8d6e63 100%)",
  "linear-gradient(135deg, #263238 0%, #546e7a 100%)",
  "linear-gradient(135deg, #4a148c 0%, #7b1fa2 100%)",
  "linear-gradient(135deg, #1a237e 0%, #3949ab 100%)",
];

function Collections() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/categories`);
      if (!res.ok) throw new Error("Failed to load collections.");
      setCategories(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <div style={{ background: "var(--white)", borderBottom: "1px solid var(--border)" }} className="py-5 px-4 px-md-5">
        <span className="eyebrow">Our Craft</span>
        <h2 className="section-title mb-2">Curated Collections</h2>
        <p className="text-muted" style={{ maxWidth: 500, lineHeight: 1.8 }}>
          Explore our meticulously crafted series, where each frame is a testament to timeless design.
        </p>
      </div>

      <div className="container py-4 py-md-5">
        {error && <div className="alert alert-danger mb-3" style={{ borderRadius: 0 }}>{error}</div>}

        <div className="row g-3">
          {loading
            ? [1, 2, 3, 4].map((n) => (
                <div className="col-12 col-sm-6" key={n}>
                  <div className="skeleton" style={{ height: 180 }}></div>
                  <div className="skeleton mt-2" style={{ height: 16 }}></div>
                </div>
              ))
            : categories.map((cat, i) => (
                <div className="col-12 col-sm-6" key={cat._id}>
                  <div className="af-card">
                    <div style={{ height: 180, background: BG_COLORS[i % BG_COLORS.length], display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: "35%", height: "55%", border: "2px solid rgba(255,255,255,0.25)" }}></div>
                    </div>
                    <div className="p-4">
                      <h5 className="serif mb-2">{cat.name}</h5>
                      <p className="text-muted mb-3" style={{ fontSize: "0.85rem", lineHeight: 1.7 }}>{cat.description}</p>
                      <button className="btn-af-outline btn-af-sm" onClick={() => navigate(`/gallery?category=${cat._id}`)}>
                        Explore Collection
                      </button>
                    </div>
                  </div>
                </div>
              ))
          }
        </div>
      </div>

      {/* Craft Section */}
      <div style={{ background: "var(--white)", borderTop: "1px solid var(--border)" }} className="py-5">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-12 col-md-6">
              <span className="eyebrow">The Art of the Edge</span>
              <h3 className="section-title mb-3">Museum-Grade Craft</h3>
              <p className="text-muted mb-3" style={{ lineHeight: 1.8, fontSize: "0.9rem" }}>
                Every piece is hand-assembled in our studio, using museum-grade acrylic and acid-free mounting boards.
              </p>
              <div className="d-flex gap-2 flex-wrap">
                {["FSC OAK", "WALNUT", "MAPLE", "ANODIZED METAL"].map((m) => (
                  <span key={m} className="chip">{m}</span>
                ))}
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div
                style={{ background: "var(--cream)", aspectRatio: "4/3", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem" }}
              >🪵</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Collections;
