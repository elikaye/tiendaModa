import React from 'react';
import { CartProvider } from './context/CartContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Destacados from "./components/Destacados";
import ProductosList from "./components/ProductosList";
import AdminProducts from "./components/admin/AdminProductos";
import Auth from "./components/admin/Auth";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import DetalleProducto from "./components/DetalleProducto";
import Carrito from "./components/Carrito"; // ✅ Asegurate que este archivo exista en components

import Ropa from "./pages/Ropa";
import Zapatos from "./pages/Zapatos";
import Hogar from "./pages/Hogar";
import Electronica from "./pages/Electronica";

function App() {
  const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";

  return (
    <CartProvider>
      <Router>
        <div className="font-sans text-black">
          {/* Fondo degradado */}
          <div className="fixed inset-0 -z-10 bg-gradient-to-br from-pink-100 via-white to-pink-200 bg-[length:300%_300%] animate-gradient" />

          <Navbar />

          <Routes>
            {/* Página principal */}
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

            {/* Páginas de categorías */}
            <Route path="/ropa" element={<Ropa />} />
            <Route path="/zapatos" element={<Zapatos />} />
            <Route path="/hogar" element={<Hogar />} />
            <Route path="/electronica" element={<Electronica />} />

            {/* Detalle de producto */}
            <Route path="/producto/:id" element={<DetalleProducto />} />

            {/* Página del carrito */}
            <Route path="/carrito" element={<Carrito />} />

            {/* Autenticación y panel admin */}
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/admin"
              element={isLoggedIn ? <AdminProducts /> : <Navigate to="/auth" />}
            />
          </Routes>

          <Footer />
          <WhatsAppButton />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
