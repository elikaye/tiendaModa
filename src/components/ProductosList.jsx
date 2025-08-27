
import React, { useEffect, useState } from "react";
import ProductoCard from "./ProductoCard";
import { useSearch } from "../context/SearchContext";

const ProductosList = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { query = "" } = useSearch();

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/products`) // Ya no usamos API_BASE_URL
      .then((res) => {
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setProductos(data.products || []);
      })
      .catch((err) => {
        console.error("Error al cargar productos:", err);
        setError("No se pudieron cargar los productos.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const productosFiltrados = query
    ? productos.filter((producto) =>
        producto.nombre.toLowerCase().includes(query.toLowerCase())
      )
    : productos;

  if (loading) return <p className="text-center mt-10">Cargando productos...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (productosFiltrados.length === 0)
    return <p className="text-center mt-10">No hay productos que coincidan.</p>;

  return (
    <div id="productos" className="bg-pink-200 min-h-screen py-10 px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {productosFiltrados.map((producto) => (
          <ProductoCard key={producto.id || producto._id} producto={producto} />
        ))}
      </div>
    </div>
  );
};

export default ProductosList;
