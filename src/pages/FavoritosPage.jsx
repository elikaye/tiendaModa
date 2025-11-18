
// src/pages/FavoritosPage.jsx
import React from "react";
import { useFavoritos } from "../context/FavoritosContext";
import ProductoCard from "../components/ProductoCard";

const FavoritosPage = () => {
  const { favoritos, loading } = useFavoritos();

  if (loading) return <p className="text-center mt-10">Cargando favoritos...</p>;

  // 1) Filtramos productos "vacíos" que podrían no tener id
  const favoritosLimpios = (favoritos || []).filter(
    (p) => p && (p.id !== undefined && p.id !== null)
  );

  if (!favoritosLimpios || favoritosLimpios.length === 0)
    return <p className="text-center mt-10">No tenés favoritos aún 😢</p>;

  return (
    // 2) Wrapper que compensa navbar fija y evita que las cards pisen el footer.
    //    Ajustá los valores (marginTop / marginBottom) al alto real de tu navbar/footer.
    <div
      className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      style={{
        // el marginTop debe aproximar la altura de tu navbar fija (ajustalo si es necesario)
        marginTop: "110px",
        // evita que las cards se monten sobre el footer
        marginBottom: "120px",
        // garantizamos al menos la altura de pantalla para que el footer quede abajo
        minHeight: "calc(100vh - 160px)",
      }}
    >
      {favoritosLimpios.map((producto, index) => (
        // 3) Key segura: usa id si existe, si no usa índice único
        <ProductoCard
          key={producto.id ?? `fav-${index}`}
          producto={producto}
        />
      ))}
    </div>
  );
};

export default FavoritosPage;
