import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Productos from "./components/Destacados";
import Footer from "./components/Footer";
import Destacados from "./components/Destacados";

function App() {
  return (
    <div className="font-sans text-black">
      {/* Fondo animado fijo detrás de todo */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-pink-100 via-white to-pink-200 bg-[length:300%_300%] animate-gradient" />
      
      {/* Contenido principal */}
      <Navbar />
      <Hero />
      <Destacados />
      <Footer />
    </div>
  );
}

export default App;
