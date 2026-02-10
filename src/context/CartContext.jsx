
// src/context/CartContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// 🔹 Normaliza productos para evitar duplicados
const normalizarProductos = (productos = []) => {
  const map = new Map();
  productos.forEach((p) => {
    const id = p.id;
    const cantidad = Number(p.cantidad || 1);
    if (map.has(id)) {
      map.get(id).cantidad += cantidad;
    } else {
      map.set(id, { ...p, cantidad });
    }
  });
  return Array.from(map.values());
};

export const CartProvider = ({ children }) => {
  const { user, token } = useAuth();

  const [carrito, setCarrito] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncingIds, setSyncingIds] = useState([]);

  const headersWithAuth = () => ({
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  });

  // 🔹 Cargar carrito y favoritos desde API + localStorage
  useEffect(() => {
    if (!user || !token) {
      setCarrito([]);
      setFavoritos([]);
      return;
    }

    const localCarrito = localStorage.getItem("carrito");
    const localFavoritos = localStorage.getItem("favoritos");
    if (localCarrito) setCarrito(JSON.parse(localCarrito));
    if (localFavoritos) setFavoritos(JSON.parse(localFavoritos));

    const loadData = async () => {
      setLoading(true);
      try {
        const [resCarrito, resFav] = await Promise.all([
          fetch(`${API}/api/v1/carrito`, { headers: headersWithAuth() }),
          fetch(`${API}/api/v1/favoritos`, { headers: headersWithAuth() }),
        ]);

        const dataCarrito = await resCarrito.json();
        const dataFav = await resFav.json();

        setCarrito(normalizarProductos(dataCarrito.productos));
        setFavoritos(dataFav.productos || []);
      } catch (err) {
        console.error("Error cargando carrito/favoritos:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, token]);

  // 🔹 Guardar en localStorage cada vez que cambian
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  useEffect(() => {
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
  }, [favoritos]);

  // 🔹 Carrito
  const agregarAlCarrito = async (producto, cantidad = 1) => {
    if (!token) return;
    setCarrito((prev) => normalizarProductos([...prev, { ...producto, cantidad }]));
    setSyncingIds((prev) => [...prev, producto.id]);

    try {
      const res = await fetch(`${API}/api/v1/carrito/add`, {
        method: "POST",
        headers: headersWithAuth(),
        body: JSON.stringify({ producto: { ...producto, cantidad } }),
      });
      const data = await res.json();
      setCarrito(normalizarProductos(data.productos));
    } catch (err) {
      console.error("Error agregando al carrito:", err);
    } finally {
      setSyncingIds((prev) => prev.filter((id) => id !== producto.id));
    }
  };

  const actualizarCantidad = async (productoId, cantidad) => {
    if (!token) return;
    const cantidadNum = Number(cantidad);
    if (!Number.isInteger(cantidadNum) || cantidadNum < 1) return;

    setCarrito((prev) =>
      prev.map((p) => (p.id === productoId ? { ...p, cantidad: cantidadNum } : p))
    );
    setSyncingIds((prev) => [...prev, productoId]);

    try {
      const res = await fetch(`${API}/api/v1/carrito/add`, {
        method: "POST",
        headers: headersWithAuth(),
        body: JSON.stringify({ producto: { id: productoId, cantidad: cantidadNum } }),
      });
      const data = await res.json();
      setCarrito(normalizarProductos(data.productos));
    } catch (err) {
      console.error("Error actualizando cantidad:", err);
    } finally {
      setSyncingIds((prev) => prev.filter((id) => id !== productoId));
    }
  };

  const eliminarDelCarrito = async (productoId) => {
    if (!token) return;
    setCarrito((prev) => prev.filter((p) => p.id !== productoId));
    setSyncingIds((prev) => [...prev, productoId]);

    try {
      const res = await fetch(`${API}/api/v1/carrito/remove`, {
        method: "PUT",
        headers: headersWithAuth(),
        body: JSON.stringify({ productoId }),
      });
      const data = await res.json();
      setCarrito(normalizarProductos(data.productos));
    } catch (err) {
      console.error("Error eliminando producto:", err);
    } finally {
      setSyncingIds((prev) => prev.filter((id) => id !== productoId));
    }
  };

  const vaciarCarrito = async () => {
    if (!token) return;
    const allIds = carrito.map((p) => p.id);
    setSyncingIds(allIds);
    setCarrito([]);

    try {
      await fetch(`${API}/api/v1/carrito/clear`, {
        method: "PUT",
        headers: headersWithAuth(),
      });
    } catch (err) {
      console.error("Error vaciando carrito:", err);
    } finally {
      setSyncingIds([]);
    }
  };

  const total = useMemo(
    () => carrito.reduce((acc, item) => acc + Number(item.precio || 0) * Number(item.cantidad || 1), 0),
    [carrito]
  );

  // 🔹 Favoritos
  const agregarAFavoritos = async (producto) => {
    if (!token) return;
    if (favoritos.find((p) => p.id === producto.id)) return;

    setFavoritos((prev) => [...prev, producto]);

    try {
      const res = await fetch(`${API}/api/v1/favoritos/add`, {
        method: "POST",
        headers: headersWithAuth(),
        body: JSON.stringify({ producto }),
      });
      const data = await res.json();
      setFavoritos(data.productos || []);
    } catch (err) {
      console.error("Error agregando favorito:", err);
    }
  };

  const eliminarDeFavoritos = async (productoId) => {
    if (!token) return;
    setFavoritos((prev) => prev.filter((p) => p.id !== productoId));

    try {
      const res = await fetch(`${API}/api/v1/favoritos/remove`, {
        method: "PUT",
        headers: headersWithAuth(),
        body: JSON.stringify({ productoId }),
      });
      const data = await res.json();
      setFavoritos(data.productos || []);
    } catch (err) {
      console.error("Error eliminando favorito:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        carrito,
        favoritos,
        loading,
        syncingIds,
        total,
        agregarAlCarrito,
        actualizarCantidad,
        eliminarDelCarrito,
        vaciarCarrito,
        agregarAFavoritos,
        eliminarDeFavoritos,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
