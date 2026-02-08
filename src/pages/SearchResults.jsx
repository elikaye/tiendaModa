// src/pages/SearchResults.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../context/SearchContext";
import ProductoCard from "../components/ProductoCard";
import { CLOUDINARY_BASE_URL } from "../config";

const FILAS_MOBILE = 4;
const COLUMNAS_MOBILE = 4;
const MAX_PRODUCTOS = FILAS_MOBILE * COLUMNAS_MOBILE;

const normalizar = (texto = "") =>
  texto
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const chunkArray = (arr, size) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

export default function SearchResults() {
  const { query } = useSearch();
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  // 👇 NUEVO: controlar si se muestran todos en mobile
  const [verTodosMobile, setVerTodosMobile] = useState(false);

  // 🔁 si se borra la búsqueda → volvemos al inicio (NO SE TOCA)
  useEffect(() => {
    if (!query || query.trim() === "") {
      navigate("/");
    }
  }, [query, navigate]);

  useEffect(() => {
    const fetchProductos = async () => {
      const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:5000";

      const res = await fetch(`${API_URL}/api/v1/products?limit=1000`);
      const data = await res.json();

      const adaptados = (data.products || []).map((p) => ({
        ...p,
        id: p.id || p._id,
        imageUrl:
          p.imageUrl && !p.imageUrl.startsWith("http")
            ? `${CLOUDINARY_BASE_URL}${p.imageUrl}`
            : p.imageUrl,
        precio: parseFloat(p.precio) || 0,
      }));

      setProductos(adaptados);
      setLoading(false);
    };

    fetchProductos();
  }, []);

  const resultados = useMemo(() => {
    if (!query) return [];

    const q = normalizar(query);

    return productos.filter(
      (p) =>
        normalizar(p.nombre).includes(q) ||
        normalizar(p.categoria).includes(q)
    );
  }, [query, productos]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4 py-10 text-center text-gray-500">
        Buscando productos…
      </div>
    );
  }

  if (resultados.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-10 text-center text-gray-600">
        <p>No se encontraron productos para “{query}”</p>
      </div>
    );
  }

  // 📱 MOBILE
  const productosMobile = verTodosMobile
    ? resultados
    : resultados.slice(0, MAX_PRODUCTOS);

  const filasMobile = chunkArray(productosMobile, COLUMNAS_MOBILE);
  const hayMasResultados = resultados.length > MAX_PRODUCTOS;

  return (
    <div className="bg-pink-100 min-h-screen py-6 px-4">
      <h2 className="text-lg font-bold mb-4">
        Resultados para “{query}”
      </h2>

      {/* 📱 MOBILE: filas con scroll horizontal */}
      <div className="sm:hidden space-y-4">
        {filasMobile.map((fila, index) => (
          <div
            key={index}
            className="flex space-x-4 overflow-x-auto pb-2"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {fila.map((p) => (
              <div
                key={p.id}
                className="flex-shrink-0 w-64"
                style={{ scrollSnapAlign: "start" }}
              >
                <ProductoCard producto={p} />
              </div>
            ))}
          </div>
        ))}

        {/* 👉 BOTÓN VER MÁS (solo mobile y solo si hace falta) */}
        {!verTodosMobile && hayMasResultados && (
          <div className="text-center pt-4">
            <button
              onClick={() => setVerTodosMobile(true)}
              className="px-6 py-2 bg-pink-500 text-white rounded-full font-semibold hover:bg-pink-600 transition"
            >
              Ver más resultados
            </button>
          </div>
        )}
      </div>

      {/* 🖥 DESKTOP: grid normal (NO SE TOCA) */}
      <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {resultados.map((p) => (
          <ProductoCard key={p.id} producto={p} />
        ))}
      </div>
    </div>
  );
}
