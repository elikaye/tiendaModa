import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const productos = [
  { id: 1, imagen: "/producto1.jpeg", nombre: "Producto 1", precio: 3000 },
  { id: 2, imagen: "/producto2.jpeg", nombre: "Producto 2", precio: 3200 },
  { id: 3, imagen: "/producto3.jpeg", nombre: "Producto 3", precio: 2800 },
  { id: 4, imagen: "/producto4.jpeg", nombre: "Producto 4", precio: 3100 },
];

export default function Productos() {
  return (
    <section className="bg-pink-50 py-10">
      <div className="max-w-6xl mx-auto">
        <Swiper
          modules={[Pagination, Autoplay, Navigation]}
          spaceBetween={30}
          slidesPerView={3}
          loop={true}
          autoplay={{ delay: 3000 }}
          pagination={{ clickable: true }}
          navigation={true}
          breakpoints={{
            320: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {productos.map(prod => (
            <SwiperSlide key={prod.id}>
              <div className="bg-white rounded-xl p-4 shadow text-center">
                <img
                  src={prod.imagen}
                  alt={prod.nombre}
                  className="h-48 object-contain mx-auto mb-4"
                />
                <h3 className="text-pink-500 font-bold text-lg">{prod.nombre}</h3>
                <p>${prod.precio}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
