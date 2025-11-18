import React from "react";
import logo from "../assets/barbara13.png";
import fondoStock from "../assets/banner20.png";

export default function Hero() {
  return (
    <section className="relative w-full h-[360px] sm:h-[420px] md:h-[480px] lg:h-[520px] overflow-hidden">

      {/* Fondo blur tipo Zara */}
      <div
        className="
          absolute inset-0 
          bg-cover bg-center 
          scale-110 blur-xl 
        "
        style={{ backgroundImage: `url(${fondoStock})` }}
      ></div>

      {/* Imagen principal */}
      <div
        className="
          absolute inset-0 
          bg-contain bg-center bg-no-repeat 
          opacity-95
        "
        style={{ backgroundImage: `url(${fondoStock})` }}
      ></div>

      {/* Contenido */}
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center h-full px-6 max-w-6xl mx-auto">

        {/* LOGO */}
        <div className="order-1 sm:order-2 animate-fadeIn">
          <img
            src={logo}
            alt="Logo"
            className="h-32 sm:h-44 md:h-52 opacity-80 drop-shadow-md"
          />
        </div>

        {/* TEXTO + BOTÓN */}
        <div className="order-2 sm:order-1 max-w-md text-center sm:text-left mt-6 sm:mt-0">
          <h1 className="text-3xl sm:text-4xl font-semibold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
            Todo lo que buscás en un solo lugar
          </h1>

          <p className="text-lg text-white opacity-90 mt-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
            Moda, hogar, electrónica, belleza y mucho más...
          </p>

          {/* BOTÓN TRANSPARENTE ROSA */}
          <a
            href="#productos"
            className="
              inline-block mt-6
              bg-pink-500/50 backdrop-blur-sm
              text-black font-semibold 
              px-6 py-3 
              rounded-lg shadow-md 
              transition-all duration-300 
              hover:bg-pink-500/70 
              hover:scale-105
            "
          >
            Ver productos
          </a>
        </div>
      </div>

      {/* Barrita rosa Barbie transparente */}
      <div
        className="
          absolute bottom-0 left-0 w-full 
          bg-pink-500/70 backdrop-blur-sm 
          py-2
          overflow-hidden
        "
      >
        <div className="whitespace-nowrap animate-marquee text-white font-medium text-sm tracking-wide">
          Todo lo que buscás en un solo lugar • Ropa • Calzado • Hogar • Electrónica •
          Maquillaje • Artículos de temporada •
        </div>
      </div>

      {/* Animación marquee */}
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee {
            display: inline-block;
            padding-left: 100%;
            animation: marquee 14s linear infinite;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 1.2s ease-out forwards;
          }
        `}
      </style>
    </section>
  );
}
