import React from 'react';
import logo from '../assets/tienda-moda2.png';

export default function Hero() {
  return (
    <section className="flex justify-center items-center min-h-[60vh] bg-black px-6 py-12">
      <div className="backdrop-blur-md bg-white/10 border border-white/20 shadow-xl rounded-2xl p-10 flex flex-col sm:flex-row items-center gap-8 w-full max-w-5xl">
        
        {/* Logo */}
        <img
          src={logo}
          alt="Logo Tienda Barby"
          className="w-40 sm:w-48 h-auto drop-shadow-lg"
        />

        {/* Texto principal */}
        <div className="text-center sm:text-left max-w-lg">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-zinc-200 via-white to-zinc-400 bg-clip-text text-transparent animate-shimmer font-poppins drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
            ¡Bienvenidas a Tienda Barby!
          </h1>
          <p className="mt-4 text-gray-100 font-medium text-lg font-poppins">
            
          </p>
        </div>
      </div>
    </section>
  );
}
