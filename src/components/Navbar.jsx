import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUserCircle, FaShoppingCart } from 'react-icons/fa';
import { Heart, Search } from 'lucide-react';
import whatsapp from '../assets/whatsapp-black.png';
import facebook from '../assets/facebook-black.png';
import instagram from '../assets/instagram-black.png';

import { useCart } from '../context/CartContext';
import { useSearch } from '../context/SearchContext';
import { useFavoritos } from '../context/FavoritosContext'; // ⭐ IMPORTANTE

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [localQuery, setLocalQuery] = useState('');

  const { carrito } = useCart();
  const { favoritos } = useFavoritos(); // ⭐ CONTADOR DE FAVORITOS
  const { setQuery } = useSearch();

  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const secciones = [
    ['Inicio', '/'],
    ['Ropa', '/ropa'],
    ['Calzados', '/calzados'],
    ['Hogar', '/hogar'],
    ['Electrónica', '/electronica'],
    ['Maquillaje', '/maquillaje'],
    ['Artículos de temporada', '/articulos-de-temporada'],
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setQuery(localQuery.trim());
    setMenuOpen(false);
    setShowSearch(false);
    navigate('/search');
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/40 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">

        {/* Menú escritorio */}
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

        {/* Iconos */}
        <div className="flex items-center gap-4 relative">

          {/* Buscador */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search
              size={24}
              onClick={() => setShowSearch((v) => !v)}
              className="cursor-pointer transition-transform hover:scale-110 hover:brightness-125 hover:drop-shadow-[0_0_6px_#f472b6] duration-300"
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

          {/* Favoritos + contador */}
          <Link
            to="/favoritos"
            className="relative text-black text-2xl transition-colors duration-300 hover:text-pink-500"
          >
            <Heart />
            {favoritos.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold">
                {favoritos.length}
              </span>
            )}
          </Link>

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
            className="text-black hover:text-pink-500 text-2xl transition-colors duration-300"
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
        <nav className="md:hidden px-6 pb-4 flex flex-col gap-4 font-body font-bold bg-white/70 backdrop-blur-md shadow-md text-black">
          {secciones.map(([label, to]) => (
            <Link
              key={label}
              to={to}
              onClick={() => setMenuOpen(false)}
              className="hover:text-pink-500 hover:drop-shadow-[0_0_6px_#f472b6] transition duration-300"
            >
              {label}
            </Link>
          ))}

          {/* Carrito en móvil */}
          <button
            onClick={() => {
              navigate('/carrito');
              setMenuOpen(false);
            }}
            className="hover:text-pink-500 transition duration-300 text-left"
          >
            Carrito ({carrito.length})
          </button>

          {/* Favoritos en móvil con contador */}
          <Link
            to="/favoritos"
            onClick={() => setMenuOpen(false)}
            className="hover:text-pink-500 transition duration-300 text-left"
          >
            Favoritos ({favoritos.length})
          </Link>

          <Link
            to="/auth"
            onClick={() => setMenuOpen(false)}
            className="hover:text-pink-500 transition duration-300"
          >
            Iniciar sesión / Registro
          </Link>
        </nav>
      )}
    </header>
  );
}
