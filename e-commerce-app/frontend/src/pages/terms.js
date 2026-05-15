function Terms() {
  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh", padding: "60px 20px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", background: "#fff", borderRadius: 12, padding: "48px 56px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
        <h1 style={{ fontWeight: 800, fontSize: "2rem", marginBottom: 8 }}>Terms & Conditions</h1>
        <p style={{ color: "#999", fontSize: "0.85rem", marginBottom: 36 }}>Last updated: May 2025</p>

        <Section title="1. Acceptance of Terms">
          By accessing and using Artframe, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website or services.
        </Section>

        <Section title="2. Products & Orders">
          All products are subject to availability. We reserve the right to discontinue any product at any time. Once an order is placed, you will receive a confirmation email. We reserve the right to cancel orders in cases of pricing errors or stock unavailability.
        </Section>

        <Section title="3. Pricing">
          All prices are listed in Egyptian Pounds (EGP) and are subject to change without notice. We are not responsible for typographical errors in pricing. In the event of a pricing error, we reserve the right to cancel the affected order.
        </Section>

        <Section title="4. Shipping & Delivery">
          We aim to dispatch all orders within 2–5 business days. Delivery times may vary depending on your location. Artframe is not responsible for delays caused by shipping carriers or customs.
        </Section>

        <Section title="5. Returns & Refunds">
          If you receive a damaged or incorrect item, please contact us within 48 hours of delivery at rrstore.contact@gmail.com with photos of the item. We will arrange a replacement or refund at our discretion.
        </Section>

        <Section title="6. Intellectual Property">
          All content on this website, including images, designs, logos, and text, is the property of Artframe and may not be reproduced, distributed, or used without our written permission.
        </Section>

        <Section title="7. Limitation of Liability">
          Artframe shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services. Our total liability shall not exceed the value of your order.
        </Section>

        <Section title="8. Changes to Terms">
          We reserve the right to update these Terms and Conditions at any time. Continued use of the site after changes are posted constitutes your acceptance of the revised terms.
        </Section>

        <Section title="9. Contact">
          For any questions regarding these Terms, please reach us at rrstore.contact@gmail.com.
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

export default Terms;