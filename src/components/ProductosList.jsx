import React, { useEffect, useState } from "react";
import ProductoCard from "./ProductoCard";
import { useSearch } from "../context/SearchContext";

const ProductosList = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { query = "" } = useSearch(); // Aseguro query como string

  useEffect(() => {
    fetch("http://localhost:5000/api/v1/products")
      .then((res) => res.json())
      .then((data) => {
        console.log("Productos recibidos:", data.products); // Debug para ver qué llega
        setProductos(data.products || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar productos:", err);
        setLoading(false);
      });
  }, []);

  const productosFiltrados = query
    ? productos.filter((producto) =>
        producto.nombre.toLowerCase().includes(query.toLowerCase())
      )
    : productos;

  if (loading) return <p className="text-center mt-10">Cargando productos...</p>;
  if (productosFiltrados.length === 0)
    return <p className="text-center mt-10">No hay productos que coincidan.</p>;

  return (
    <div id="productos" className="bg-pink-200 min-h-screen py-10 px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {productosFiltrados.map((producto) => (
          <ProductoCard key={producto.id} producto={producto} />
        ))}
      </div>
    </div>
  );
};

export default ProductosList;
