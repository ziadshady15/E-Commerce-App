import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

function Collections() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { 
    fetchCategories(); 
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/categories`);
      if (!res.ok) throw new Error("Failed to load collections.");
      
      const fetchedCategories = await res.json();

      // Mapping database category names to your exact image filenames
      const imageMap = {
        "Cars": "/cars.WEBP", 
        "Series": "/movies.WEBP", 
        "Quotes": "/Quotes.WEBP", 
        "Sports": "/sport.WEBP", 
        "Music": "/music.jpeg", 
        "Art & Culture": "/Art & Culture.jpeg" 
      };

      // Add the matched image to each category
      const categoriesWithImages = fetchedCategories.map(cat => ({
        ...cat,
        imageUrl: imageMap[cat.name] || "/placeholder.png" 
      }));

      setCategories(categoriesWithImages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div style={{ background: "var(--white)", borderBottom: "1px solid var(--border)" }} className="py-5 px-4 px-md-5">
        <span className="eyebrow">Collections</span>
        <h2 className="section-title mb-2">SEARCH BY CATEGORY</h2>
        <p className="text-muted" style={{ maxWidth: 500, lineHeight: 1.8 }}>
          Experience designs like no other. 100% original, made with passion.
        </p>
      </div>

      {/* Grid Section */}
      <div className="container py-4 py-md-5">
        {error && <div className="alert alert-danger mb-3" style={{ borderRadius: 0 }}>{error}</div>}

        <div className="row g-3">
          {loading
            ? [1, 2, 3, 4, 5, 6].map((n) => (
                <div className="col-12 col-sm-6 col-md-4" key={n}>
                  <div className="skeleton" style={{ height: 250, backgroundColor: "#eee" }}></div>
                  <div className="skeleton mt-2" style={{ height: 16, width: "60%", backgroundColor: "#eee" }}></div>
                </div>
              ))
            : categories.map((cat) => (
                <div className="col-12 col-sm-6 col-md-4" key={cat._id}>
                  <div className="af-card h-100 d-flex flex-column" style={{ border: "1px solid var(--border)", background: "var(--white)" }}>
                    
                    {/* Image Container */}
                    <div style={{ height: 250, overflow: "hidden", borderBottom: "1px solid var(--border)", backgroundColor: "var(--cream)" }}>
                      <img 
                        src={cat.imageUrl} 
                        alt={`${cat.name} collection`}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>

                    {/* Text & Button Container */}
                    <div className="p-4 d-flex flex-column flex-grow-1">
                      <h5 className="serif mb-2" style={{ textTransform: "capitalize" }}>{cat.name}</h5>
                      <p className="text-muted mb-4 flex-grow-1" style={{ fontSize: "0.85rem", lineHeight: 1.7 }}>
                        {cat.description}
                      </p>
                      <button 
                        className="btn-af-outline w-100 mt-auto" 
                        onClick={() => navigate(`/gallery?category=${cat._id}`)}
                        style={{ padding: "10px", fontSize: "0.9rem", letterSpacing: "1px", textTransform: "uppercase" }}
                      >
                        Explore Collection
                      </button>
                    </div>
                    
                  </div>
                </div>
              ))
          }
        </div>
      </div>
    </div>
  );
}

export default Collections;