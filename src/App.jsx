import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { SearchProvider } from './context/SearchContext';
import { AuthProvider } from './context/AuthContext';
import { FavoritosProvider } from './context/FavoritosContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Destacados from './components/Destacados';
import ProductosList from './components/ProductosList';
import AdminDashboard from './components/admin/AdminDashboard';
import Auth from './components/admin/Auth';
import Register from './components/admin/Register';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import DetalleProducto from './components/DetalleProducto';
import Carrito from './components/Carrito';
import FavoritosPage from './pages/FavoritosPage'; // ✅ Página de favoritos
import ScrollToTop from './components/ScrollToTop';

import Ropa from './pages/Ropa';
import Calzados from './pages/Calzados';
import Hogar from './pages/Hogar';
import Electronica from './pages/Electronica';
import Maquillajes from './pages/Maquillaje';
import ArticulosDeTemporada from './pages/ArticulosDeTemporada';

function App() {
  const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";

  return (
    <AuthProvider>
      <CartProvider>
        <SearchProvider>
          <FavoritosProvider>
            <Router>
              <ScrollToTop />
              <div className="font-sans text-black min-h-screen flex flex-col relative">
                {/* Fondo animado */}
                <div className="fixed inset-0 -z-10 bg-gradient-to-br from-pink-100 via-white to-pink-200 bg-[length:300%_300%] animate-gradient" />

                {/* Header/Nav */}
                <Navbar />

                {/* Contenido principal */}
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
                    <Route path="/maquillaje" element={<Maquillajes />} />
                    <Route path="/articulos-de-temporada" element={<ArticulosDeTemporada />} />

                    <Route path="/producto/:id" element={<DetalleProducto />} />
                    <Route path="/carrito" element={<Carrito />} />
                    <Route path="/favoritos" element={<FavoritosPage />} /> {/* ✅ Favoritos */}

                    <Route path="/auth" element={<Auth />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/admin/register" element={<Register />} />
                    <Route
                      path="/admin"
                      element={isLoggedIn ? <AdminDashboard /> : <Navigate to="/auth" />}
                    />
                  </Routes>
                </main>

                <Footer />
                <WhatsAppButton />

                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="colored"
                />
              </div>
            </Router>
          </FavoritosProvider>
        </SearchProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
