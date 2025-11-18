// src/components/DetalleProducto.jsx
import React, { useEffect, useState } from "react";
import { FaHeart, FaShoppingBag } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useFavoritos } from "../context/FavoritosContext";
import { toast } from "react-toastify";

const DetalleProducto = ({ producto }) => {
  const { agregarAlCarrito } = useCart();
  const { favoritos, agregarFavorito, eliminarFavorito } = useFavoritos();
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (producto) {
      const esFavorito = favoritos.some((f) => f.favoritoProducto?.id === producto.id);
      setLiked(esFavorito);
    }
  }, [producto, favoritos]);

  if (!producto) {
    return (
      <div className="text-center py-10 text-gray-600">
        Cargando producto...
      </div>
    );
  }

  const toggleLike = () => {
    if (liked) {
      const fav = favoritos.find((f) => f.favoritoProducto?.id === producto.id);
      eliminarFavorito(fav.id);
      setLiked(false);
    } else {
      agregarFavorito(producto);
      setLiked(true);
    }
  };

  const handleComprar = async () => {
    try {
      await agregarAlCarrito(producto, 1);
      toast.success(`${producto.nombre} agregado al carrito!`, { autoClose: 2000 });
    } catch (err) {
      console.error(err);
      toast.error("No se pudo agregar el producto al carrito");
    }
  };

  const imageUrl = producto.imageUrl || "/placeholder.png";

  return (
    <div className="min-h-screen py-8 px-4 md:px-20 bg-white text-black">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg relative">
        {/* Corazón favorito */}
        <button
          onClick={toggleLike}
          className={`absolute top-4 right-4 text-3xl transition-colors duration-300 ${
            liked ? "text-pink-600" : "text-gray-400 hover:text-pink-600"
          }`}
        >
          <FaHeart />
        </button>

        <h2 className="text-3xl font-semibold mb-6 text-center">
          {producto.nombre}
        </h2>

        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-shrink-0">
            <img
              src={imageUrl}
              alt={producto.nombre}
              className="w-80 h-80 object-cover rounded-lg shadow-md"
              onError={(e) => { e.currentTarget.src = "/placeholder.png"; }}
            />
          </div>

          <div className="flex flex-col justify-between h-full gap-6">
            <p className="text-lg">{producto.descripcion}</p>

            <p className="text-xl font-bold text-pink-600">
              ${parseFloat(producto.precio).toFixed(2)}
            </p>

            <button
              onClick={handleComprar}
              className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition flex items-center gap-2"
            >
              <FaShoppingBag /> Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleProducto;
