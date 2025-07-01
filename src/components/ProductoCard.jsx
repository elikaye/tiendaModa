import React, { useState } from "react";
import { FaHeart } from "react-icons/fa";

const ProductoCard = ({ producto }) => {
  const [liked, setLiked] = useState(false);

  if (!producto || !producto.imageUrl || !producto.nombre) return null;

  const toggleLike = () => setLiked(!liked);

  return (
    <div
      className="relative bg-white rounded-xl shadow-lg
                 hover:shadow-2xl transition-shadow duration-300
                 cursor-pointer p-4 flex flex-row items-center gap-6 max-w-3xl mx-auto"
    >
      <button
        onClick={toggleLike}
        aria-label="Agregar a favoritos"
        className={`absolute top-3 right-3 p-1 rounded-full
          transition-colors duration-300
          ${liked ? "text-pink-600 bg-white" : "text-black bg-white hover:text-pink-600"}`}
        style={{ zIndex: 10 }}
      >
        <FaHeart size={22} />
      </button>

      <img
        src={producto.imageUrl}
        alt={producto.nombre}
        className="rounded-md transition-transform duration-300 hover:scale-105"
        style={{
          width: "160px",
          height: "auto",
          objectFit: "contain",
          flexShrink: 0,
        }}
        onError={(e) => {
          e.target.src = "/placeholder.png"; // imagen alternativa si falla
        }}
      />

      <div className="flex flex-col flex-grow">
        <h3 className="font-title text-black font-semibold text-xl mb-1">
          {producto.nombre}
        </h3>
        <p className="font-body text-gray-700 text-sm flex-grow line-clamp-3">
          {producto.descripcion || "Sin descripción disponible"}
        </p>
        <p className="text-pink-600 font-bold text-xl mt-3">
          ${producto.precio?.toFixed(2) || "0.00"}
        </p>
      </div>
    </div>
  );
};

export default ProductoCard;
