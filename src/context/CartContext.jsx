// src/context/cartContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

// Detectar backend según entorno o .env
const API =
  import.meta.env.VITE_BACKEND_URL ||
  (import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://tiendamoda-production-280c.up.railway.app");

export const CartProvider = ({ children, auth }) => {
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const userId = auth?.user?.id ?? localStorage.getItem("userId");
  const token = auth?.token ?? localStorage.getItem("token");

  const headersWithAuth = () => {
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  // Cargar carrito
  useEffect(() => {
    const load = async () => {
      if (!userId) {
        setCarrito([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`${API}/api/v1/carritos/${userId}`, {
          method: "GET",
          headers: headersWithAuth(),
        });
        if (!res.ok) throw new Error("Error al obtener carrito");
        const data = await res.json();
        setCarrito(Array.isArray(data.productos) ? data.productos : []);
      } catch (err) {
        console.error("Carga carrito:", err);
        setCarrito([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId, token]);

  // Agregar al carrito
  const agregarAlCarrito = async (producto, cantidad = 1) => {
    setCarrito((prev) => {
      const found = prev.find((p) => p.id === producto.id);
      if (found) {
        return prev.map((p) =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + cantidad } : p
        );
      }
      return [...prev, { ...producto, cantidad }];
    });

    if (!userId) return;

    try {
      setSyncing(true);
      const res = await fetch(`${API}/api/v1/carritos`, {
        method: "POST",
        headers: headersWithAuth(),
        body: JSON.stringify({ productoId: producto.id, cantidad }),
      });
      if (!res.ok) throw new Error("No se pudo agregar al carrito");
      const data = await res.json();
      setCarrito(Array.isArray(data.productos) ? data.productos : data);
    } catch (err) {
      console.error("agregarAlCarrito:", err);
    } finally {
      setSyncing(false);
    }
  };

  // Eliminar producto
  const eliminarDelCarrito = async (productoId) => {
    const prevSnapshot = carrito;
    setCarrito((prev) => prev.filter((p) => p.id !== productoId));
    if (!userId) return;

    try {
      setSyncing(true);
      const res = await fetch(`${API}/api/v1/carritos/${productoId}`, {
        method: "DELETE",
        headers: headersWithAuth(),
      });
      if (!res.ok) throw new Error("No se pudo eliminar del carrito");
      const data = await res.json();
      setCarrito(Array.isArray(data.productos) ? data.productos : data);
    } catch (err) {
      console.error("eliminarDelCarrito:", err);
      setCarrito(prevSnapshot);
    } finally {
      setSyncing(false);
    }
  };

  // Actualizar cantidad
  const actualizarCantidad = async (productoId, cantidad) => {
    const prevSnapshot = carrito;
    setCarrito((prev) =>
      prev.map((p) => (p.id === productoId ? { ...p, cantidad } : p))
    );
    if (!userId) return;

    try {
      setSyncing(true);
      const res = await fetch(`${API}/api/v1/carritos`, {
        method: "PUT",
        headers: headersWithAuth(),
        body: JSON.stringify({ productoId, cantidad }),
      });
      if (!res.ok) throw new Error("No se pudo actualizar cantidad");
      const data = await res.json();
      setCarrito(Array.isArray(data.productos) ? data.productos : data);
    } catch (err) {
      console.error("actualizarCantidad:", err);
      setCarrito(prevSnapshot);
    } finally {
      setSyncing(false);
    }
  };

  // Vaciar carrito
  const vaciarCarrito = async () => {
    setCarrito([]);
    if (!userId) return;

    try {
      setSyncing(true);
      const res = await fetch(`${API}/api/v1/carritos`, {
        method: "DELETE",
        headers: headersWithAuth(),
      });
      if (!res.ok) throw new Error("No se pudo vaciar carrito");
      setCarrito([]);
    } catch (err) {
      console.error("vaciarCarrito:", err);
    } finally {
      setSyncing(false);
    }
  };

  // Confirmar compra
  const confirmarCompra = async (metodoPago = "manual") => {
    if (!userId) throw new Error("Usuario no autenticado");

    try {
      setSyncing(true);
      const total = carrito.reduce(
        (acc, it) => acc + it.precio * it.cantidad,
        0
      );

      const res = await fetch(`${API}/api/v1/ordenes_final`, {
        method: "POST",
        headers: headersWithAuth(),
        body: JSON.stringify({
          user_id: userId,
          productos: carrito,
          total,
          estado: "pendiente",
          metodoPago,
        }),
      });

      if (!res.ok) throw new Error("Error al crear orden");
      const data = await res.json();
      setCarrito([]);
      return data;
    } catch (err) {
      console.error("confirmarCompra:", err);
      throw err;
    } finally {
      setSyncing(false);
    }
  };

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  return (
    <CartContext.Provider
      value={{
        carrito,
        loading,
        syncing,
        total,
        agregarAlCarrito,
        eliminarDelCarrito,
        vaciarCarrito,
        actualizarCantidad,
        confirmarCompra,
        setCarrito,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
