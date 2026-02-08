
import React, { useState, useEffect } from "react";
import { FaHeart, FaShoppingBag } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useFavoritos } from "../context/FavoritosContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { CLOUDINARY_BASE_URL } from "../config";

const ProductoCard = ({ producto }) => {
  const [loaded, setLoaded] = useState(false);
  const [loadingFav, setLoadingFav] = useState(false);
  const [processingCart, setProcessingCart] = useState(false);
  const [isFavorito, setIsFavorito] = useState(false);

  const { user } = useAuth();
  const { carrito, agregarAlCarrito, eliminarDelCarrito } = useCart();
  const { favoritos, agregarFavorito, eliminarFavorito } = useFavoritos();

  if (!producto) return null;

  const esActivo = producto.estado === "activo";

  const estaEnCarrito = Array.isArray(carrito)
    ? carrito.some((p) => p.id?.toString() === producto.id?.toString())
    : false;

  useEffect(() => {
    const yaEsFavorito = Array.isArray(favoritos)
      ? favoritos.some(
          (f) =>
            (f?.producto_id || f?.id)?.toString() ===
            producto.id?.toString()
        )
      : false;

    setIsFavorito(yaEsFavorito);
  }, [favoritos, producto.id]);

  const toggleFavorito = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (loadingFav) return;

    if (!user) {
      toast.info("💖 Iniciá sesión para guardar tus favoritos");
      return;
    }

    setLoadingFav(true);
    try {
      if (isFavorito) {
        await eliminarFavorito(producto.id);
        setIsFavorito(false);
      } else {
        await agregarFavorito(producto);
        setIsFavorito(true);
      }
    } catch {
      toast.error("No se pudo actualizar favoritos");
    } finally {
      setLoadingFav(false);
    }
  };

  const handleToggleCarrito = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (processingCart || !esActivo) return;

    if (!user) {
      toast.info("🛒 Iniciá sesión para poder comprar");
      return;
    }

    setProcessingCart(true);
    try {
      if (estaEnCarrito) {
        await eliminarDelCarrito(producto.id);
        toast.info("Producto eliminado del carrito");
      } else {
        await agregarAlCarrito(producto, 1);
        toast.success("Producto agregado al carrito");
      }
    } catch {
      toast.error("No se pudo actualizar el carrito");
    } finally {
      setProcessingCart(false);
    }
  };

  const imgSrc = producto.imageUrl
    ? producto.imageUrl.startsWith("http")
      ? producto.imageUrl
      : `${CLOUDINARY_BASE_URL}${producto.imageUrl}`
    : "/placeholder.png";

  const precioFormateado = new Intl.NumberFormat("es-AR").format(
    producto.precio
  );

  return (
    <Link
      to={`/producto/${producto.id}`}
      className="
        relative bg-white text-black rounded-xl
        shadow-md hover:shadow-lg
        transition-shadow duration-300
        p-3
        flex flex-col justify-between
        w-full
      "
    >
      {/* ❤️ FAVORITO */}
      <button
        onClick={toggleFavorito}
        className={`absolute top-3 right-3 z-20 ${
          isFavorito ? "text-pink-600" : "text-black hover:text-pink-600"
        }`}
      >
        <FaHeart size={20} />
      </button>

      <img
        src={imgSrc}
        alt={producto.nombre}
        className={`rounded-md mb-2 transition-opacity ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ height: "180px", objectFit: "contain" }}
        onLoad={() => setLoaded(true)}
        onError={(e) => (e.currentTarget.src = "/placeholder.png")}
      />

      <h3 className="font-body font-semibold text-sm sm:text-base mb-1 line-clamp-2">
        {producto.nombre}
      </h3>

      <p className="text-gray-700 text-xs line-clamp-2">
        {producto.descripcion}
      </p>

      <p className="text-pink-600 font-semibold text-base sm:text-lg mt-1">
        ${precioFormateado}
      </p>

      {esActivo ? (
        <button
          onClick={handleToggleCarrito}
          className={`mt-2 px-3 py-1.5 rounded-full text-xs font-body
            flex items-center gap-2
            mx-auto
            transition
            ${
              estaEnCarrito
                ? "bg-pink-500 text-white"
                : "bg-black text-white hover:bg-pink-500"
            }`}
        >
          <FaShoppingBag size={14} />
          {estaEnCarrito ? "En carrito" : "Comprar"}
        </button>
      ) : (
        <p className="mt-2 text-xs text-gray-500 italic text-center">
          Producto sin stock
        </p>
      )}
    </Link>
  );
};

export default ProductoCard;
