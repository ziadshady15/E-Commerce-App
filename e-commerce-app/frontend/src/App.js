import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// Context Providers
import { AuthProvider }  from "./context/AuthContext";
import { CartProvider }  from "./context/CartContext";

// Layout
import Navbar       from "./components/Navbar";
import Footer       from "./components/Footer";

// Public Pages
import Home         from "./pages/Home";
import Gallery      from "./pages/Gallery";
import Collections  from "./pages/Collections";
import About        from "./pages/About";
import ProductDetail from "./pages/ProductDetail";
import Login        from "./pages/Login";
import Register     from "./pages/Register";

// Protected Pages (must be logged in)
import Cart         from "./pages/Cart";
import Checkout     from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Profile      from "./pages/Profile";
import Contact from "./pages/contact";
import Privacy from "./pages/privacy";
import Terms   from "./pages/terms";
// Admin Pages (must be logged in AND role === "admin")
import AdminLayout  from "./pages/AdminLayout";

// Route Guards
import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoute";

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar />}

      <Routes>
        {/* ── Public Routes ─────────────────────────── */}
        <Route path="/"            element={<Home />} />
        <Route path="/gallery"     element={<Gallery />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/about"       element={<About />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/login"       element={<Login />} />
        <Route path="/register"    element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms"   element={<Terms />} />
        {/* ── Protected Routes (login required) ─────── */}
        <Route element={<ProtectedRoute />}>
          <Route path="/cart"          element={<Cart />} />
          <Route path="/checkout"      element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/profile"       element={<Profile />} />
        </Route>

        {/* ── Admin Routes (admin role required) ─────── */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />} />
        </Route>

        {/* ── 404 Fallback ───────────────────────────── */}
        <Route path="*" element={
          <div className="container text-center py-5">
            <h2 className="serif mb-2">404 — Page Not Found</h2>
            <p className="text-muted mb-4">The page you're looking for doesn't exist.</p>
            <a href="/" className="btn-af">Go Home</a>
          </div>
        } />
      </Routes>

      {!isAdmin && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;