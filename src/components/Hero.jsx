import React from 'react';
import logo from '../assets/logo1.png'; // Asegúrate de que la ruta sea correcta
export default function Hero() {
  return (
    <section className="flex items-center p-6 bg-pink-50">
      <img
        src={logo}
        alt="Logo Tienda Barbie"
        className="w-36 h-auto mr-4"
      />
      <div>
        <h1 className="text-4xl font-extrabold text-black-800">
          ¡Bienvenidos a Tienda Barby!
        </h1>
        <p className="mt-2 text-black-600 font-bold max-w-xl">
          Tu tienda favorita de ropa, zapatos y mucho más. Calidad y estilo para todas.
        </p>
      </div>
    </section>
  );
}
