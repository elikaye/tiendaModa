import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart, FaShoppingBag } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useFavoritos } from "../context/FavoritosContext";
import { toast } from "react-toastify";
import { API_BASE_URL, CLOUDINARY_BASE_URL } from "../config";

const DetalleProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { carrito, agregarAlCarrito, eliminarDelCarrito } = useCart();
  const { favoritos, agregarFavorito, eliminarFavorito } = useFavoritos();

  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingFav, setLoadingFav] = useState(false);
  const [addingCart, setAddingCart] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/products/${id}`);
        if (!res.ok) throw new Error("Error cargando producto");
        const data = await res.json();
        setProducto(data);
      } catch (err) {
        console.error(err);
        toast.error("No se pudo cargar el producto");
      } finally {
        setLoading(false);
      }
    };
    fetchProducto();
  }, [id]);

  if (loading) {
    return <div className="text-center py-16 text-gray-500">Cargando producto…</div>;
  }

  if (!producto) {
    return <div className="text-center py-16 text-gray-500">Producto no encontrado</div>;
  }

  const favoritosArray = Array.isArray(favoritos) ? favoritos : [];
  const isFavorito = favoritosArray.some((f) => {
    const favId = f?.producto_id || f?.id;
    return favId?.toString() === producto.id?.toString();
  });

  const toggleFavorito = async () => {
    if (!token) {
      toast.info("Iniciá sesión para agregar a favoritos", { autoClose: 1500 });
      return;
    }
    if (loadingFav) return;

    setLoadingFav(true);
    try {
      isFavorito
        ? await eliminarFavorito(producto.id)
        : await agregarFavorito(producto);
    } catch {
      toast.error("No se pudo actualizar favoritos");
    } finally {
      setLoadingFav(false);
    }
  };

  const carritoArray = Array.isArray(carrito) ? carrito : [];
  const isInCart = carritoArray.some((item) => {
    const itemId = item.producto_id || item.id;
    return itemId?.toString() === producto.id?.toString();
  });

  const handleComprar = async () => {
    if (!token) {
      toast.info("Iniciá sesión para poder comprar", { autoClose: 1500 });
      return;
    }
    if (addingCart || producto.estado !== "activo") return;

    try {
      setAddingCart(true);
      isInCart
        ? await eliminarDelCarrito(producto.id)
        : await agregarAlCarrito(producto, 1);
    } catch {
      toast.error("No se pudo actualizar el carrito");
    } finally {
      setAddingCart(false);
    }
  };

  const imgSrc = producto.imageUrl
    ? producto.imageUrl.startsWith("http")
      ? producto.imageUrl
      : `${CLOUDINARY_BASE_URL}${producto.imageUrl}`
    : "/placeholder.png";

  const productoInactivo = producto.estado !== "activo";

  return (
    <div className="bg-white px-3 py-6 md:px-20 md:py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-lg md:shadow-lg p-4 md:p-8 relative">

        {/* Favoritos */}
        <button
          onClick={toggleFavorito}
          disabled={loadingFav}
          className={`absolute top-3 right-3 text-2xl md:text-3xl
            ${isFavorito ? "text-pink-600" : "text-black hover:text-pink-600"}
          `}
        >
          <FaHeart />
        </button>

        <h2 className="text-xl md:text-3xl font-body mb-4 text-center">
          {producto.nombre}
        </h2>

        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <img
            src={imgSrc}
            alt={producto.nombre}
            className="w-full max-w-[220px] md:max-w-xs h-56 md:h-80 object-contain rounded-lg"
            onError={(e) => (e.currentTarget.src = "/placeholder.png")}
          />

          <div className="flex flex-col gap-3 w-full text-center md:text-left">
            {productoInactivo && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded">
                ❌ Producto sin stock
              </div>
            )}

            {producto.descripcion && <p className="text-gray-700">{producto.descripcion}</p>}
            {producto.colores && <p><strong>Colores:</strong> {producto.colores}</p>}
            {producto.talles && <p><strong>Talles:</strong> {producto.talles}</p>}

            <p className="text-2xl font-body text-pink-600">
              ${new Intl.NumberFormat("es-AR").format(producto.precio)}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <button
                onClick={handleComprar}
                disabled={addingCart || productoInactivo}
                className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-black transition flex items-center justify-center gap-2"
              >
                <FaShoppingBag />
                {isInCart ? "Quitar del carrito" : "Agregar al carrito"}
              </button>

              <button
                onClick={() => navigate("/")}
                className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-black transition"
              >
                Seguir comprando
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleProducto;
