function About() {
  return (
    <section className="py-5" style={{ background: "var(--white)" }}>
      <div className="container">
        
        {/* Story / Hero Section */}
        <div className="row mb-5 pb-4 border-bottom">
          <div className="col-12 col-lg-8">
            <span className="eyebrow text-muted" style={{ letterSpacing: "2px", textTransform: "uppercase", fontSize: "0.8rem" }}>
              Our Story
            </span>
            <h2 className="serif mb-4 mt-2" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "var(--dark)" }}>
              Welcome to ArtFrame
            </h2>
            <p className="text-muted" style={{ fontSize: "1.1rem", lineHeight: 1.8 }}>
              Our journey into the visual arts began with a shared curiosity for how a digital spark can transform into a lasting impression. What started as an exploration of design has evolved over the past four years into a global practice focused on clarity and impact.
            </p>
            <p className="text-muted" style={{ fontSize: "1.1rem", lineHeight: 1.8 }}>
              ArtFrame is the realization of that evolution. Here, we believe that art is more than just an image—it is a physical experience. By blending modern creative techniques with the timeless principles of preservation, we deliver original works designed to inhabit your space for a lifetime.
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="row g-5 align-items-center mb-5 pb-4 border-bottom">
          <div className="col-12 col-md-6 order-2 order-md-1">
            <img 
              src="/cars.WEBP" 
              alt="ArtFrame museum-grade preservation process" 
              style={{ 
                width: "75%", 
                aspectRatio: "4:5", /* <-- Changed from "1" to "4/5" for the tall rectangle look */
                objectFit: "cover", 
                backgroundColor: "var(--cream)" // Acts as a fallback color while loading
              }} 
            />
          </div>
          <div className="col-12 col-md-6 order-1 order-md-2">
            <span className="eyebrow text-muted" style={{ letterSpacing: "2px", textTransform: "uppercase", fontSize: "0.8rem" }}>
              Our Mission
            </span>
            <h3 className="section-title mb-3 mt-2 serif" style={{ color: "var(--dark)" }}>
              Curating the Final Moment
            </h3>
            <p className="text-muted mb-3" style={{ lineHeight: 1.9, fontSize: "0.95rem" }}>
              We believe that art deserves to be preserved with the same intention and care that went into creating it. Our studio works with sustainably sourced materials from around the world.
            </p>
            <p className="text-muted" style={{ lineHeight: 1.9, fontSize: "0.95rem" }}>
              Each frame is hand-assembled by our team of master craftspeople, using museum-grade acrylic and acid-free mounting boards that protect art for generations.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="row g-4">
          <div className="col-12 mb-2">
            <span className="eyebrow text-muted" style={{ letterSpacing: "2px", textTransform: "uppercase", fontSize: "0.8rem" }}>
              Our Principles
            </span>
            <h3 className="section-title mt-2 serif" style={{ color: "var(--dark)" }}>
              Why Choose ArtFrame
            </h3>
          </div>
          {[
            { icon: "🚚", title: "Fast Shipping",     desc: "Delivery within 4 days!" },
            { icon: "🖼️", title: "Anti-Pixelation",   desc: "High-resolution prints with sharp details." },
            { icon: "🎨", title: "Original Artwork",  desc: "Original Designs you won't find anywhere else." },
            { icon: "📦", title: "Premium Packaging", desc: "Secure & stylish packaging for perfect delivery." }
          ].map((v) => (
            <div className="col-12 col-md-6 col-lg-3" key={v.title}>
              <div style={{ background: "var(--cream)", border: "1px solid var(--border)", padding: "32px", height: "100%" }}>
                <p style={{ fontSize: "2rem", marginBottom: 12 }}>{v.icon}</p>
                <h5 className="serif mb-2" style={{ color: "var(--dark)", fontSize: "1.1rem" }}>{v.title}</h5>
                <p className="text-muted mb-0" style={{ lineHeight: 1.6, fontSize: "0.85rem" }}>{v.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default About;