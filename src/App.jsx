import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Destacados from "./components/Destacados";
import ProductosList from "./components/ProductosList"; // Importa el componente que lista productos
import AdminProducts from "./components/admin/AdminProductos";
import LoginAdmin from "./components/admin/LoginAdmin";
import Footer from "./components/Footer";

function App() {
  const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";

  return (
    <Router>
      <div className="font-sans text-black">
        {/* Fondo animado fijo */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-pink-100 via-white to-pink-200 bg-[length:300%_300%] animate-gradient" />

        <Navbar />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Destacados />
                <ProductosList /> {/* Usamos ProductosList para mostrar los productos */}
              </>
            }
          />
          <Route
            path="/admin"
            element={isLoggedIn ? <AdminProducts /> : <Navigate to="/login" />}
          />
          <Route path="/login" element={<LoginAdmin />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
