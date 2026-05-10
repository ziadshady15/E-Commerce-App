import { createContext, useState, useContext, useEffect } from "react";

// 1. Create the context object
const AuthContext = createContext();

// 2. Provider component — wraps the whole app and holds auth state
function AuthProvider({ children }) {
  // Try to rehydrate from localStorage so the user stays logged in on refresh
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser]   = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Whenever token changes, keep localStorage in sync
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, [token]);

  // Called after a successful login or register
  // token  — JWT string from the backend
  // userData — { id, role, name?, email? }  (decoded from the JWT or returned by the API)
  const login = (token, userData) => {
    setToken(token);
    setUser(userData);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Called on logout — wipes everything
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Expose token, user object, login fn, logout fn to every child component
  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Custom hook — any component can call useAuth() instead of useContext(AuthContext)
function useAuth() {
  return useContext(AuthContext);
}

export { AuthProvider, useAuth };
