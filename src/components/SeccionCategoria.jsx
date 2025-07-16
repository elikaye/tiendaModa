import React, { useEffect, useState } from "react";
import ProductoCard from "./ProductoCard";

function SeccionCategoria({ categoria, titulo }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/v1/products?categoria=${categoria}&limit=3`);
        const data = await res.json();
        setProductos(data.products);
      } catch (error) {
        console.error(`Error al cargar productos de ${categoria}:`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, [categoria]);

  if (loading) return <p>Cargando {titulo}...</p>;
  if (productos.length === 0) return <p>No hay productos en {titulo}.</p>;

  return (
    <section className="py-8 px-6">
      <h2 className="text-2xl font-bold mb-6">{titulo}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {productos.map(p => (
          <ProductoCard key={p.id} producto={p} />
        ))}
      </div>
    </section>
  );
}

export default SeccionCategoria;
