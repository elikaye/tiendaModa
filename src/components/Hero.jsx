import React from 'react';
import logo from '../assets/logo14.png';
import fondoStock from '../assets/fondo11.png';

export default function Hero() {
  return (
    <section
      className="relative flex justify-center items-center px-6 py-12 h-[400px] sm:h-[450px] md:h-[500px]"
      style={{
        backgroundImage: `url(${fondoStock})`,
        backgroundSize: 'cover',
        backgroundPosition: 'top',
      }}
    >
      {/* Overlay sutil */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

      {/* Contenido */}
      <div className="relative flex flex-col sm:flex-row items-center gap-8 w-full max-w-6xl">

        {/* Texto */}
        <div className="text-center sm:text-left max-w-md z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-body font-semibold leading-tight mb-4 text-black">
            Todo lo que buscás en un solo lugar
          </h1>

          <p className="text-base sm:text-lg font-arial mb-6 text-black">
            Moda, hogar, electrónica, belleza y mucho más...
          </p>

          <a
            href="#productos"
            className="inline-block bg-pink-500 text-black font-body px-6 py-3 rounded-lg text-base shadow-md
            hover:bg-violet-500 hover:shadow-lg transition-all duration-300"
          >
            Ver productos
          </a>
        </div>

        {/* Logo más grande */}
        <div className="z-10 animate-fadeIn sm:ml-auto">
          <img
            src={logo}
            alt="Logo"
            className="h-64 sm:h-80 md:h-96 w-auto drop-shadow-lg"
          />
        </div>
      </div>

      {/* Animación fadeIn */}
      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(-20px);}
            100% { opacity: 1; transform: translateY(0);}
          }
          .animate-fadeIn {
            animation: fadeIn 1.2s ease-out forwards;
          }
        `}
      </style>
    </section>
  );
}
