// src/components/Favoritos.jsx
import React, { useEffect } from "react";
import { useCart } from "../context/CartContext";
import ProductoCard from "./ProductoCard";

const COLUMNAS_MOBILE = 4;

const chunkArray = (arr, chunkSize) => {
  const result = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize));
  }
  return result;
};

const Favoritos = () => {
  const { favoritos, loading } = useCart();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (loading) return <p className="p-4">Cargando favoritos...</p>;
  if (!favoritos.length) return <p className="p-4">No tenés productos favoritos aún.</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Mis Favoritos ❤️</h2>

      {/* 📱 MOBILE — scroll horizontal por filas */}
      <div className="sm:hidden space-y-4">
        {chunkArray(favoritos, COLUMNAS_MOBILE).map((fila, index) => (
          <div
            key={index}
            className="flex space-x-4 overflow-x-auto pb-2"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {fila.map((producto) => (
              <div
                key={producto.id}
                className="flex-shrink-0 w-64"
                style={{ scrollSnapAlign: "start" }}
              >
                <ProductoCard producto={producto} />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* 🖥 DESKTOP — grid normal */}
      <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favoritos.map((producto) => (
          <ProductoCard key={producto.id} producto={producto} />
        ))}
      </div>
    </div>
  );
};

export default Favoritos;
