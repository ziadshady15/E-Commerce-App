import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

function validate(values) {
  const errors = {};
  if (!values.firstName.trim()) errors.firstName = "First name is required";
  if (!values.lastName.trim())  errors.lastName  = "Last name is required";
  if (!values.street.trim())    errors.street    = "Street address is required";
  if (!values.city.trim())      errors.city      = "City is required";
  if (!values.country.trim())   errors.country   = "Country is required";
  return errors;
}

function Checkout() {
  const { token } = useAuth();
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [delivery, setDelivery] = useState("standard");

  if (!token) { navigate("/login"); return null; }

  const items    = cart.items || [];
  const subtotal = cart.totalPrice || 0;
  const fee      = delivery === "white-glove" ? 45 : 0;
  const tax      = subtotal * 0.08;
  const total    = subtotal + fee + tax;

  const formik = useFormik({
    initialValues: { firstName: "", lastName: "", street: "", city: "", country: "Egypt" },
    validate,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setStatus(null);
      try {
        const res = await fetch(`${API_URL}/orders/checkout`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            shippingAddress: {
              street: `${values.firstName} ${values.lastName}, ${values.street}`,
              city: values.city,
              country: values.country,
            },
          }),
        });
        if (!res.ok) {
          const data = await res.json();
          setStatus(data.message || "Checkout failed. Please try again.");
          return;
        }
        await clearCart();
        navigate("/order-success");
      } catch (err) {
        setStatus("Network error. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="container py-4 py-md-5">
      <h2 className="serif mb-1">Checkout</h2>

      {/* Steps */}
      <div className="d-flex gap-3 align-items-center mb-4" style={{ fontSize: "0.78rem" }}>
        {["Shipping", "Payment", "Review"].map((step, i) => (
          <div key={step} className="d-flex align-items-center gap-2">
            {i > 0 && <span style={{ color: "var(--border)" }}>—</span>}
            <span
              className="d-flex align-items-center justify-content-center"
              style={{
                width: 22, height: 22, borderRadius: "50%",
                background: i === 0 ? "var(--black)" : "var(--border)",
                color: i === 0 ? "var(--white)" : "var(--gray)",
                fontSize: "0.7rem", fontWeight: 600
              }}
            >{i + 1}</span>
            <span style={{ color: i === 0 ? "var(--black)" : "var(--gray)", fontWeight: i === 0 ? 600 : 400 }}>{step}</span>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Form */}
        <div className="col-12 col-md-7">
          <form onSubmit={formik.handleSubmit} noValidate>
            {/* Shipping */}
            <div className="af-card p-4 mb-3">
              <h5 className="serif mb-3">Shipping Address</h5>

              {formik.status && (
                <div className="alert alert-danger py-2 mb-3" style={{ borderRadius: 0, fontSize: "0.83rem" }}>
                  {formik.status}
                </div>
              )}

              <div className="row g-3">
                <div className="col-12 col-sm-6">
                  <label className="af-label">First Name</label>
                  <input
                    name="firstName"
                    className={`af-input ${formik.touched.firstName && formik.errors.firstName ? "is-invalid" : ""}`}
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="John"
                  />
                  {formik.touched.firstName && formik.errors.firstName && (
                    <p className="af-error">{formik.errors.firstName}</p>
                  )}
                </div>

                <div className="col-12 col-sm-6">
                  <label className="af-label">Last Name</label>
                  <input
                    name="lastName"
                    className={`af-input ${formik.touched.lastName && formik.errors.lastName ? "is-invalid" : ""}`}
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Doe"
                  />
                  {formik.touched.lastName && formik.errors.lastName && (
                    <p className="af-error">{formik.errors.lastName}</p>
                  )}
                </div>

                <div className="col-12">
                  <label className="af-label">Street Address</label>
                  <input
                    name="street"
                    className={`af-input ${formik.touched.street && formik.errors.street ? "is-invalid" : ""}`}
                    value={formik.values.street}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="123 Main St"
                  />
                  {formik.touched.street && formik.errors.street && (
                    <p className="af-error">{formik.errors.street}</p>
                  )}
                </div>

                <div className="col-12 col-sm-6">
                  <label className="af-label">City</label>
                  <input
                    name="city"
                    className={`af-input ${formik.touched.city && formik.errors.city ? "is-invalid" : ""}`}
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Cairo"
                  />
                  {formik.touched.city && formik.errors.city && (
                    <p className="af-error">{formik.errors.city}</p>
                  )}
                </div>

                <div className="col-12 col-sm-6">
                  <label className="af-label">Country</label>
                  <select
                    name="country"
                    className="af-input"
                    value={formik.values.country}
                    onChange={formik.handleChange}
                  >
                    {["Egypt", "United States", "United Kingdom", "UAE", "Saudi Arabia", "France"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div className="af-card p-4">
              <h5 className="serif mb-3">Delivery Method</h5>
              {[
                { value: "standard",   label: "Standard Shipping",   sub: "5–7 Business Days",                   price: "Free" },
                { value: "white-glove", label: "White Glove Delivery", sub: "2–3 Business Days · Insured",         price: "45.00 EGP" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className="d-flex align-items-center gap-3 p-3 mb-2"
                  style={{
                    border: "1px solid var(--border)",
                    cursor: "pointer",
                    background: delivery === opt.value ? "var(--cream)" : "var(--white)"
                  }}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value={opt.value}
                    checked={delivery === opt.value}
                    onChange={() => setDelivery(opt.value)}
                  />
                  <div className="flex-grow-1">
                    <p className="mb-0" style={{ fontWeight: 500, fontSize: "0.88rem" }}>{opt.label}</p>
                    <small className="text-muted">{opt.sub}</small>
                  </div>
                  <strong style={{ fontSize: "0.88rem" }}>{opt.price}</strong>
                </label>
              ))}

              <button type="submit" className="btn-af w-100 mt-3" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? "Processing..." : "Place Order"}
              </button>
            </div>
          </form>
        </div>

        {/* Summary */}
        <div className="col-12 col-md-5">
          <div className="af-card p-4" style={{ position: "sticky", top: 80, cursor: "default" }}>
            <h5 className="serif mb-3">Order Summary</h5>
            {items.map((item) => (
              <div key={item._id} className="d-flex gap-3 mb-3 pb-3" style={{ borderBottom: "1px solid var(--border)" }}>
                <div style={{ width: 50, height: 50, background: "#f0ece6", flexShrink: 0 }}>
                  {item.product?.image && (
                    <img src={item.product.image} alt={item.product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                </div>
                <div className="flex-grow-1">
                  <p className="mb-0" style={{ fontSize: "0.85rem", fontWeight: 500 }}>{item.product?.name}</p>
                  <small className="text-muted">Qty: {item.quantity}</small>
                </div>
                <strong style={{ fontSize: "0.85rem" }}>{(item.product?.price * item.quantity).toFixed(2)} EGP</strong>
              </div>
            ))}
            <div className="d-flex justify-content-between mb-1"><small>Subtotal</small><small>{subtotal.toFixed(2)} EGP</small></div>
            <div className="d-flex justify-content-between mb-1"><small>Shipping</small><small>{fee === 0 ? "Free" : `${fee.toFixed(2)} EGP`}</small></div>
            <div className="d-flex justify-content-between mb-2"><small>Tax (8%)</small><small>{tax.toFixed(2)} EGP</small></div>
            <hr style={{ borderColor: "var(--border)" }} />
            <div className="d-flex justify-content-between"><strong>Total</strong><strong>{total.toFixed(2)} EGP </strong></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
