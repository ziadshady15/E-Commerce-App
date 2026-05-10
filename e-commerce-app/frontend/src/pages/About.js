function About() {
  return (
    <div>
      {/* Hero */}
      <div style={{ background: "var(--dark)", color: "var(--white)" }} className="py-5 px-4 px-md-5">
        <span className="eyebrow" style={{ color: "rgba(255,255,255,0.5)" }}>Our Story</span>
        <h2 className="serif mb-3" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}>
          The Art of Preservation Since 2014
        </h2>
        <p style={{ color: "rgba(255,255,255,0.7)", maxWidth: 480, lineHeight: 1.8 }}>
          ArtFrame was founded on a single belief: that the frame around a piece of art is as important as the art itself.
        </p>
      </div>

      {/* Mission */}
      <div style={{ background: "var(--white)" }} className="py-5">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-12 col-md-6">
              <span className="eyebrow">Our Mission</span>
              <h3 className="section-title mb-3">Curating the Final Moment</h3>
              <p className="text-muted mb-3" style={{ lineHeight: 1.9, fontSize: "0.9rem" }}>
                We believe that art deserves to be preserved with the same intention and care that went into creating it.
                Our studio works with sustainably sourced materials from around the world.
              </p>
              <p className="text-muted" style={{ lineHeight: 1.9, fontSize: "0.9rem" }}>
                Each frame is hand-assembled by our team of master craftspeople, using museum-grade acrylic
                and acid-free mounting boards that protect art for generations.
              </p>
            </div>
            <div className="col-12 col-md-6">
              <div
                style={{ background: "var(--cream)", aspectRatio: "1", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "4rem" }}
              >🎨</div>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div style={{ background: "var(--cream)" }} className="py-5">
        <div className="container">
          <h3 className="section-title text-center mb-5">Our Values</h3>
          <div className="row g-3">
            {[
              { icon: "🌿", title: "Sustainability",   desc: "All wood is FSC-certified and responsibly sourced from managed forests." },
              { icon: "🔬", title: "Museum Quality",   desc: "We use the same materials trusted by major art institutions worldwide." },
              { icon: "✋", title: "Handcrafted",      desc: "Every frame is assembled by hand and inspected before leaving our studio." },
            ].map((v) => (
              <div className="col-12 col-md-4" key={v.title}>
                <div style={{ background: "var(--white)", border: "1px solid var(--border)", padding: "32px", height: "100%" }}>
                  <p style={{ fontSize: "2rem", marginBottom: 12 }}>{v.icon}</p>
                  <h5 className="serif mb-2">{v.title}</h5>
                  <p className="text-muted mb-0" style={{ lineHeight: 1.8, fontSize: "0.85rem" }}>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
