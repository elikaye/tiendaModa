import React from "react";
import { FaHeart, FaShoppingBag } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useFavoritos } from "../context/FavoritosContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CLOUDINARY_BASE_URL } from "../config";

const ProductoCard = ({ producto }) => {
  const { agregarAlCarrito } = useCart();
  const { favoritos, agregarFavorito, eliminarFavorito } = useFavoritos();
  const navigate = useNavigate();

  if (!producto) return null;

  // Siempre usar un array seguro
  const favoritosArray = favoritos || [];

  // ✅ FIX: evitar que 'f' sea null o no tenga producto_id
  const isFavorito = favoritosArray.some((f) => {
    if (!f || (!f.id && !f.producto_id)) return false;
    const favId = f.id || f.producto_id;
    return favId.toString() === producto.id?.toString();
  });

  const toggleFavorito = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!agregarFavorito || !eliminarFavorito) {
      toast.info("💖 Iniciá sesión para guardar tus favoritos");
      return;
    }

    try {
      if (isFavorito) {
        await eliminarFavorito(producto.id);
      } else {
        await agregarFavorito(producto);
      }
    } catch (err) {
      console.error("❌ Error en toggleFavorito:", err);
    }
  };

  const handleComprar = (e) => {
    e.preventDefault();
    e.stopPropagation();
    agregarAlCarrito(producto);
    navigate("/carrito");
  };

  const imgSrc = producto.imageUrl
    ? producto.imageUrl.startsWith("http")
      ? producto.imageUrl
      : `${CLOUDINARY_BASE_URL}${producto.imageUrl}`
    : "/placeholder.png";

  const precioFormateado = !isNaN(Number(producto.precio))
    ? Number(producto.precio).toLocaleString("es-AR", { minimumFractionDigits: 0 })
    : "0";

  return (
    <Link
      to={`/producto/${producto.id || producto._id}`}
      className="relative text-black bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer p-4 flex flex-col justify-between h-full mt-6"
    >
      <button
        onClick={toggleFavorito}
        aria-label="Agregar a favoritos"
        className={`absolute top-4 right-4 p-1 rounded-full transition-colors duration-300 z-20 ${
          isFavorito ? "text-pink-600" : "text-black hover:text-pink-600"
        }`}
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
          className="mt-4 self-start bg-black text-white px-4 py-2 rounded-full hover:bg-pink-500 transition duration-300 flex items-center gap-2 text-sm shadow-lg"
        >
          <FaShoppingBag size={14} /> Comprar
        </button>
      </div>
    </Link>
  );
};

export default ProductoCard;
