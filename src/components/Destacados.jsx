import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { FaShoppingBag } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 
import 'swiper/css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Destacados() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { agregarAlCarrito } = useCart();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch(`/api/products?destacados=true&limit=6`);
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

  if (loading) return <p className="text-center py-10">Cargando productos destacados...</p>;
  if (error) return <p className="text-center py-10 text-red-600">{error}</p>;
  if (!productos.length) return <p className="text-center py-10">No hay productos destacados disponibles.</p>;

  const handleComprar = async (e, producto) => {
    e.preventDefault();
    try {
      await agregarAlCarrito(producto, 1);

      toast.success(`${producto.nombre} agregado al carrito!`, {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      console.error(err);
      toast.error("No se pudo agregar el producto al carrito", {
        position: 'top-right',
        autoClose: 2000,
      });
    }
  };

  return (
    <section className="bg-pink-100 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-body font-bold text-black mb-10 text-center tracking-wide">
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
          {productos.map(prod => {
            const imgSrc = prod.imageUrl || '/placeholder.png';
            const precioNumber = Number(prod.precio) || 0;
            const precioFormateado = precioNumber.toLocaleString('es-AR', { minimumFractionDigits: 0 });

            return (
              <SwiperSlide key={prod.id || prod._id}>
                <Link to={`/producto/${prod.id || prod._id}`}>
                  <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                    <div className="h-60 bg-white flex items-center justify-center relative overflow-hidden">
                      <img
                        src={imgSrc}
                        alt={prod.nombre}
                        className="object-contain w-full h-full p-6 transition-transform duration-500 hover:scale-105"
                        loading="lazy"
                        onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.png'; }}
                      />
                    </div>
                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <h3 className="text-lg font-title font-semibold text-gray-900 mb-2 line-clamp-2">
                        {prod.nombre}
                      </h3>
                      <div className="flex justify-between items-center mt-auto">
                        <p className="text-pink-600 text-xl font-bold">
                          ${precioFormateado}
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
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}

export default Destacados;
