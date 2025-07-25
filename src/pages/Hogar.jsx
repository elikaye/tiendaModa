import React, { useEffect, useState } from "react";
import ProductoCard from "../components/ProductoCard";
import { API_BASE_URL } from "../config";

export default function Hogar() {
  const [productosHogar, setProductosHogar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products?categoria=hogar`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setProductosHogar(data.products || []);
        setError(null);
      } catch (error) {
        console.error("Error al cargar productos de hogar:", error);
        setError("No se pudieron cargar los productos de hogar.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-600 py-10">Cargando productos...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600 py-10">{error}</p>;
  }

  return (
    <section className="min-h-screen py-20 px-6 bg-gradient-to-br from-pink-300 via-white to-pink-400 font-body">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-extrabold mb-6 text-pink-600 drop-shadow-sm">
          Hogar
        </h2>

        {productosHogar.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {productosHogar.map((producto) => (
              <ProductoCard key={producto.id || producto._id} producto={producto} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">
            No hay productos disponibles en esta sección por el momento.
          </p>
        )}
      </div>
    </section>
  );
}
