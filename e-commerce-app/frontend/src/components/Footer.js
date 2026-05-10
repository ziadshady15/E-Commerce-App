import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="af-footer">
      <div className="container">
        <div className="row g-4 mb-4">
          <div className="col-12 col-md-4">
            <p className="serif" style={{ fontSize: "1.3rem", fontStyle: "italic" }}>ArtFrame</p>
            <p className="text-muted" style={{ fontSize: "0.82rem", lineHeight: 1.8, maxWidth: 220 }}>
              Elevating spaces through intentional design and artisanal framing since 2014.
            </p>
          </div>

          {[
            { title: "Shop",    links: [{ label: "Gallery",     to: "/gallery" },     { label: "Collections", to: "/collections" }] },
            { title: "Company", links: [{ label: "About",       to: "/about" },       { label: "Contact",     to: "#" }] },
            { title: "Legal",   links: [{ label: "Privacy",     to: "#" },            { label: "Terms",       to: "#" }] },
          ].map((col) => (
            <div className="col-6 col-md-2" key={col.title}>
              <p className="eyebrow fw-semibold mb-2">{col.title}</p>
              {col.links.map((l) => (
                <Link
                  key={l.label}
                  to={l.to}
                  className="d-block text-muted mb-1"
                  style={{ fontSize: "0.82rem", transition: "color 0.2s" }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <hr style={{ borderColor: "var(--border)" }} />
        <div className="d-flex justify-content-between flex-wrap gap-2">
          <span className="text-muted" style={{ fontSize: "0.75rem" }}>© 2024 ArtFrame. The Art of Preservation.</span>
          <span className="text-muted" style={{ fontSize: "0.75rem" }}>Privacy · Terms</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
