import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch(`${API_URL}/products`),
        fetch(`${API_URL}/categories`),
      ]);
      if (!prodRes.ok || !catRes.ok) throw new Error("Failed to load content. Is the backend running?");
      const prodData = await prodRes.json();
      const catData  = await catRes.json();
      setProducts(prodData.slice(0, 3));
      setCategories(catData.slice(0, 3));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* ── Hero ─────────────────────────────────── */}
      <section className="hero-section px-4 px-md-5">
        <div className="hero-content">
          <span className="eyebrow text-white-50">The Art of Preservation</span>
          <h1 className="hero-title mb-3">
            Curated Frames<br />for the Modern Collector
          </h1>
          <p className="mb-4" style={{ color: "rgba(255,255,255,0.75)", maxWidth: 460, lineHeight: 1.8 }}>
            Elevate your space with museum-quality materials and artisanal craftsmanship.
          </p>
          <div className="d-flex gap-3 flex-wrap">
            <button className="btn-af btn-af-white" onClick={() => navigate("/gallery")}>Explore Gallery</button>
            <button className="btn-af-outline" style={{ borderColor: "rgba(255,255,255,0.6)", color: "#fff" }} onClick={() => navigate("/collections")}>View Collections</button>
          </div>
        </div>
      </section>

      {/* ── Error ────────────────────────────────── */}
      {error && (
        <div className="container mt-4">
          <div className="alert alert-danger" style={{ borderRadius: 0 }}>{error}</div>
        </div>
      )}

      {/* ── Featured Frames ───────────────────────── */}
      <section className="py-5 py-md-6">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <span className="eyebrow">Collections</span>
              <h2 className="section-title mb-0">Featured Frames</h2>
            </div>
            <button className="btn-af-outline btn-af-sm" onClick={() => navigate("/gallery")}>View All</button>
          </div>

          <div className="row g-3">
            {loading
              ? [1, 2, 3].map((n) => (
                  <div className="col-12 col-sm-6 col-md-4" key={n}>
                    <div className="af-card">
                      <div className="skeleton" style={{ height: 260 }}></div>
                      <div className="p-3">
                        <div className="skeleton mb-2" style={{ height: 16, width: "60%" }}></div>
                        <div className="skeleton" style={{ height: 14, width: "40%" }}></div>
                      </div>
                    </div>
                  </div>
                ))
              : products.map((p) => (
                  <div className="col-12 col-sm-6 col-md-4" key={p._id}>
                    <div className="af-card" onClick={() => navigate(`/product/${p._id}`)} style={{ cursor: "pointer" }}>
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
                          <span style={{ fontWeight: 500 }}>{p.name}</span>
                          <span style={{ fontWeight: 700 }}>{p.price} EGP</span>
                        </div>
                        <p className="text-muted mb-0" style={{ fontSize: "0.78rem" }}>
                          {[p.material, p.category?.name].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
            }
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────── */}
      <section className="py-5 py-md-6" style={{ background: "var(--white)", borderTop: "1px solid var(--border)" }}>
        <div className="container">
          <h2 className="section-title text-center mb-2">Seamless Customization</h2>
          <p className="text-center text-muted mb-5" style={{ fontSize: "0.9rem" }}>
            From digital gallery to physical walls in three steps.
          </p>
          <div className="row g-3">
            {[
              { icon: "📤", title: "1. Browse & Choose",   desc: "Explore our curated collection of premium frames across multiple categories." },
              { icon: "🖼️", title: "2. Select Your Frame", desc: "Choose your size and add to cart. Each frame uses museum-grade materials." },
              { icon: "📦", title: "3. Gallery Delivery",  desc: "Hand-packed and delivered with a custom hanging kit for your piece." },
            ].map((item) => (
              <div className="col-12 col-md-4" key={item.title}>
                <div style={{ background: "var(--cream)", border: "1px solid var(--border)", padding: "32px", height: "100%" }}>
                  <p style={{ fontSize: "2rem", marginBottom: 12 }}>{item.icon}</p>
                  <p style={{ fontWeight: 600, marginBottom: 6 }}>{item.title}</p>
                  <p className="text-muted" style={{ fontSize: "0.85rem", lineHeight: 1.8 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ────────────────────────────── */}
      {!loading && categories.length > 0 && (
        <section className="py-5 py-md-6">
          <div className="container">
            <span className="eyebrow">Browse By</span>
            <h2 className="section-title mb-4">Categories</h2>
            <div className="row g-3">
              {categories.map((cat) => (
                <div className="col-12 col-sm-4" key={cat._id}>
                  <div
                    className="af-card p-4"
                    onClick={() => navigate(`/gallery?category=${cat._id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <h5 className="serif mb-2">{cat.name}</h5>
                    <p className="text-muted mb-0" style={{ fontSize: "0.83rem", lineHeight: 1.7 }}>{cat.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Testimonial ───────────────────────────── */}
      <section className="py-5 py-md-6 text-center text-white" style={{ background: "var(--dark)" }}>
        <div className="container" style={{ maxWidth: 680 }}>
          <h3 className="serif" style={{ fontSize: "clamp(1.3rem,3vw,2rem)", fontStyle: "italic", lineHeight: 1.5 }}>
            "ArtFrame doesn't just sell frames; they curate the final moment of the creative process."
          </h3>
          <p className="mt-3" style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.72rem", letterSpacing: "0.1em" }}>
            — ELENA RODRIGUEZ, SENIOR CURATOR, MET COLLECTIVE
          </p>
        </div>
      </section>
    </div>
  );
}

export default Home;
