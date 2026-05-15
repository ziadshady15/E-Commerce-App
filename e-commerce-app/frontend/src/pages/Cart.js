import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Cart() {
  // 1. استدعينا updateQuantity بدل addToCart
  const { cart, removeFromCart, updateQuantity } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  if (!token) {
    return (
      <div className="container text-center py-5">
        <i className="bi bi-bag" style={{ fontSize: "3rem", color: "var(--gray)" }}></i>
        <h4 className="serif mt-3 mb-1">Please Login</h4>
        <p className="text-muted mb-4">You need to be logged in to view your cart.</p>
        <button className="btn-af" onClick={() => navigate("/login")}>Login</button>
      </div>
    );
  }

  const items = cart.items || [];

  if (items.length === 0) {
    return (
      <div className="container text-center py-5">
        <i className="bi bi-bag" style={{ fontSize: "3rem", color: "var(--gray)" }}></i>
        <h4 className="serif mt-3 mb-1">Your collection is empty</h4>
        <p className="text-muted mb-4">Browse our gallery to find your perfect frame.</p>
        <button className="btn-af" onClick={() => navigate("/gallery")}>Explore Gallery</button>
      </div>
    );
  }

  const subtotal = cart.totalPrice || 0;
  const tax      = subtotal * 0.08;
  const total    = subtotal + tax;

  return (
    <div className="container py-4 py-md-5">
      <h2 className="serif mb-1">Your Gallery Selection</h2>
      <p className="text-muted mb-4" style={{ fontSize: "0.88rem" }}>
        Review and curate your bespoke pieces before finalizing.
      </p>

      <div className="row g-4">
        {/* Items */}
        <div className="col-12 col-md-8">
          {items.map((item) => (
            <div key={item._id} className="af-card mb-3 p-3" style={{ cursor: "default" }}>
              <div className="row g-3 align-items-start">
                {/* Image */}
                <div className="col-3 col-sm-2">
                  <div className="product-img-wrap" style={{ aspectRatio: "1" }}>
                    {item.product?.image
                      ? <img src={item.product.image} alt={item.product?.name} />
                      : <div className="product-img-placeholder"></div>
                    }
                  </div>
                </div>

                {/* Info */}
                <div className="col-9 col-sm-7">
                  <p style={{ fontWeight: 500, marginBottom: 6 }}>{item.product?.name}</p>
                  {item.product?.material && (
                    <span className="chip mb-2 d-inline-block">{item.product.material}</span>
                  )}
                  <div className="qty-control">
                    {/* 2. تعديل زرار التخفيض */}
                    <button
                      className="qty-btn"
                      onClick={() => item.quantity === 1 ? removeFromCart(item.product._id) : updateQuantity(item.product._id, item.quantity - 1)}
                    >−</button>
                    <span className="qty-val">{item.quantity}</span>
                    {/* 3. تعديل زرار التزويد */}
                    <button 
                      className="qty-btn" 
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                    >+</button>
                  </div>
                </div>

                {/* Price + Remove */}
                <div className="col-12 col-sm-3 text-sm-end">
                  <p style={{ fontWeight: 700, marginBottom: 8 }}>
                    {(item.product?.price * item.quantity).toFixed(2)} EGP
                  </p>
                  <button
                    onClick={() => removeFromCart(item.product._id)}
                    style={{ background: "none", border: "none", color: "var(--gray)", fontSize: "0.75rem", cursor: "pointer", letterSpacing: "0.08em", textTransform: "uppercase" }}
                  >
                    <i className="bi bi-trash me-1"></i> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="col-12 col-md-4">
          <div className="af-card p-4" style={{ position: "sticky", top: 80, cursor: "default" }}>
            <h5 className="serif mb-3">Order Summary</h5>

            <div className="d-flex justify-content-between mb-2">
              <small>Subtotal</small>
              <small>{subtotal.toFixed(2)} EGP</small>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <small>Estimated Shipping</small>
              <small>Free</small>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <small>Tax (8%)</small>
              <small>{tax.toFixed(2)} EGP</small>
            </div>

            <hr style={{ borderColor: "var(--border)" }} />

            <div className="d-flex justify-content-between mb-4">
              <strong>Total</strong>
              <strong>{total.toFixed(2)} EGP</strong>
            </div>

            <button className="btn-af w-100" onClick={() => navigate("/checkout")}>
              Proceed to Checkout →
            </button>

            <div className="mt-3 p-3" style={{ background: "var(--cream)", border: "1px solid var(--border)", fontSize: "0.78rem" }}>
              🏛️ Every frame is inspected by our senior curators before shipping.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;