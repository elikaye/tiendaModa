import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { SearchProvider } from './context/SearchContext';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Destacados from './components/Destacados';
import ProductosList from './components/ProductosList';
import AdminProducts from './components/admin/AdminProductos';
import Auth from './components/admin/Auth';
import Register from './components/admin/Register'; // <-- Importado Register
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import DetalleProducto from './components/DetalleProducto';
import Carrito from './components/Carrito';
import ScrollToTop from './components/ScrollToTop';

import Ropa from './pages/Ropa';
import Calzados from './pages/Calzados';
import Hogar from './pages/Hogar';
import Electronica from './pages/Electronica';

function App() {
  const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";

  return (
    <CartProvider>
      <SearchProvider>
        <Router>
          <ScrollToTop />
          <div className="font-sans text-black min-h-screen flex flex-col relative">
            {/* Fondo animado */}
            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-pink-100 via-white to-pink-200 bg-[length:300%_300%] animate-gradient" />

            {/* Header/Nav */}
            <Navbar />

            {/* Contenido principal con flex-grow para empujar el footer abajo */}
            <main className="flex-grow">
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <Hero />
                      <Destacados />
                      <ProductosList />
                    </>
                  }
                />
                <Route path="/ropa" element={<Ropa />} />
                <Route path="/calzados" element={<Calzados />} />
                <Route path="/hogar" element={<Hogar />} />
                <Route path="/electronica" element={<Electronica />} />
                <Route path="/producto/:id" element={<DetalleProducto />} />
                <Route path="/carrito" element={<Carrito />} />

                {/* Login (auth) */}
                <Route path="/auth" element={<Auth />} />

                {/* Registro (ahora es público) */}
                <Route path="/register" element={<Register />} />
                <Route path="/admin/register" element={<Register />} />

                {/* Panel de administración protegido */}
                <Route
                  path="/admin"
                  element={isLoggedIn ? <AdminProducts /> : <Navigate to="/auth" />}
                />
              </Routes>
            </main>

            {/* Footer siempre al final */}
            <Footer />
            <WhatsAppButton />
          </div>
        </Router>
      </SearchProvider>
    </CartProvider>
  );
}

export default App;
