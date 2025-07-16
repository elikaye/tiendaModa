
import React, { useEffect, useState } from "react";
import ProductoCard from "./ProductoCard";

const ProductosList = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/v1/products")
      .then((res) => res.json())
      .then((data) => {
        setProductos(data.products);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar productos:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-10">Cargando productos...</p>;
  if (productos.length === 0) return <p className="text-center mt-10">No hay productos para mostrar.</p>;

  return (
    <div id="productos" className="bg-pink-200 min-h-screen py-10 px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {productos.map((producto) => (
          <ProductoCard key={producto.id} producto={producto} />
        ))}
      </div>
    </div>
  );
};

export default ProductosList;