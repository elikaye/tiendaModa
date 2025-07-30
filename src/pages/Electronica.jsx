import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductoCard from "../components/ProductoCard";
import { API_BASE_URL } from "../config";

export default function Electronica() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true); // Por si vuelve a cargar desde otra ruta
      try {
        const res = await fetch(`${API_BASE_URL}/products?categoria=electronica`);
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        const data = await res.json();
        setProductos(data.products || []);
        setError(null);
      } catch (err) {
        console.error("Error al obtener productos:", err);
        setError("No se pudieron cargar los productos de electrónica.");
        setProductos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [location]);

  return (
    <section className="min-h-screen py-20 px-6 bg-gradient-to-br from-pink-300 via-white to-pink-400 font-body">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-extrabold mb-6 text-pink-600 drop-shadow-sm">
          Electrónica
        </h2>

        {loading ? (
          <p className="text-center text-gray-600 py-10">Cargando productos...</p>
        ) : error ? (
          <p className="text-center text-red-600 py-10">{error}</p>
        ) : productos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {productos.map((producto) => (
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
