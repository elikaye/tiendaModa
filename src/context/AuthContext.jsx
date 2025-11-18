
// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

axios.defaults.withCredentials = true; // 🔒 asegura envío de cookies o tokens

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // 🔍 Recuperar datos guardados y validar que sean válidos
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    try {
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      const validToken =
        storedToken && storedToken !== "null" && storedToken !== "undefined"
          ? storedToken
          : null;

      if (parsedUser && validToken) {
        setUser(parsedUser);
        setToken(validToken);
      } else {
        // 🧹 Limpieza si los datos son inválidos
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    } catch (err) {
      console.error("❌ Error al leer localStorage:", err);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      setToken(null);
    }
  }, []);

  // ✅ Guarda user y token en localStorage
  const login = (userData, token) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  };

  // 🚪 Limpia sesión completamente
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
