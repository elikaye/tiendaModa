import React, { useEffect, useState } from "react";
import ProductoCard from "../components/ProductoCard"; // Ajusta la ruta según dónde tengas ProductoCard

export default function Electronica() {
  const [productosElectronica, setProductosElectronica] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        // Aquí llamamos al backend con filtro por categoría
        const response = await fetch("http://localhost:5000/api/v1/products?categoria=electronica");
        const data = await response.json();

        // data.products viene filtrado desde el backend
        setProductosElectronica(data.products || []);
      } catch (error) {
        console.error("Error al cargar productos de electrónica:", error);
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
        ) : productosElectronica.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {productosElectronica.map((producto) => (
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
