import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

function Home() {
  const [products, setProducts]   = useState([]);
  const [categories, setCategories] = useState([]); // <-- Added categories state
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
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

      // ─── Dynamic Category Mapping (Same as Collections.js) ───
      const imageMap = {
        "Cars": "/cars.WEBP", 
        "Series": "/movies.WEBP",
        "Movies": "/movies.webp", // Covering both naming variations
        "Quotes": "/Quotes.WEBP", 
        "Sports": "/sport.WEBP",
        "Football": "/sport.webp",
        "Music": "/music.jpeg", 
        "Art & Culture": "/Art & Culture.jpeg" 
      };

      const mappedCategories = catData.map(cat => ({
        ...cat,
        imageUrl: imageMap[cat.name] || "/placeholder.png"
      }));

      setProducts(prodData.slice(0, 3));
      setCategories(mappedCategories.slice(0, 4)); // Only keep 4 for the homepage design
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <style>{`
        /* ── Hero ── */
        .hero-section {
          position: relative;
          min-height: 92vh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          z-index: 0;
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            rgba(0,0,0,0.72) 0%,
            rgba(0,0,0,0.35) 60%,
            rgba(0,0,0,0.1) 100%
          );
          z-index: 1;
        }
        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 560px;
        }

        /* ── Category tiles ── */
        .cat-tile {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          aspect-ratio: 3 / 4;
        }
        .cat-tile img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }
        .cat-tile:hover img {
          transform: scale(1.06);
        }
        .cat-tile-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.35);
          transition: background 0.3s ease;
        }
        .cat-tile:hover .cat-tile-overlay {
          background: rgba(0,0,0,0.52);
        }
        .cat-tile-label {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 700;
          font-size: clamp(1rem, 2vw, 1.25rem);
          letter-spacing: 0.03em;
          pointer-events: none;
          text-transform: capitalize;
        }
      `}</style>

      {/* ── Hero ─────────────────────────────────── */}
      <section className="hero-section px-4 px-md-5">
        <img
          src="/home.jpg"
          alt="Hero background"
          className="hero-bg"
          loading="eager"
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="eyebrow text-white-50"></span>
          <h1 className="hero-title mb-3">
            EXPERIENCE TRUE ORIGINALITY
          </h1>
          <p className="mb-4" style={{ color: "rgba(255,255,255,0.75)", maxWidth: 460, lineHeight: 1.8 }}>
            Elevate your space with museum-quality materials and artisanal craftsmanship.
          </p>
          <div className="d-flex gap-3 flex-wrap">
            <button className="btn-af btn-af-white" onClick={() => navigate("/gallery")}>
              Shop Frames
            </button>
            <button
              className="btn-af-outline"
              style={{ borderColor: "rgba(255,255,255,0.6)", color: "#fff" }}
              onClick={() => navigate("/collections")}
            >
              View Collections
            </button>
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
            <button className="btn-af-outline btn-af-sm" onClick={() => navigate("/gallery")}>
              View All
            </button>
          </div>

          <div className="row g-3">
            {loading
              ? [1, 2, 3].map((n) => (
                  <div className="col-12 col-sm-6 col-md-4" key={n}>
                    <div className="af-card">
                      <div className="skeleton" style={{ height: 260 }} />
                      <div className="p-3">
                        <div className="skeleton mb-2" style={{ height: 16, width: "60%" }} />
                        <div className="skeleton" style={{ height: 14, width: "40%" }} />
                      </div>
                    </div>
                  </div>
                ))
              : products.map((p) => (
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
                              loading="lazy"
                              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          : <div style={{ position: "absolute", inset: 0, background: "#f0ece6" }} />
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
          <h2 className="section-title text-center mb-2">Discover unique designs crafted with passion and creativity</h2>
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

      {/* ── Search By Category ────────────────────── */}
      <section className="py-5 py-md-6">
        <div className="container">
          <h2
            className="text-center mb-5"
            style={{
              fontWeight: 900,
              fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            Search By Category
          </h2>

          <div className="row g-3 justify-content-center">
            {/* Replace static CATEGORY_TILES with dynamically mapped categories */}
            {loading ? (
               [1, 2, 3, 4].map((n) => (
                <div className="col-6 col-md-3" key={n}>
                  <div className="skeleton cat-tile" style={{ height: "100%" }} />
                </div>
               ))
            ) : categories.map((cat) => (
              <div className="col-6 col-md-3" key={cat._id}>
                <div
                  className="cat-tile"
                  onClick={() => navigate(`/gallery?category=${cat._id}`)}
                >
                  <img src={cat.imageUrl} alt={cat.name} loading="lazy" />
                  <div className="cat-tile-overlay" />
                  <div className="cat-tile-label">{cat.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonial ───────────────────────────── */}
      <section className="py-5 py-md-6 text-center text-white" style={{ background: "var(--dark)" }}>
        <div className="container" style={{ maxWidth: 680 }}>
          <h3
            className="serif"
            style={{ fontSize: "clamp(1.3rem,3vw,2rem)", fontStyle: "italic", lineHeight: 1.5 }}
          >
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