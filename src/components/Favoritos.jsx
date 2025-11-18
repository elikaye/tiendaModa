
// src/components/Favoritos.jsx
import React, { useEffect } from "react";
import { useFavoritos } from "../context/FavoritosContext";
import ProductoCard from "./ProductoCard";

const Favoritos = () => {
  const { favoritos, loading } = useFavoritos();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (loading) return <p className="p-4">Cargando favoritos...</p>;
  if (!favoritos.length)
    return <p className="p-4">No tienes productos favoritos aún.</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Mis Favoritos ❤️</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favoritos.map((producto) => (
          <ProductoCard key={producto.id} producto={producto} />
        ))}
      </div>
    </div>
  );
};

export default Favoritos;
