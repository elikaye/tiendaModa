
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUserCircle, FaShoppingCart } from 'react-icons/fa'; 
import logo from '../assets/images/logo3.png';
import lupa from '../assets/lupa.png';
import whatsapp from '../assets/whatsapp-black.png';
import facebook from '../assets/facebook-black.png';
import instagram from '../assets/instagram-black.png';

import { useCart } from '../context/CartContext';
import { useSearch } from '../context/SearchContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [localQuery, setLocalQuery] = useState('');
  const { carrito } = useCart();
  const { setQuery } = useSearch();
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleSearch = () => setShowSearch(!showSearch);

  const secciones = [
    ['Inicio', '/'],
    ['Ropa', '/ropa'],
    ['Zapatos', '/zapatos'],
    ['Hogar', '/hogar'],
    ['Electrónica', '/electronica'],
  ];

  // Al hacer submit en el input buscar
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setQuery(localQuery.trim());
    setMenuOpen(false);
    setShowSearch(false);
    navigate('/search');  // --> Necesitás crear esta ruta y componente SearchPage
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/40 border-b border-white/30 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-10 w-auto drop-shadow" />
          <div className="leading-tight hidden sm:block">
            <span className="text-lg font-extrabold text-black font-body">Barby Tienda</span>
            <span className="text-sm text-gray-700 font-semibold hidden lg:block font-body">
              Todo lo que amás en un solo lugar
            </span>
          </div>
        </div>

        {/* Menú desktop */}
        <nav className="hidden md:flex gap-8 font-bold text-sm font-body">
          {secciones.map(([label, to]) => (
            <Link
              key={label}
              to={to}
              onClick={() => setMenuOpen(false)}
              className="text-black hover:text-pink-500 hover:drop-shadow-[0_0_6px_#f472b6] transition duration-300"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Íconos y login */}
        <div className="flex items-center gap-4 relative">
          {/* Buscador */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <img
              src={lupa}
              alt="Buscar"
              onClick={() => setShowSearch((v) => !v)}
              className="h-6 w-6 cursor-pointer transition-transform hover:scale-110 hover:brightness-125 hover:drop-shadow-[0_0_6px_#f472b6] duration-300"
            />
            {showSearch && (
              <input
                type="text"
                placeholder="Buscar productos..."
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                autoFocus
                className="absolute right-0 top-7 w-48 border rounded px-3 py-1 text-sm shadow-md focus:outline-none"
              />
            )}
          </form>

          {/* Carrito */}
          <button
            onClick={() => {
              navigate('/carrito');
              setMenuOpen(false);
            }}
            aria-label="Carrito de compras"
            className="relative focus:outline-none"
          >
            <FaShoppingCart className="h-6 w-6 text-black hover:text-pink-500 transition duration-300" />
            {carrito.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold">
                {carrito.length}
              </span>
            )}
          </button>

          {[whatsapp, instagram, facebook].map((icon, i) => (
            <a
              key={i}
              href={
                i === 0
                  ? 'https://wa.me/+5491164283906'
                  : i === 1
                  ? 'https://www.instagram.com/barby_indu/'
                  : 'https://www.facebook.com/barbara.andrada'
              }
              target="_blank"
              rel="noopener noreferrer"
              className="hover:drop-shadow-[0_0_6px_#f472b6] hover:scale-110 transition-transform duration-300"
            >
              <img src={icon} alt="Red Social" className="h-6 w-6" />
            </a>
          ))}

          <Link
            to="/auth"
            className="text-black hover:text-pink-600 text-2xl transition-colors duration-300"
          >
            <FaUserCircle />
          </Link>

          <button
            className="text-black text-2xl md:hidden ml-2"
            onClick={toggleMenu}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <nav className="md:hidden px-6 pb-4 flex flex-col gap-4 font-body font-bold bg-gray-100/80 backdrop-blur-md shadow-md">
          {secciones.map(([label, to]) => (
            <Link
              key={label}
              to={to}
              onClick={() => setMenuOpen(false)}
              className="text-black hover:text-pink-500 hover:drop-shadow-[0_0_6px_#f472b6] transition duration-300"
            >
              {label}
            </Link>
          ))}
          <button
            onClick={() => {
              navigate('/carrito');
              setMenuOpen(false);
            }}
            className="text-black hover:text-pink-500 transition duration-300 text-left"
          >
            Carrito ({carrito.length})
          </button>
          <Link
            to="/auth"
            onClick={() => setMenuOpen(false)}
            className="text-black hover:text-pink-500 transition duration-300"
          >
            Login / Registro
          </Link>
        </nav>
      )}
    </header>
  );
}
