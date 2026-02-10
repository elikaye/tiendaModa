// src/context/FavoritosContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const FavoritosContext = createContext();
export const useFavoritos = () => useContext(FavoritosContext);

// 🔥 Toasters rápidos + anti-duplicados
const fastToast = {
  added: (msg = "Agregado a favoritos ❤️") => {
    if (toast.isActive("fav-add")) return;
    toast.success(msg, {
      toastId: "fav-add",
      autoClose: 900,
      hideProgressBar: true,
      pauseOnHover: false,
      closeOnClick: true,
      draggable: false,
    });
  },
  removed: (msg = "Eliminado de favoritos 💔") => {
    if (toast.isActive("fav-remove")) return;
    toast.info(msg, {
      toastId: "fav-remove",
      autoClose: 900,
      hideProgressBar: true,
      pauseOnHover: false,
      closeOnClick: true,
      draggable: false,
    });
  },
  login: () => {
    if (toast.isActive("login-required")) return;
    toast.info("Iniciá sesión para guardar favoritos ❤️", {
      toastId: "login-required",
      autoClose: 1000,
      hideProgressBar: true,
      pauseOnHover: false,
    });
  },
};

export const FavoritosProvider = ({ children }) => {
  const { token } = useAuth();
  const [favoritos, setFavoritos] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const axiosAuth = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
  });

  // 🔹 Cargar favoritos al iniciar sesión
  useEffect(() => {
    const fetchFavs = async () => {
      if (!token) {
        setFavoritos([]);
        return;
      }

      try {
        const res = await axiosAuth.get("/api/v1/favoritos", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const productos = Array.isArray(res.data.productos)
          ? res.data.productos
          : [];

        setFavoritos(productos);
      } catch (err) {
        console.error("❌ Error cargando favoritos:", err);
      }
    };

    fetchFavs();
  }, [token]);

  // ❤️ Agregar favorito
  const agregarFavorito = async (producto) => {
    if (!token) return fastToast.login();
    if (favoritos.find((p) => p.id === producto.id)) return;

    try {
      const res = await axiosAuth.post(
        "/api/v1/favoritos",
        { producto },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFavoritos(res.data.productos);
      fastToast.added();
    } catch (err) {
      console.error("❌ Error al agregar favorito:", err);
    }
  };

  // 💔 Eliminar favorito
  const eliminarFavorito = async (productoId) => {
    if (!token) return;

    try {
      const res = await axiosAuth.delete("/api/v1/favoritos", {
        headers: { Authorization: `Bearer ${token}` },
        data: { productoId },
      });

      setFavoritos(res.data.productos);
      fastToast.removed();
    } catch (err) {
      console.error("❌ Error al eliminar favorito:", err);
    }
  };

  // 🗑 Vaciar favoritos
  const clearFavoritos = async () => {
    if (!token) return;

    try {
      await axiosAuth.delete("/api/v1/favoritos/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFavoritos([]);
      fastToast.removed("Favoritos vaciados 🗑");
    } catch (err) {
      console.error("❌ Error al vaciar favoritos:", err);
    }
  };

  return (
    <FavoritosContext.Provider
      value={{
        favoritos,
        agregarFavorito,
        eliminarFavorito,
        clearFavoritos,
      }}
    >
      {children}
    </FavoritosContext.Provider>
  );
};
