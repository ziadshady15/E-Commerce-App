import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import { useAuth } from "../context/AuthContext";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

function validate(values) {
  const errors = {};
  if (!values.email) {
    errors.email = "Email is required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = "Enter a valid email address";
  }
  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }
  return errors;
}

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validate,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setStatus(null);
      try {
        const res = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        const data = await res.json();
        if (!res.ok) {
          setStatus(data.msg || "Login failed. Please try again.");
          return;
        }
        const payload = JSON.parse(atob(data.token.split(".")[1]));
        login(data.token, { id: payload.id, role: payload.role, email: values.email });
        navigate(payload.role === "admin" ? "/admin" : "/");
      } catch (err) {
        setStatus("Network error. Please check your connection.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div
      className="d-flex align-items-center justify-content-center p-3"
      style={{ minHeight: "calc(100vh - 62px)", background: "var(--cream)" }}
    >
      <div className="auth-box">
        <p className="auth-logo">ArtFrame</p>
        <h2 className="serif mb-1" style={{ fontSize: "1.5rem" }}>Welcome back</h2>
        <p className="text-muted mb-4" style={{ fontSize: "0.85rem" }}>Sign in to your curator account</p>

        {formik.status && (
          <div className="alert alert-danger py-2" style={{ fontSize: "0.85rem", borderRadius: 0 }}>
            {formik.status}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} noValidate>
          {/* Email */}
          <div className="mb-3">
            <label className="af-label">Email Address</label>
            <input
              type="email"
              name="email"
              className={`af-input ${formik.touched.email && formik.errors.email ? "is-invalid" : ""}`}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="you@example.com"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="af-error">{formik.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="af-label">Password</label>
            <input
              type="password"
              name="password"
              className={`af-input ${formik.touched.password && formik.errors.password ? "is-invalid" : ""}`}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="••••••••"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="af-error">{formik.errors.password}</p>
            )}
          </div>

          <button type="submit" className="btn-af w-100" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-4" style={{ fontSize: "0.85rem", color: "var(--gray)" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "var(--black)", fontWeight: 600 }}>Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
