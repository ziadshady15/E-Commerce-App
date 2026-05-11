function privacy() {
  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh", padding: "60px 20px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", background: "#fff", borderRadius: 12, padding: "48px 56px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
        <h1 style={{ fontWeight: 800, fontSize: "2rem", marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ color: "#999", fontSize: "0.85rem", marginBottom: 36 }}>Last updated: May 2025</p>

        <Section title="1. Information We Collect">
          We collect information you provide directly to us when placing an order, including your name, email address, shipping address, and payment details. We also automatically collect certain information about your device and how you interact with our site.
        </Section>

        <Section title="2. How We Use Your Information">
          We use the information we collect to process and fulfill your orders, send order confirmations and shipping updates, respond to your comments and questions, and improve our products and services.
        </Section>

        <Section title="3. Sharing of Information">
          We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website and conducting our business, as long as those parties agree to keep this information confidential.
        </Section>

        <Section title="4. Data Retention">
          We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.
        </Section>

        <Section title="5. Cookies">
          Our website uses cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings, though this may affect some functionality of the site.
        </Section>

        <Section title="6. Security">
          We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure. However, no internet transmission is completely secure and we cannot guarantee absolute security.
        </Section>

        <Section title="7. Contact">
          If you have any questions about this Privacy Policy, please contact us at rrstore.contact@gmail.com.
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: 10 }}>{title}</h2>
      <p style={{ color: "#555", fontSize: "0.92rem", lineHeight: 1.85, margin: 0 }}>{children}</p>
    </div>
  );
}

export default privacy;