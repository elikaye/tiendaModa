import React from "react";
import { useParams } from "react-router-dom";
import productos from "../data/productos.json";

export default function DetalleProducto() {
  const { id } = useParams();
  const producto = productos.find((p) => p.id.toString() === id);

  if (!producto) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Producto no encontrado.
      </div>
    );
  }

  return (
    <section className="min-h-screen pt-24 pb-12 px-6 bg-gradient-to-br from-pink-100 via-white to-pink-200 font-body">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <img
            src={producto.imageUrl}
            alt={producto.nombre}
            className="w-full h-auto rounded-lg object-contain"
            onError={(e) => (e.target.src = "/placeholder.png")}
          />
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold text-pink-600 mb-2">{producto.nombre}</h2>
              <p className="text-gray-700 mb-4">{producto.descripcion}</p>
              <p className="text-xl text-pink-600 font-bold">${producto.precio.toFixed(2)}</p>
            </div>
            <button className="mt-6 bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-xl transition">
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
