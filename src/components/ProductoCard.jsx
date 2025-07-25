import React, { useState } from "react";
import { FaHeart, FaShoppingBag } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const ProductoCard = ({ producto }) => {
  const [liked, setLiked] = useState(false);
  const { agregarAlCarrito } = useCart();
  const navigate = useNavigate();

  if (!producto) return null;

  const toggleLike = (e) => {
    e.preventDefault();
    setLiked(!liked);
  };

  const handleComprar = (e) => {
    e.preventDefault();
    agregarAlCarrito(producto);
    navigate("/carrito");
  };

  const baseUrlBackend = API_BASE_URL.split("/api/v1")[0];

  const imagePath = producto.imageUrl
    ? producto.imageUrl.startsWith("/")
      ? producto.imageUrl.substring(1)
      : producto.imageUrl
    : "";

  // Aseguramos que la URL incluya el segmento /product para apuntar bien al backend
  const imgSrc = producto.imageUrl
    ? `${baseUrlBackend}/product/${imagePath}`
    : "/placeholder.png";

  const precioFormateado = !isNaN(Number(producto.precio)) ? Number(producto.precio).toFixed(2) : "0.00";

  return (
    <Link
      to={`/producto/${producto.id || producto._id}`}
      className="relative text-black bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer p-4 flex flex-col justify-between h-full"
    >
      <button
        onClick={toggleLike}
        aria-label="Agregar a favoritos"
        className={`absolute top-3 right-3 p-1 rounded-full transition-colors duration-300 ${
          liked ? "text-pink-600 bg-white" : "text-black bg-white hover:text-pink-600"
        }`}
        style={{ zIndex: 10 }}
      >
        <FaHeart size={22} />
      </button>

      <img
        src={imgSrc}
        alt={producto.nombre || "Producto"}
        className="rounded-md transition-transform duration-300 hover:scale-105 mb-4"
        style={{
          width: "100%",
          height: "180px",
          objectFit: "contain",
        }}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "/placeholder.png";
        }}
      />

      <div className="flex flex-col flex-grow">
        <h3 className="font-title text-black font-semibold text-xl mb-1">
          {producto.nombre || "Sin nombre"}
        </h3>
        <p className="font-body text-gray-700 text-sm flex-grow line-clamp-3">
          {producto.descripcion || "Sin descripción disponible"}
        </p>
        <p className="text-pink-600 font-bold text-xl mt-2">
          ${precioFormateado}
        </p>

        <button
          onClick={handleComprar}
          className="mt-4 self-start bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-black transition duration-300 flex items-center gap-2 text-sm shadow-lg"
        >
          <FaShoppingBag size={14} /> Comprar
        </button>
      </div>
    </Link>
  );
};

export default ProductoCard;
