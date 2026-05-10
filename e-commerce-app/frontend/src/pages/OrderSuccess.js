import { useNavigate } from "react-router-dom";

function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center text-center p-4"
      style={{ minHeight: "60vh" }}
    >
      <div
        className="mb-3"
        style={{
          width: 72, height: 72, borderRadius: "50%",
          background: "var(--black)", color: "var(--white)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem"
        }}
      >
        ✓
      </div>
      <h2 className="serif mb-2">Order Confirmed!</h2>
      <p className="text-muted mb-4" style={{ maxWidth: 360 }}>
        Thank you for your purchase. Your frame is being carefully prepared and will be shipped soon.
      </p>
      <div className="d-flex gap-3 flex-wrap justify-content-center">
        <button className="btn-af" onClick={() => navigate("/profile")}>View My Orders</button>
        <button className="btn-af-outline" onClick={() => navigate("/gallery")}>Continue Shopping</button>
      </div>
    </div>
  );
}

export default OrderSuccess;
