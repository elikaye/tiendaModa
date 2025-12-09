
import React, { useEffect, useState } from "react";
import ProductoCard from "./ProductoCard";
import { useSearch } from "../context/SearchContext";
import { CLOUDINARY_BASE_URL } from "../config";

// 🔵 Normaliza categorías en pocas opciones reales
function normalizarCategoria(catRaw) {
  if (!catRaw) return "otros";

  const cat = catRaw.trim().toLowerCase();

  if (cat.includes("ropa") || cat.includes("remera") || cat.includes("pantal"))
    return "ropa";
  if (cat.includes("zapa") || cat.includes("calza") || cat.includes("bot"))
    return "calzado";
  if (cat.includes("electr")) return "electronica";
  if (cat.includes("maqu") || cat.includes("make") || cat.includes("cosme"))
    return "maquillaje";
  if (cat.includes("hogar") || cat.includes("cocina") || cat.includes("decor"))
    return "hogar";
  if (
    cat.includes("tempor") ||
    cat.includes("nav") ||
    cat.includes("verano") ||
    cat.includes("invie")
  )
    return "temporada";

  return "otros"; // fallback
}

// 🔵 Mezcla equilibrada de categorías
function mezclarBalanceado(grupos) {
  const categorias = Object.keys(grupos);
  const resultado = [];
  let restos = true;

  while (restos) {
    restos = false;

    // orden dinámico aleatorio en cada ronda
    const orden = [...categorias].sort(() => Math.random() - 0.5);

    for (const cat of orden) {
      if (grupos[cat].length > 0) {
        resultado.push(grupos[cat].shift());
        restos = true;
      }
    }
  }

  return resultado;
}

const ProductosList = () => {
  const { query = "" } = useSearch();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    fetch(`http://localhost:5000/api/v1/productos`)
      .then((res) => res.json())
      .then((data) => {
        // Acepta ambos casos: { products: [] } o []
        let prods = data.products || data || [];

        // 🔵 normalizar todos los productos
        prods = prods.map((p) => ({
          ...p,
          id: p.id || p._id,
          categoria: normalizarCategoria(p.categoria),
          precio: parseFloat(p.precio) || 0,
          imageUrl:
            p.imageUrl && !p.imageUrl.startsWith("http")
              ? `${CLOUDINARY_BASE_URL}${p.imageUrl}`
              : p.imageUrl,
        }));

        // 🔵 agrupar por categoría ya normalizada
        const grupos = {};
        for (const p of prods) {
          if (!grupos[p.categoria]) grupos[p.categoria] = [];
          grupos[p.categoria].push(p);
        }

        // 🔵 mezcla real
        const mezclados = mezclarBalanceado(grupos);

        // 🔵 evita filas incompletas (3 columnas)
        const columnas = 3;
        const resto = mezclados.length % columnas;

        if (resto === 1 && mezclados.length > 1) {
          const ultimo = mezclados.pop();
          const pos = Math.floor(Math.random() * (mezclados.length - 1));
          mezclados.splice(pos, 0, ultimo);
        }

        setProductos(mezclados);
      })
      .catch(() => setError("No se pudieron cargar los productos"))
      .finally(() => setLoading(false));
  }, []);

  // 🔍 buscador
  const productosFiltrados = query
    ? productos.filter((p) =>
        p.nombre?.toLowerCase().includes(query.toLowerCase())
      )
    : productos;

  if (loading)
    return <p className="text-center mt-10">Cargando productos...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-600">{error}</p>;

  const columnas = 3;
  const resto = productosFiltrados.length % columnas;
  const placeholders = resto === 0 ? [] : Array(columnas - resto).fill(null);

  return (
    <div className="bg-pink-100 min-h-screen py-10 px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md-grid-cols-3 gap-8">
        {productosFiltrados.map((producto) => (
          <ProductoCard key={producto.id} producto={producto} />
        ))}

        {placeholders.map((_, i) => (
          <div key={`ph-${i}`} className="invisible h-0"></div>
        ))}
      </div>
    </div>
  );
};

export default ProductosList;
