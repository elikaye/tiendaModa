import React from "react";
import productos from "../data/productos.json";
import ProductoCard from "../components/ProductoCard";

export default function Hogar() {
  const productosHogar = productos.filter((p) => p.categoria === "hogar");

  return (
    <section className="min-h-screen py-12 px-6 bg-gradient-to-br from-pink-200 via-white to-pink-300 font-body">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-extrabold mb-6 text-pink-600 drop-shadow-sm">Hogar</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {productosHogar.length > 0 ? (
            productosHogar.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} />
            ))
          ) : (
            <p className="text-gray-600">No hay productos disponibles en esta sección por el momento.</p>
          )}
        </div>
      </div>
    </section>
  );
}
