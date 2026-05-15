import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";//routes feha kol el routes ely 3andna we use location da bygeb el url ely ehna feh 
import { AuthProvider }  from "./context/AuthContext";
import { CartProvider }  from "./context/CartContext";
import Navbar       from "./components/Navbar";
import Footer       from "./components/Footer";
import Home         from "./pages/Home";
import Gallery      from "./pages/Gallery";
import Collections  from "./pages/Collections";
import About        from "./pages/About";
import ProductDetail from "./pages/ProductDetail";
import Login        from "./pages/Login";
import Register     from "./pages/Register";
import Cart         from "./pages/Cart";
import Checkout     from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Profile      from "./pages/Profile";
import Contact from "./pages/contact";
import Privacy from "./pages/privacy";
import Terms   from "./pages/terms";
import AdminLayout  from "./pages/AdminLayout";
import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoute";

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar />} {/*lw hwa msh admin 23rd el navbar*/}

      <Routes>
        {/*  Public Routes ay had momken yshofha msh lazm yb2a logged in  */}
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
        {/*  Protected Routes lazm tb2a 3aml login */}
        <Route element={<ProtectedRoute />}>
          <Route path="/cart"          element={<Cart />} />
          <Route path="/checkout"      element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/profile"       element={<Profile />} />
        </Route>

        {/*hagat el admin*/}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />} />
        </Route>

        {/* errors */}
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
//component tree 
function App() {
  return (
    //by5ly el app 3ando routing be react bas msh y3ml refresh lel page kol ma y3ml navigation y3ml route bona2n 3ala el url we y3ml render lel component ely mwgood feh
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