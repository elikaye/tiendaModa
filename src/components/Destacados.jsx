import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

export default function Destacados() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        const destacados = data.slice(0, 6); // 🔸 Primeros 6 productos
        setProductos(destacados);
      })
      .catch(err => console.error('Error al cargar productos:', err));
  }, []);

  return (
    <section className="bg-pink-50 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-pink-600 mb-10 text-center">
          Productos Destacados
        </h2>
        <Swiper
          modules={[Autoplay]}
          spaceBetween={30}
          slidesPerView={3}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={1000}
          pagination={false}
          navigation={false}
          breakpoints={{
            320: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {productos.map(prod => (
            <SwiperSlide key={prod.id}>
              <div className="bg-white rounded-2xl shadow-xl p-6 transition-transform hover:scale-105">
                <img
                  src={prod.imageUrl}
                  alt={prod.name}
                  className="h-60 w-full object-contain mb-4"
                />
                <h3 className="text-lg font-semibold text-pink-600">{prod.name}</h3>
                <p className="text-gray-800 mt-1">${prod.price}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
