import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); 

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const navLinks = [
    { label: "Gallery",     to: "/gallery" },
    { label: "Collections", to: "/collections" },
    { label: "About",       to: "/about" },
  ];

  return (
    <nav className="af-navbar navbar navbar-expand-md px-4 px-md-5">
      {/* Logo */}
      <Link className="navbar-brand" to="/">ArtFrame</Link>

      {/* Desktop links */}
      <div className="d-none d-md-flex gap-4 ms-4">
        {navLinks.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            {l.label}
          </NavLink>
        ))}
      </div>

      {/* Right icons */}
      <div className="d-flex align-items-center gap-2 ms-auto">
        {/* Cart */}
        <button className="nav-icon-btn" onClick={() => navigate("/cart")}>
          <i className="bi bi-bag"></i>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>

      {/* User dropdown */}
      <div className="dropdown" style={{ position: "relative" }}>
        <button
          className="nav-icon-btn"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <i className="bi bi-person"></i>
        </button>

        {dropdownOpen && (
          <ul
            className="dropdown-menu dropdown-menu-end show"
            style={{ borderRadius: 0, border: "1px solid var(--border)", minWidth: 160, position: "absolute", right: 0, top: "100%", zIndex: 150 }}
            onClick={() => setDropdownOpen(false)}
          >
            {user ? (
              <>
                <li>
                  <button className="dropdown-item" style={{ fontSize: "0.85rem" }} onClick={() => navigate("/profile")}>
                    My Profile
                  </button>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item" style={{ fontSize: "0.85rem" }} onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <button className="dropdown-item" style={{ fontSize: "0.85rem" }} onClick={() => navigate("/login")}>
                    Login
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" style={{ fontSize: "0.85rem" }} onClick={() => navigate("/register")}>
                    Register
                  </button>
                </li>
              </>
            )}
          </ul>
        )}
      </div>

        {/* Mobile hamburger */}
        <button
          className="nav-icon-btn d-md-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <i className={`bi ${menuOpen ? "bi-x" : "bi-list"}`}></i>
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          className="position-fixed top-0 end-0 bottom-0 bg-white p-4"
          style={{ width: 240, zIndex: 200, borderLeft: "1px solid var(--border)", marginTop: 62 }}
        >
          <div className="d-flex flex-column gap-2">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `sidebar-nav-item text-decoration-none${isActive ? " active" : ""}`
                }
                style={{ borderLeft: "3px solid transparent" }}
              >
                {l.label}
              </NavLink>
            ))}
            <hr />
            {user ? (
              <>
                <button className="sidebar-nav-item" onClick={() => { navigate("/profile"); setMenuOpen(false); }}>Profile</button>
                {user.role === "admin" && (
                  <button className="sidebar-nav-item" onClick={() => { navigate("/admin"); setMenuOpen(false); }}>Admin</button>
                )}
                <button className="sidebar-nav-item" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <button className="sidebar-nav-item" onClick={() => { navigate("/login"); setMenuOpen(false); }}>Login</button>
                <button className="sidebar-nav-item" onClick={() => { navigate("/register"); setMenuOpen(false); }}>Register</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
