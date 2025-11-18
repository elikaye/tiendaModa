
// src/pages/Carrito.jsx
import React, { useEffect } from "react";
import { useCart } from "../context/CartContext";
import { FaTrashAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import placeholderImg from "../assets/carrito-de-compras.png";

const Carrito = () => {
  const {
    carrito,
    vaciarCarrito,
    eliminarDelCarrito,
    actualizarCantidad,
    total,
    confirmarCompra,
    loading,
    syncing
  } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleConfirm = async () => {
    try {
      const orden = await confirmarCompra();
      navigate(`/ordenes/${orden.id}`);
    } catch (err) {
      alert("No se pudo procesar la compra. Intentá de nuevo.");
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-gradient-to-br from-pink-100 via-white to-pink-200">
      <h1 className="text-3xl font-bold text-center text-black mb-8">Tu Carrito</h1>

      {loading ? (
        <div className="text-center">Cargando carrito...</div>
      ) : carrito.length === 0 ? (
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
          {carrito.map((producto) => {
            const { id, nombre, precio, cantidad, imageUrl, image } = producto;
            const cantidadNum = Number(cantidad || 1);
            const precioNum = Number(precio || 0);
            const subtotal = cantidadNum * precioNum;

            return (
              <div key={id} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={imageUrl || image || placeholderImg}
                    alt={nombre}
                    className="w-20 h-20 object-contain rounded"
                    onError={(e) => { e.currentTarget.src = placeholderImg; }}
                  />
                  <div>
                    <h2 className="font-semibold text-lg">{nombre}</h2>
                    <p className="text-sm text-gray-500">
                      Precio unitario: {new Intl.NumberFormat("es-AR").format(precioNum)} $
                    </p>
                    <p className="text-pink-600 font-bold">
                      Subtotal: {new Intl.NumberFormat("es-AR").format(subtotal)} $
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    value={cantidadNum}
                    onChange={(e) => {
                      const val = Math.max(1, Number(e.target.value || 1));
                      actualizarCantidad(id, val);
                    }}
                    className="w-16 p-1 border rounded"
                    title="Cantidad"
                  />
                  <button
                    onClick={() => eliminarDelCarrito(id)}
                    className="text-pink-500 hover:text-black transition"
                    title="Eliminar producto"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="text-right font-semibold text-xl text-black">
            Total: {new Intl.NumberFormat("es-AR").format(total)} $
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={vaciarCarrito}
              className="bg-black text-white px-5 py-2 rounded-full hover:bg-pink-500 transition duration-300"
              disabled={syncing}
            >
              Vaciar Carrito
            </button>

            <div className="flex gap-3">
              <button
                onClick={handleConfirm}
                className="bg-pink-600 text-white px-5 py-2 rounded-full hover:bg-black transition duration-300"
                disabled={syncing}
              >
                {syncing ? "Procesando..." : "Confirmar Compra"}
              </button>
              <Link to="/" className="px-4 py-2 rounded-full border">
                Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carrito;
