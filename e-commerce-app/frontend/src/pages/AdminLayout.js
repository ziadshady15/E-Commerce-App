import { useState } from "react";// hook 3lshan y3ml traack le application state function bta5od el current state we el state ely 3awza trohlha
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";//3lshan el logout
import AdminOverview from "./AdminOverview";
import AdminProducts from "./AdminProducts";
import AdminOrders   from "./AdminOrders";
import AdminUsers    from "./AdminUsers";
import AdminReviews  from "./AdminReviews";

//array feha el buttons ely hst5dmha fe el sidebar we el icons bta3tha we el label bta3tha
//icon da class name mn bootstarp 
const NAV_ITEMS = [
  { key: "overview", icon: "bi-speedometer2", label: "Overview" },
  { key: "products", icon: "bi-box-seam",     label: "Products" },
  { key: "orders",   icon: "bi-bag-check",    label: "Orders"   },
  { key: "users",    icon: "bi-people",       label: "Users"    },
  { key: "reviews",  icon: "bi-star",         label: "Reviews"  },
];
//da b2a 3lshan n5ly kol key leh el page bta3tha 3lshan lama ados 3la button ely fe el sidebar y3ml render lel page ely mwgoda fe el main content
const PAGES = {
  overview: <AdminOverview />,
  products: <AdminProducts />,
  orders:   <AdminOrders />,
  users:    <AdminUsers />,
  reviews:  <AdminReviews />,
};

function AdminLayout() {
  const [activeTab, setActiveTab] = useState("overview");//da ely olt 3aleh fo2 fe usestate bas hena el default bt3ha hyb2a overview
  //y3ny bnshof el zorar ely etdas eh we n3ml render lel page bta3o
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();      //function mn useAuth da 3lshan yms7 el token we el user mn localStorage we y3ml reset lel auth state
    navigate("/");  // 3lshan nrooh el home page ba3d el logout
  };
  return (
    //flex box da mwgood fl bootstrap 3lshan el elemnts tb2a ganb b3d
    <div className="d-flex flex-column flex-md-row" style={{ minHeight: "100vh" }}>
      <aside className="admin-sidebar">
        <div className="p-3" style={{ borderBottom: "1px solid var(--border)" }}>
          <p className="serif mb-0" style={{ fontStyle: "italic" }}>Admin Panel</p>
          <small className="text-muted">RR Store</small>
        </div>
        
        {NAV_ITEMS.map((item) => (
          //badl ma 23ml kaza button ast5dmna map we hya htlf we ht3ml render lel buttons 3la 7asab el array ely 3mlnaha fo2
          // <button
          //   className={`sidebar-nav-item ${activeTab === "products" ? "active" : ""}`}
          //   onClick={() => setActiveTab("products")}
          // >
          //   <i className="bi bi-box-seam"></i>
          //   Products
          // </button>

          <button
            key={item.key}
            className={`sidebar-nav-item ${activeTab === item.key ? "active" : ""}`}//lw el tab elly ehna feh da hwa nafs el zorar 5aly el class active 3shan yb2a different style loon mo5tlf
            onClick={() => setActiveTab(item.key)}
          >
            <i className={`bi ${item.icon}`}></i>
            {item.label}
          </button>
        ))}
          <button className="sidebar-nav-item" style={{ marginTop: "auto", borderTop: "1px solid var(--border)", color: "#c0392b" }}  onClick={handleLogout}
        >
          <i className="bi bi-box-arrow-left"></i>
          Logout
        </button>
      </aside>
        
      <main className="admin-content">
        {PAGES[activeTab]}
      </main>
    </div>
  );
}

export default AdminLayout;