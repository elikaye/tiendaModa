import React from "react";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Productos from "./components/Productos";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="font-sans text-black-800">
      <Header />
      <Navbar />
      <Hero />
      <Productos />
      <Footer />
    </div>
  );
}

export default App;
