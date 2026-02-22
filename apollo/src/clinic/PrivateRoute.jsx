// ===========================================
// 📁 PrivateRoute.jsx
// Protects clinic routes using COOKIE auth
// ===========================================

import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const API = `${import.meta.env.VITE_API_URL}/api`;

export default function PrivateRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await fetch(`${API}/clinic/protected`, {
          credentials: "include",
        });

        if (res.ok) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  if (loading) return null;

  return authenticated ? children : <Navigate to="/clinic/login" replace />;
}
