// src/context/FavoritosContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const FavoritosContext = createContext();
export const useFavoritos = () => useContext(FavoritosContext);

export const FavoritosProvider = ({ children }) => {
  const { user, token } = useAuth();

  // 🟣 Estados
  const [favoritos, setFavoritos] = useState(() => {
    const saved = localStorage.getItem("favoritos");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const axiosInstanceRef = useRef(null);

  if (!axiosInstanceRef.current) {
    axiosInstanceRef.current = axios.create({
      baseURL: API_URL,
      headers: { "Content-Type": "application/json" },
    });
  }

  /* ----------------------------------------------
     🟣 Guardar favoritos en LocalStorage
  ---------------------------------------------- */
  useEffect(() => {
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
  }, [favoritos]);

  /* ----------------------------------------------
     🟣 Cargar favoritos desde backend solo 1 vez
  ---------------------------------------------- */
  useEffect(() => {
    const fetchFavoritos = async () => {
      if (!user || !token) {
        setFavoritos([]);
        localStorage.removeItem("favoritos");
        return;
      }

      setLoading(true);
      try {
        const res = await axiosInstanceRef.current.get("/api/v1/favoritos", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const productos = Array.isArray(res.data?.productos)
          ? res.data.productos
          : [];

        // Sincroniza todo correctamente
        setFavoritos(productos);
        localStorage.setItem("favoritos", JSON.stringify(productos));
      } catch (err) {
        console.error("❌ Error al cargar favoritos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoritos();
  }, [user, token]);

  /* ----------------------------------------------
     🟣 Agregar Favorito
  ---------------------------------------------- */
  const agregarFavorito = useCallback(
    async (producto) => {
      if (!user || !token) {
        toast.info("💖 Iniciá sesión para guardar favoritos");
        return;
      }

      if (syncing) return;
      setSyncing(true);

      // Evitar duplicados
      if (favoritos.some((p) => p.id === producto.id)) {
        toast.info("Ese producto ya está en tus favoritos");
        setSyncing(false);
        return;
      }

      const nuevos = [...favoritos, producto];
      setFavoritos(nuevos);

      try {
        await axiosInstanceRef.current.post(
          "/api/v1/favoritos",
          { producto },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        toast.success(`${producto.nombre} agregado ❤️`);
      } catch (err) {
        console.error("❌ Error al agregar favorito:", err);
        toast.error("No se pudo agregar");
        setFavoritos(favoritos); // Revertir
      } finally {
        setSyncing(false);
      }
    },
    [favoritos, user, token, syncing]
  );

  /* ----------------------------------------------
     🟣 Eliminar Favorito
  ---------------------------------------------- */
  const eliminarFavorito = useCallback(
    async (productoId) => {
      if (!user || !token) return;

      const nuevos = favoritos.filter((p) => p.id !== productoId);
      setFavoritos(nuevos);

      try {
        await axiosInstanceRef.current.delete("/api/v1/favoritos", {
          headers: { Authorization: `Bearer ${token}` },
          data: { productoId },
        });

        toast.success("Producto eliminado");
      } catch (err) {
        console.error("❌ Error al eliminar favorito:", err);
        toast.error("No se pudo eliminar");
        setFavoritos(favoritos); // revertir
      }
    },
    [favoritos, user, token]
  );

  /* ----------------------------------------------
     🟣 Vaciar Favoritos
  ---------------------------------------------- */
  const clearFavoritos = useCallback(async () => {
    if (!user || !token) return;

    const prev = [...favoritos];
    setFavoritos([]);

    try {
      await axiosInstanceRef.current.delete("/api/v1/favoritos/clear", {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Favoritos vaciados");
    } catch (err) {
      console.error("❌ Error al limpiar favoritos:", err);
      toast.error("No se pudo vaciar");
      setFavoritos(prev); // revertir
    }
  }, [favoritos, user, token]);

  return (
    <FavoritosContext.Provider
      value={{
        favoritos,
        loading,
        syncing,
        agregarFavorito,
        eliminarFavorito,
        clearFavoritos,
        setFavoritos,
      }}
    >
      {children}
    </FavoritosContext.Provider>
  );
};
