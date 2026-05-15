import { useState, useEffect } from "react";//use effect hook 3lshan y3ml fetch lel data mn el backend lma el page tft7
import { useAuth } from "../context/AuthContext";// useAuth 3lshan ngeb el token 

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

function AdminOverview() {
  const { token } = useAuth();
  // state variables 3lshan n7ot feha el data ely hgeebha mn el backend 
  const [orders, setOrders]     = useState([]);
  const [users, setUsers]       = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);//3lshan n3rf el data gat kolha wala lesa
  const [error, setError]       = useState(null);//3lshan n7ot feha ay error y7sl lma n3ml fetch lel data

  useEffect(() => { fetchAll(); }, []);//[] da 3lshan y3ml fetch marra wa7da lma el component tfth 3lshan ehna msh mhtagen aktr mn keda

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      //yb3t el request da lel backend we ygeb el orders we el users we el products fe request wa7da 3lshan n5ly el dashboard yft7 bsr3a
      const orderRes = await fetch(`${API_URL}/orders`,   { headers });
      const userRes = await fetch(`${API_URL}/users`,    { headers });
      const productRes = await fetch(`${API_URL}/products`);

      if (!orderRes.ok || !userRes.ok || !productRes.ok) {
        throw new Error("Failed to load dashboard data");
      }
      
      const orderData = await orderRes.json();//3lshan ngeb el data mn el response we n7otha fe el state variables
      const userData = await userRes.json();
      const productData = await productRes.json();
      //3lshan lw el data msh array hnsebha fadya 3lshan lw el data ely gat nmn el backend lw feha 8lt hy3ml crash fe el backend
      setOrders(Array.isArray(orderData) ? orderData : []);
      setUsers(Array.isArray(userData) ? userData : []);
      setProducts(Array.isArray(productData) ? productData : []);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  let totalRevenue = 0;
  for (let i = 0; i < orders.length; i++) {
    totalRevenue += orders[i].totalPrice;
  }

  const stats = [
    { label: "Total Products", value: products.length, icon: "bi-box-seam",        bg: "#e8f4fd", color: "#1565c0" },
    { label: "Total Orders",   value: orders.length,   icon: "bi-bag-check",       bg: "#e8f5e9", color: "#2e7d32" },
    { label: "Total Users",    value: users.length,    icon: "bi-people",          bg: "#f3e5f5", color: "#6a1b9a" },
    { label: "Revenue",        value: `${totalRevenue.toFixed(0)} EGP`, icon: "bi-currency-dollar", bg: "#fff3e0", color: "#e65100" },
  ];

  if (error){
    return <div className="alert alert-danger" style={{ borderRadius: 0 }}>{error}</div>;
  }

  return (
    //row da mwgood fl bootstrap g-3 3lshan el columns yb2a feha gap benhom we mb-4 da margin bottom 4 3lshan yb2a feha space benha we ben ely tahteha 
    <div>
      <h4 className="serif mb-1">Dashboard Overview</h4>
      <p className="text-muted mb-4" style={{ fontSize: "0.85rem" }}>Welcome to the Artframe admin panel.</p>
      
      <div className="row g-3 mb-4">
        {stats.map((stat) => (
          <div className="col-6 col-md-3" key={stat.label}>
            <div className="af-card p-3" style={{ cursor: "default" }}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <div style={{ background: stat.bg, color: stat.color, padding: "8px", borderRadius: 4, lineHeight: 1 }}>
                  <i className={`bi ${stat.icon}`} style={{ fontSize: "1.1rem" }}></i>
                </div>
              </div>
              {loading
                ? <div className="skeleton" style={{ height: 24, width: "60%" }}></div>
                : <p className="serif mb-0" style={{ fontSize: "1.6rem", fontWeight: 700 }}>{stat.value}</p>
              }
              <small className="text-muted">{stat.label}</small>
            </div>
          </div>
        ))}
      </div>
      
      <h6 className="serif mb-3">Recent Orders</h6>
      {loading ? (//lw el data lesa btet7ml n3ml skeleton loading animation 3lshan n3rf el user en fe data btet7ml
        <div className="skeleton" style={{ height: 200 }}></div>
      ) : (
        <div className="af-card" style={{ cursor: "default" }}>
          
          {orders.slice(0, 5).map((order, i) => {
            //3lshan n3ml display lel 5 orders el a5rin 
            //3lshan n3rf n3ml display lel user name eh lw el user feh name n3ml display lel name lw mafeesh name bas feh email n3ml display lel email lw mafeesh email n3ml display "User" 3lshan yb2a feh 7aga btet3rd
            let userName = "User";
            if (order.user && order.user.name)       userName = order.user.name;
            else if (order.user && order.user.email) userName = order.user.email;

            return (
              <div
                key={order._id}
                className="d-flex justify-content-between align-items-center p-3"
                style={{ borderBottom: i < Math.min(orders.length, 5) - 1 ? "1px solid var(--border)" : "none" }}
              >
                <div>
                  <p className="mb-0" style={{ fontWeight: 500, fontSize: "0.88rem" }}>
                    #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <small className="text-muted">{userName}</small>
                </div>
                <div className="text-end">
                  <p className="mb-0" style={{ fontWeight: 600, fontSize: "0.88rem" }}>{order.totalPrice.toFixed(2)} EGP</p>
                  <small className="text-muted">{order.status}</small>
                </div>
              </div>
            );
          })}
          {orders.length === 0 && (
            <div className="p-4 text-center text-muted">No orders yet</div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminOverview;