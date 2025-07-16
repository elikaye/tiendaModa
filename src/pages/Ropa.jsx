import React, { useEffect, useState } from "react";
import ProductoCard from "../components/ProductoCard";

export default function Ropa() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/v1/products?categoria=ropa")
      .then((res) => res.json())
      .then((data) => {
        setProductos(data.products || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar productos de ropa:", err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="min-h-screen py-20 px-6 bg-gradient-to-br from-pink-200 via-white to-pink-200 font-body">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-extrabold mb-6 text-pink-600 drop-shadow-sm"></h2>

        {loading ? (
          <p className="text-center text-gray-600">Cargando productos...</p>
        ) : productos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {productos.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No hay productos disponibles en esta sección.</p>
        )}
      </div>
    </section>
  );
}
