// src/components/DetalleProducto.jsx
import React from "react";

const DetalleProducto = ({ producto, onAgregarAlCarrito }) => {
  if (!producto) {
    return (
      <div className="text-center py-10 text-gray-600">
        Cargando producto...
      </div>
    );
  }

  // Usar la URL de Cloudinary directamente si existe
  const imageUrl = producto.imageUrl || "/placeholder.png";

  return (
    <div className="min-h-screen py-8 px-4 md:px-20 bg-white text-black">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold mb-6 text-center">
          {producto.nombre}
        </h2>

        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-shrink-0">
            <img
              src={imageUrl}
              alt={producto.nombre}
              className="w-80 h-80 object-cover rounded-lg shadow-md"
              onError={(e) => {
                e.currentTarget.onerror = null; // Evita loop infinito si falla el placeholder
                e.currentTarget.src = "/placeholder.png";
              }}
            />
          </div>

          <div className="flex flex-col justify-between h-full gap-6">
            <p className="text-lg">{producto.descripcion}</p>

            <p className="text-xl font-bold text-pink-600">
              ${parseFloat(producto.precio).toFixed(2)}
            </p>

            <button
              onClick={() => onAgregarAlCarrito(producto)}
              className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition"
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleProducto;
