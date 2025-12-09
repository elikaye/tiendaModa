// src/context/FavoritosContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const FavoritosContext = createContext();
export const useFavoritos = () => useContext(FavoritosContext);

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

        // Productos del backend ya vienen como objetos
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
    if (!token)
      return toast.info("Iniciá sesión para guardar favoritos ❤️");

    try {
      const res = await axiosAuth.post(
        "/api/v1/favoritos",
        { producto }, // 🔥 ESTO ES LO CORRECTO PARA TU BACKEND
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFavoritos(res.data.productos);
      toast.success("Agregado a favoritos ❤️");
    } catch (err) {
      console.error("❌ Error al agregar:", err);
    }
  };

  // 💔 Eliminar favorito
  const eliminarFavorito = async (productoId) => {
    if (!token) return;

    try {
      const res = await axiosAuth.delete("/api/v1/favoritos", {
        headers: { Authorization: `Bearer ${token}` },
        data: { productoId }, // 🔥 EL BACKEND ESPERA ESTO
      });

      setFavoritos(res.data.productos);
      toast.success("Eliminado de favoritos 💔");
    } catch (err) {
      console.error("❌ Error al eliminar:", err);
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
      toast.success("Favoritos vaciados 🗑");
    } catch (err) {
      console.error("❌ Error al vaciar:", err);
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
