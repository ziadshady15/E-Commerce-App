import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import { useAuth } from "../context/AuthContext";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

function validate(values) {
  const errors = {};
  if (!values.name) {
    errors.name = "Full name is required";
  } else if (values.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }
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
  if (!values.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords must match";
  }
  return errors;
}

function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "", confirmPassword: "" },
    validate,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setStatus(null);
      try {
        const res = await fetch(`${API_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: values.name, email: values.email, password: values.password }),
        });
        const data = await res.json();
        if (!res.ok) {
          setStatus(data.msg || "Registration failed. Please try again.");
          return;
        }
        // Auto-login after registration
        const loginRes = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: values.email, password: values.password }),
        });
        const loginData = await loginRes.json();
        if (loginRes.ok) {
          const payload = JSON.parse(atob(loginData.token.split(".")[1]));
          login(loginData.token, { id: payload.id, role: payload.role, name: values.name, email: values.email });
          navigate("/");
        } else {
          navigate("/login");
        }
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
        <h2 className="serif mb-1" style={{ fontSize: "1.5rem" }}>Create your account</h2>
        <p className="text-muted mb-4" style={{ fontSize: "0.85rem" }}>Join our community of art collectors</p>

        {formik.status && (
          <div className="alert alert-danger py-2" style={{ fontSize: "0.85rem", borderRadius: 0 }}>
            {formik.status}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} noValidate>
          {/* Name */}
          <div className="mb-3">
            <label className="af-label">Full Name</label>
            <input
              type="text"
              name="name"
              className={`af-input ${formik.touched.name && formik.errors.name ? "is-invalid" : ""}`}
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="John Doe"
            />
            {formik.touched.name && formik.errors.name && (
              <p className="af-error">{formik.errors.name}</p>
            )}
          </div>

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
          <div className="mb-3">
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

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="af-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className={`af-input ${formik.touched.confirmPassword && formik.errors.confirmPassword ? "is-invalid" : ""}`}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="••••••••"
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="af-error">{formik.errors.confirmPassword}</p>
            )}
          </div>

          <button type="submit" className="btn-af w-100" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-4" style={{ fontSize: "0.85rem", color: "var(--gray)" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--black)", fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
