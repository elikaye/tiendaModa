import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Destacados from "./components/Destacados";
import ProductosList from "./components/ProductosList";
import AdminProducts from "./components/admin/AdminProductos";
import LoginAdmin from "./components/admin/LoginAdmin";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import DetalleProducto from "./components/DetalleProducto";

// ...

<Routes>
  {/* ... otras rutas */}
  <Route path="/producto/:id" element={<DetalleProducto />} />
</Routes>


// 📄 Importamos las nuevas páginas
import Ropa from "./pages/Ropa";
import Zapatos from "./pages/Zapatos";
import Hogar from "./pages/Hogar";
import Electronica from "./pages/Electronica";

function App() {
  const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";

  return (
    <Router>
      <div className="font-sans text-black">
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-pink-100 via-white to-pink-200 bg-[length:300%_300%] animate-gradient" />

        <Navbar />

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
          {/* Nuevas rutas de secciones */}
          <Route path="/ropa" element={<Ropa />} />
          <Route path="/zapatos" element={<Zapatos />} />
          <Route path="/hogar" element={<Hogar />} />
          <Route path="/electronica" element={<Electronica />} />
          <Route path="/producto/:id" element={<DetalleProducto />} />


          {/* Admin */}
          <Route path="/admin" element={isLoggedIn ? <AdminProducts /> : <Navigate to="/login" />} />
          <Route path="/login" element={<LoginAdmin />} />
        </Routes>

        <Footer />
        <WhatsAppButton />
      </div>
    </Router>
  );
}

export default App;
