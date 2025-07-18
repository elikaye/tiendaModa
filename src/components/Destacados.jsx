

import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { FaShoppingBag } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { API_BASE_URL } from '../config'; // ✅ Cambiado
import 'swiper/css';

function Destacados() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { agregarAlCarrito } = useCart();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products?destacado=true&limit=6`);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const data = await response.json();
        const destacados = Array.isArray(data.products) ? data.products : [];
        setProductos(destacados);
      } catch (err) {
        console.error('❌ Error al cargar productos:', err);
        setError('No pudimos cargar los productos destacados.');
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
    return () => setProductos([]);
  }, []);

  if (loading || error || !productos.length) return null;

  const handleComprar = (e, producto) => {
    e.preventDefault();
    agregarAlCarrito(producto);
    alert(`Agregaste ${producto.nombre} al carrito!`);
  };

  return (
    <section className="bg-pink-200 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-serif font-bold text-black mb-10 text-center tracking-wide">
          Productos Destacados
        </h2>

        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={productos.length > 1}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {productos.map(prod => (
            <SwiperSlide key={prod.id}>
              <Link to={`/producto/${prod.id}`}>
                <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                  <div className="h-60 bg-white flex items-center justify-center relative overflow-hidden">
                    <img
                      src={prod.imageUrl}
                      alt={prod.nombre}
                      className="object-contain w-full h-full p-6 transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/static/products/producto1.jpeg';
                      }}
                    />
                  </div>
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <h3 className="text-lg font-title font-semibold text-gray-900 mb-2 line-clamp-2">
                      {prod.nombre}
                    </h3>
                    <div className="flex justify-between items-center mt-auto">
                      <p className="text-pink-600 text-xl font-bold">
                        ${prod.precio.toFixed(2)}
                      </p>
                      <button
                        onClick={(e) => handleComprar(e, prod)}
                        className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full hover:bg-pink-600 transition-all duration-300 text-sm shadow-lg"
                      >
                        <FaShoppingBag size={14} /> Comprar
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default Destacados;
