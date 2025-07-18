import React, { useEffect, useState } from "react";
import ProductoCard from "../components/ProductoCard";

export default function Hogar() {
  const [productosHogar, setProductosHogar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
       const response = await fetch("https://tiendamoda-production.up.railway.app/api/v1/products?categoria=hogar");

        const data = await response.json();
        setProductosHogar(data.products || []);
      } catch (error) {
        console.error("Error al cargar productos de hogar:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  return (
    <section className="min-h-screen py-20 px-6 bg-gradient-to-br from-pink-300 via-white to-pink-400 font-body">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-extrabold mb-6 text-pink-600 drop-shadow-sm"></h2>

        {loading ? (
          <p className="text-center text-gray-600">Cargando productos...</p>
        ) : productosHogar.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {productosHogar.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No hay productos disponibles en esta sección por el momento.</p>
        )}
      </div>
    </section>
  );
}
