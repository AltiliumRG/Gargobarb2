import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ============================================================
     CHECK SESSION AL CARGAR APP
  ============================================================ */
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await api.get("/auth/private", {
          withCredentials: true,
        });

        setUser(res.data.user);
        console.log("🟢 SESIÓN ACTIVA:", res.data.user);
      } catch (err) {
        console.log("🔴 NO SESSION");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  /* ============================================================
     LOGIN
  ============================================================ */
  const login = (userData) => {
    setUser(userData);
  };

  /* ============================================================
     LOGOUT
  ============================================================ */
  const logout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
    } catch {}
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
