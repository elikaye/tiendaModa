import React, { useState } from 'react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="relative flex items-center justify-between px-6 py-4 bg-white shadow-md">

      {/* <div className="text-xl font-bold">Tienda Barby</div> */}

      {/* Botón hamburguesa - sigue visible para abrir/cerrar */}
      <button
        className="md:hidden text-gray-700 focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {menuOpen ? (
            // Icono X para cerrar
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            // Icono hamburguesa para abrir
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Menú escritorio */}
      <ul className="hidden md:flex space-x-6 text-black-800 font-medium">
        <li><a href="#productos" className="hover:text-pink-500">Ropa</a></li>
        <li><a href="#zapatos" className="hover:text-pink-500">Zapatos</a></li>
        <li><a href="#hogar" className="hover:text-pink-500">Hogar</a></li>
        <li><a href="#electronica" className="hover:text-pink-500">Electrónica</a></li>
        <li><a href="#login" className="hover:text-pink-500">Login</a></li>
        <li><a href="#registro" className="hover:text-pink-500">Registro</a></li>
      </ul>

      {/* Menú móvil desplegable */}
      {menuOpen && (
        <div className="fixed top-16 left-0 w-full bg-white shadow-lg md:hidden z-50">
          {/* Aquí agrego un botón para cerrar, igual que el de arriba pero visible dentro del menú */}
          <div className="flex justify-end p-4">
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Cerrar menú"
              className="text-gray-700 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <ul className="flex flex-col space-y-4 px-6 pb-6 text-gray-700 font-medium">
            <li><a href="#productos" className="hover:text-pink-500" onClick={() => setMenuOpen(false)}>Ropa</a></li>
            <li><a href="#zapatos" className="hover:text-pink-500" onClick={() => setMenuOpen(false)}>Zapatos</a></li>
            <li><a href="#hogar" className="hover:text-pink-500" onClick={() => setMenuOpen(false)}>Hogar</a></li>
            <li><a href="#electronica" className="hover:text-pink-500" onClick={() => setMenuOpen(false)}>Electrónica</a></li>
            <li><a href="#login" className="hover:text-pink-500" onClick={() => setMenuOpen(false)}>Login</a></li>
            <li><a href="#registro" className="hover:text-pink-500" onClick={() => setMenuOpen(false)}>Registro</a></li>
          </ul>
        </div>
      )}
    </nav>
  );
}
