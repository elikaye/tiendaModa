// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
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
        logout(); // limpia todo si es inválido
      }
    } catch (err) {
      console.error("Error leyendo localStorage:", err);
      logout();
    }
  }, []);

  // LOGIN → guarda user + token
  const login = (userData, receivedToken) => {
    setUser(userData);
    setToken(receivedToken);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", receivedToken);
  };

  // LOGOUT → limpia todo
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
