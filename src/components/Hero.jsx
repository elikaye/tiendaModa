
import React from 'react';
import logo from '../assets/tienda-moda2.png';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="flex justify-center items-center bg-black px-6 py-16 mt-24">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-10 w-full max-w-6xl">

        {/* Logo a la izquierda */}
        <img
          src={logo}
          alt="Logo Tienda Barby"
          className="w-36 sm:w-44 h-auto drop-shadow-xl"
        />

        {/* Texto a la derecha */}
        <div className="text-center sm:text-left max-w-xl">
          <h1 className="text-5xl font-body leading-tight mb-4
            bg-shimmer-gradient bg-[length:300%_100%] bg-left
            text-transparent bg-clip-text animate-shimmer text-glow">
            Todo lo que buscás en un solo lugar
          </h1>

          <p className="text-lg text-pink-100 font-body mb-6">
            Moda, hogar, tecnología, belleza y mucho más. 
          </p>
        <a
          href="#productos"
          className="inline-block bg-pink-400 text-black font-body px-6 py-3 rounded-sm text-base shadow-md 
         hover:bg-pink-200 hover:shadow-lg transition-all duration-300"
       >
         Ver productos
       </a>

        </div>
        
      </div>
    </section>
  );
}
