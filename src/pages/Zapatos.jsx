import React, { useEffect, useState } from "react";
import ProductoCard from "../components/ProductoCard";

export default function Zapatos() {
  const [productosZapatos, setProductosZapatos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch("https://tiendamoda-production.up.railway.app/api/v1/products?categoria=zapatos");
        const data = await response.json();
        setProductosZapatos(data.products || []);
      } catch (error) {
        console.error("Error al cargar productos de zapatos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  return (
    <section className="min-h-screen py-20 px-6 bg-gradient-to-br from-pink-200 via-white to-pink-300 font-body">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-extrabold mb-6 text-pink-600 drop-shadow-sm"></h2>

        {loading ? (
          <p className="text-center text-gray-600">Cargando productos...</p>
        ) : productosZapatos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {productosZapatos.map((producto) => (
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
