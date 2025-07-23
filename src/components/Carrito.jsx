import React, { useEffect } from "react";
import { useCart } from "../context/CartContext";
import { FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import placeholderImg from "../assets/placeholder.png"; // importa un placeholder local si tienes

const Carrito = () => {
  const { carrito, vaciarCarrito, eliminarDelCarrito } = useCart();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const total = carrito.reduce((acc, item) => acc + item.precio, 0);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-gradient-to-br from-pink-100 via-white to-pink-200">
      <h1 className="text-3xl font-bold text-center text-black mb-8">Tu Carrito</h1>

      {carrito.length === 0 ? (
        <div className="text-center text-gray-600">
          <p>No hay productos en el carrito.</p>
          <Link
            to="/"
            className="mt-4 inline-block bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-black transition duration-300"
          >
            Seguir comprando
          </Link>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 space-y-4">
          {carrito.map((producto) => (
            <div
              key={producto.id} // mejor usar id en vez de index
              className="flex items-center justify-between border-b pb-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={producto.imageUrl || placeholderImg}
                  alt={producto.nombre}
                  className="w-20 h-20 object-contain rounded"
                />
                <div>
                  <h2 className="font-semibold text-lg">{producto.nombre}</h2>
                  <p className="text-pink-600 font-bold">${producto.precio?.toFixed(2)}</p>
                </div>
              </div>
              <button
                onClick={() => eliminarDelCarrito(producto.id)} // vacía solo este producto
                className="text-pink-500 hover:text-black transition"
                title="Eliminar producto"
              >
                <FaTrashAlt />
              </button>
            </div>
          ))}

          <div className="text-right font-semibold text-xl text-black">
            Total: ${total.toFixed(2)}
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={vaciarCarrito}
              className="bg-black text-white px-5 py-2 rounded-full hover:bg-pink-500 transition duration-300"
            >
              Vaciar Carrito
            </button>

            <button
              onClick={() => alert("Compra confirmada! Gracias por tu compra.")}
              className="bg-pink-600 text-white px-5 py-2 rounded-full hover:bg-black transition duration-300"
            >
              Confirmar Compra
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carrito;
