import React, { useState } from "react";
import AdminProductos from "./AdminProductos";
import AdminUsuarios from "./AdminUsuarios";

const AdminDashboard = () => {
  const [tab, setTab] = useState("productos"); // 'productos' o 'usuarios'

  return (
    <div className="p-6 pt-32 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setTab("productos")}
          className={`py-2 px-4 font-semibold ${
            tab === "productos"
              ? "border-b-2 border-violet-600 text-violet-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Productos
        </button>
        <button
          onClick={() => setTab("usuarios")}
          className={`py-2 px-4 font-semibold ${
            tab === "usuarios"
              ? "border-b-2 border-violet-600 text-violet-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Usuarios
        </button>
      </div>

      {/* Contenido */}
      <div>
        {tab === "productos" && <AdminProductos />}
        {tab === "usuarios" && <AdminUsuarios />}
      </div>
    </div>
  );
};

export default AdminDashboard;
