import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function DetalleProducto() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchProducto = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/products/${id}`);
      const data = await response.json();
      setProducto(data);

      // ✅ Centrar la vista en el producto al cargar
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

    } catch (error) {
      console.error("Error al cargar el producto:", error);
      setProducto(null);
    } finally {
      setLoading(false);
    }
  };


    fetchProducto();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 font-body">
        Cargando producto...
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 font-body">
        Producto no encontrado.
      </div>
    );
  }

  return (
    <section className="min-h-screen pt-28 pb-16 px-4 bg-gradient-to-br from-pink-200 via-white to-pink-300 font-body">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <img
            src={producto.imageUrl}
            alt={producto.nombre}
            className="w-full max-h-[450px] object-contain rounded-lg shadow-md"
            onError={(e) => (e.target.src = "/placeholder.png")}
          />

          <div>
            <h2 className="text-3xl font-title font-bold text-pink-600 mb-4">
              {producto.nombre}
            </h2>
            <p className="text-gray-700 text-base mb-6">
              {producto.descripcion || "Sin descripción disponible."}
            </p>
            <p className="text-2xl text-pink-600 font-extrabold mb-6">
              ${producto.precio?.toFixed(2) || "0.00"}
            </p>

            <button className="w-full md:w-auto bg-pink-600 hover:bg-pink-700 text-white py-3 px-6 rounded-xl text-lg transition-all duration-300 shadow-lg">
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
