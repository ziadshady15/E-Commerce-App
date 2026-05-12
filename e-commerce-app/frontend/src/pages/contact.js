function Contact() {
  return (
    <div style={{ minHeight: "70vh", background: "#f5f5f5", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 20px" }}>
      <h1 style={{ fontWeight: 800, fontSize: "clamp(2rem, 5vw, 3rem)", marginBottom: "40px" }}>
        Contact Us
      </h1>

      <div style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "48px 60px",
        display: "flex",
        gap: "80px",
        flexWrap: "wrap",
        justifyContent: "center",
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        width: "100%",
        maxWidth: "780px",
      }}>

        {/* Email */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="black">
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
          <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>Artframe.contact@gmail.com</span>
        </div>

        {/* Phone */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="black">
            <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1.01l-2.2 2.2z"/>
          </svg>
          <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>+20 123 456 7890</span>
        </div>

      </div>
    </div>
  );
}

export default Contact;