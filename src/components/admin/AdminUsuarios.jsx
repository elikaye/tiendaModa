import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config.jsx";

const ROLES = ["cliente", "admin"];

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuario, setUsuario] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "cliente",
  });
  const [editandoId, setEditandoId] = useState(null);

  const token = localStorage.getItem("token");
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users`, config);
      const data = Array.isArray(res.data) ? res.data : res.data.users || [];
      setUsuarios(data);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
      alert("No se pudieron cargar los usuarios.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setUsuario({
      nombre: "",
      email: "",
      password: "",
      rol: "cliente",
    });
    setEditandoId(null);
  };

  const guardarUsuario = async () => {
    if (!token) return alert("No estás autenticado.");
    if (!usuario.nombre || !usuario.email) return alert("Nombre y email obligatorios.");

    const payload = {
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    };

    // Solo enviar password si es nuevo o se modificó
    if (usuario.password) payload.password = usuario.password;

    try {
      let res;
      if (editandoId) {
        res = await axios.put(`${API_BASE_URL}/users/${editandoId}`, payload, config);
        setUsuarios((prev) =>
          prev.map((u) => (u.id === editandoId ? res.data || { ...u, ...payload } : u))
        );
      } else {
        res = await axios.post(`${API_BASE_URL}/users`, payload, config);
        setUsuarios((prev) => [...prev, res.data]);
      }
      resetForm();
    } catch (err) {
      console.error("Error al guardar usuario:", err);
      alert("Error al guardar usuario.");
    }
  };

  const editarUsuario = (u) => {
    setUsuario({
      nombre: u.nombre,
      email: u.email,
      password: "", // nunca mostrar password real
      rol: u.rol,
    });
    setEditandoId(u.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const eliminarUsuario = async (id) => {
    if (!token) return alert("No estás autenticado.");
    if (!window.confirm("¿Seguro querés eliminar este usuario?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/users/${id}`, config);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      alert("No se pudo eliminar el usuario.");
    }
  };

  return (
    <div className="p-6 pt-32 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">AdminUsuarios</h2>

      {/* Formulario */}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <input
          name="nombre"
          value={usuario.nombre}
          onChange={handleChange}
          placeholder="Nombre"
          className="border p-2 rounded w-full"
        />
        <input
          name="email"
          value={usuario.email}
          onChange={handleChange}
          placeholder="Email"
          type="email"
          className="border p-2 rounded w-full"
        />
        <input
          name="password"
          value={usuario.password}
          onChange={handleChange}
          placeholder={editandoId ? "Nueva contraseña (opcional)" : "Contraseña"}
          type="password"
          className="border p-2 rounded w-full"
        />
        <select
          name="rol"
          value={usuario.rol}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={guardarUsuario}
        className={`py-2 px-6 rounded mb-8 text-white ${
          editandoId ? "bg-violet-600 hover:bg-violet-700" : "bg-pink-600 hover:bg-pink-700"
        }`}
      >
        {editandoId ? "Guardar Cambios" : "Crear Usuario"}
      </button>

      {/* Listado */}
      <ul className="space-y-6">
        {usuarios.map((u) => (
          <li key={u.id} className="flex items-center gap-6 border rounded p-4 shadow-sm">
            <div className="flex-grow">
              <h3 className="font-semibold text-lg">{u.nombre}</h3>
              <p>Email: {u.email}</p>
              <p>Rol: {u.rol}</p>
              <p>Creado: {new Date(u.createdAt).toLocaleString()}</p>
              <p>Actualizado: {new Date(u.updatedAt).toLocaleString()}</p>
            </div>
            <button
              onClick={() => editarUsuario(u)}
              className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700 transition mr-2"
            >
              Editar
            </button>
            <button
              onClick={() => eliminarUsuario(u.id)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminUsuarios;
