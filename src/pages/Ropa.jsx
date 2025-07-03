import React from "react";
import productos from "../data/productos.json";
import ProductoCard from "../components/ProductoCard";

export default function Ropa() {
  // Simulamos que hay productos con estas subcategorías
  const mujer = productos.filter(p => p.categoria === "ropa" && p.subcategoria === "mujer");
  const hombre = productos.filter(p => p.categoria === "ropa" && p.subcategoria === "hombre");
  const niños = productos.filter(p => p.categoria === "ropa" && p.subcategoria === "niños");

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-white to-pink-200 bg-[length:300%_300%] animate-gradient py-20 px-6">
      <div className="max-w-7xl mx-auto font-body">

        {/* Mujer */}
        <h2 className="text-2xl font-extrabold text-pink-600 mb-6">Ropa de Mujer</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          {mujer.map(producto => (
            <ProductoCard key={producto.id} producto={producto} />
          ))}
        </div>

        {/* Hombre */}
        <h2 className="text-2xl font-extrabold text-pink-600 mb-6">Ropa de Hombre</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          {hombre.map(producto => (
            <ProductoCard key={producto.id} producto={producto} />
          ))}
        </div>

        {/* Niños */}
        <h2 className="text-2xl font-extrabold text-pink-600 mb-6">Ropa Infantil</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {niños.map(producto => (
            <ProductoCard key={producto.id} producto={producto} />
          ))}
        </div>
      </div>
    </div>
  );
}
