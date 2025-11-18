
import React, { useEffect, useState } from "react";
import ProductoCard from "./ProductoCard";
import { useSearch } from "../context/SearchContext";
import { CLOUDINARY_BASE_URL } from "../config";

// 🔹 Mezcla balanceada por categoría
function mezclarPorCategoria(productos) {
  const categorias = {};
  productos.forEach((p) => {
    if (!categorias[p.categoria]) categorias[p.categoria] = [];
    categorias[p.categoria].push(p);
  });

  const mezclados = [];
  const keys = Object.keys(categorias);

  while (keys.some((k) => categorias[k].length > 0)) {
    const ordenAleatorio = [...keys].sort(() => Math.random() - 0.5);
    for (const key of ordenAleatorio) {
      if (categorias[key].length > 0) {
        mezclados.push(categorias[key].shift());
      }
    }
  }

  return mezclados;
}

const ProductosList = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { query = "" } = useSearch();

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`/api/products`)
      .then((res) => {
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const prods = data.products || [];

        // Aseguramos URLs completas de imágenes
        prods.forEach((p) => {
          if (p.imageUrl && !p.imageUrl.startsWith("http")) {
            p.imageUrl = `${CLOUDINARY_BASE_URL}${p.imageUrl}`;
          }
        });

        // Mezclamos categorías
        const mezclados = mezclarPorCategoria(prods);
        setProductos(mezclados);
      })
      .catch((err) => {
        console.error("Error al cargar productos:", err);
        setError("No se pudieron cargar los productos.");
      })
      .finally(() => setLoading(false));
  }, []);

  const productosFiltrados = query
    ? productos.filter((producto) =>
        producto.nombre.toLowerCase().includes(query.toLowerCase())
      )
    : productos;

  if (loading)
    return <p className="text-center mt-10">Cargando productos...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (productosFiltrados.length === 0)
    return <p className="text-center mt-10">No hay productos que coincidan.</p>;

  // 🔹 Ajuste de placeholders para completar fila visualmente
  const columnas = 3;
  const resto = productosFiltrados.length % columnas;
  const placeholders =
    resto === 0 ? [] : Array(columnas - resto).fill(null);

  return (
    <div id="productos" className="bg-pink-100 min-h-screen py-10 px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {productosFiltrados.map((producto) => {
          producto.precio = parseFloat(producto.precio) || 0;
          return (
            <ProductoCard
              key={producto.id || producto._id}
              producto={producto}
            />
          );
        })}

        {/* Placeholders invisibles para completar la fila */}
        {placeholders.map((_, i) => (
          <div key={`ph-${i}`} className="invisible h-0"></div>
        ))}
      </div>
    </div>
  );
};

export default ProductosList;
