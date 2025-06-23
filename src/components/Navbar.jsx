import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import logo from '../assets/images/logo3.png';
import lupa from '../assets/lupa.png';
import carrito from '../assets/carrito-de-compras.png';
import whatsapp from '../assets/whatsapp-black.png';
import facebook from '../assets/facebook-black.png';
import instagram from '../assets/instagram-black.png';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Todas las secciones
  const secciones = [
    ['Ropa', '#ropa'],
    ['Zapatos', '#zapatos'],
    ['Hogar', '#hogar'],
    ['Electrónica', '#electronica'],
  ];

  // Para desktop mostramos solo estas categorías (podés modificar)
  const seccionesDesktop = secciones.filter(([label]) =>
    ['Ropa', 'Zapatos', 'Hogar', 'Electrónica'].includes(label)
  );

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/40 border-b border-white/30 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-10 w-auto drop-shadow" />
          <div className="leading-tight hidden sm:block">
            <span className="text-lg font-extrabold text-black font-poppins">Barby Tienda</span>
            <span className="text-sm text-white font-semibold hidden lg:block">
              Todo lo que amás en un solo lugar
            </span>
          </div>
        </div>

        {/* Menú desktop */}
        <nav className="hidden md:flex gap-6 font-bold text-sm font-poppins">
          {seccionesDesktop.map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="text-black hover:bg-gradient-to-r hover:from-gray-400 hover:via-white hover:to-gray-400 hover:bg-clip-text hover:text-transparent hover:animate-shimmer transition"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Íconos y botón */}
        <div className="flex items-center gap-4">
          {[lupa, carrito].map((icon, i) => (
            <img
              key={i}
              src={icon}
              alt="Icon"
              className="h-6 w-6 transition-transform hover:scale-110 hover:brightness-125 hover:drop-shadow-[0_0_6px_#f472b6] duration-300"
            />
          ))}
          {[
            [whatsapp, 'https://wa.me/+5491164283906'],
            [instagram, 'https://www.instagram.com/barby_indu/'],
            [facebook, 'https://www.facebook.com/barbara.andrada'],
          ].map(([icon, link], i) => (
            <a
              key={i}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:drop-shadow-[0_0_6px_#f472b6] hover:scale-110 transition-transform duration-300"
            >
              <img src={icon} alt="Red Social" className="h-6 w-6" />
            </a>
          ))}

          {/* Botón hamburguesa solo en móvil */}
          <button
            className="text-black text-2xl md:hidden ml-2"
            onClick={toggleMenu}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {menuOpen && (
        <nav className="md:hidden px-6 pb-4 flex flex-col gap-3 font-poppins font-bold bg-gray-100/80 backdrop-blur-md shadow-md">
          {secciones.map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="text-black hover:bg-gradient-to-r hover:from-gray-400 hover:via-white hover:to-gray-400 hover:bg-clip-text hover:text-transparent transition"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
