import React, { useEffect, useState } from "react";
import ProductoCard from "../components/ProductoCard";
import { API_BASE_URL } from "../config";

export default function Zapatos() {
  const [productosZapatos, setProductosZapatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products?categoria=zapatos`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setProductosZapatos(data.products || []);
        setError(null);
      } catch (error) {
        console.error("Error al cargar productos de zapatos:", error);
        setError("No se pudieron cargar los productos de zapatos.");
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
    <section className="min-h-screen py-20 px-6 bg-gradient-to-br from-pink-200 via-white to-pink-300 font-body">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-extrabold mb-6 text-pink-600 drop-shadow-sm">
          Zapatos
        </h2>

        {productosZapatos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {productosZapatos.map((producto) => (
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
