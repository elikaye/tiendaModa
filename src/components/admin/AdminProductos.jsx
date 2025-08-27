// src/components/admin/AdminProductos.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL, CLOUDINARY_BASE_URL } from "../../config.jsx";

const CATEGORIAS = [
  { name: "Ropa", tieneTalles: true, tieneColores: true, tieneMedidas: false },
  { name: "Calzados", tieneTalles: true, tieneColores: true, tieneMedidas: false },
  { name: "Hogar", tieneTalles: true, tieneColores: true, tieneMedidas: true },
  { name: "Electrónica", tieneTalles: false, tieneColores: true, tieneMedidas: true },
  { name: "Maquillaje", tieneTalles: false, tieneColores: true, tieneMedidas: true },
  { name: "Artículos de temporada", tieneTalles: false, tieneColores: true, tieneMedidas: true },
];

const AdminProductos = () => {
  const [productos, setProductos] = useState([]);
  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    imageUrl: "",
    estado: "activo",
    categoria: "",
    subcategoria: "",
    destacados: false,
    talles: "",
    colores: "",
    medidas: "",
  });
  const [editandoId, setEditandoId] = useState(null);
  const [subiendoImagen, setSubiendoImagen] = useState(false);

  const token = localStorage.getItem("token");
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/products`, config);
      const data = Array.isArray(res.data.products) ? res.data.products : Array.isArray(res.data) ? res.data : [];
      setProductos(data);
    } catch (err) {
      console.error("Error al cargar productos:", err);
      alert("No se pudieron cargar los productos.");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProducto((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImagenChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSubiendoImagen(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      setProducto((prev) => ({ ...prev, imageUrl: res.data.secure_url }));
    } catch (err) {
      console.error("Error al subir la imagen:", err);
      alert("No se pudo subir la imagen.");
    } finally {
      setSubiendoImagen(false);
    }
  };

  const resetForm = () => {
    setProducto({
      nombre: "",
      descripcion: "",
      precio: "",
      imageUrl: "",
      estado: "activo",
      categoria: "",
      subcategoria: "",
      destacados: false,
      talles: "",
      colores: "",
      medidas: "",
    });
    setEditandoId(null);
  };

  const guardarProducto = async () => {
    if (!token) return alert("No estás autenticado.");
    const precioFloat = parseFloat(producto.precio);
    if (isNaN(precioFloat) || precioFloat <= 0) return alert("Precio inválido");

    const payload = {
      ...producto,
      price: precioFloat,
      name: producto.nombre,
      description: producto.descripcion,
    };

    try {
      let res;
      if (editandoId) {
        res = await axios.put(`${API_BASE_URL}/products/${editandoId}`, payload, config);
        setProductos((prev) =>
          prev.map((p) => (p.id === editandoId || p._id === editandoId ? res.data || { ...p, ...payload } : p))
        );
      } else {
        res = await axios.post(`${API_BASE_URL}/products`, payload, config);
        setProductos((prev) => [...prev, res.data]);
      }
      resetForm();
    } catch (err) {
      console.error("Error al guardar producto:", err);
      alert("Error al guardar producto.");
    }
  };

  const editarProducto = (p) => {
    setProducto({
      nombre: p.nombre || p.name,
      descripcion: p.descripcion || p.description,
      precio: p.precio || p.price,
      imageUrl: p.imageUrl,
      estado: p.estado,
      categoria: p.categoria,
      subcategoria: p.subcategoria,
      destacados: p.destacados,
      talles: p.talles || "",
      colores: p.colores || "",
      medidas: p.medidas || "",
    });
    setEditandoId(p.id || p._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const eliminarProducto = async (id) => {
    if (!token) return alert("No estás autenticado.");
    try {
      await axios.delete(`${API_BASE_URL}/products/${id}`, config);
      setProductos((prev) => prev.filter((p) => (p.id || p._id) !== id));
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      alert("No se pudo eliminar el producto.");
    }
  };

  const categoriaSeleccionada = CATEGORIAS.find((c) => c.name === producto.categoria);

  return (
    <div className="p-6 pt-32 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">AdminProductos</h2>

      {/* Formulario */}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <input name="nombre" value={producto.nombre} onChange={handleChange} placeholder="Nombre" className="border p-2 rounded w-full" />
        <input name="descripcion" value={producto.descripcion} onChange={handleChange} placeholder="Descripción" className="border p-2 rounded w-full" />
        <input name="precio" value={producto.precio} onChange={handleChange} type="number" step="0.01" placeholder="Precio" className="border p-2 rounded w-full" />
        <input type="file" onChange={handleImagenChange} className="border p-2 rounded w-full" />
        {subiendoImagen && <p className="text-sm text-gray-500 col-span-2">Subiendo imagen...</p>}
        {producto.imageUrl && <img src={producto.imageUrl} alt="Previsualización" className="col-span-1 md:col-span-2 object-contain rounded border p-2" style={{ maxHeight: "150px" }} />}
        <select name="estado" value={producto.estado} onChange={handleChange} className="border p-2 rounded w-full">
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
        <select name="categoria" value={producto.categoria} onChange={handleChange} className="border p-2 rounded w-full">
          <option value="">Seleccionar categoría</option>
          {CATEGORIAS.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
        </select>
        <input name="subcategoria" value={producto.subcategoria} onChange={handleChange} placeholder="Subcategoría" className="border p-2 rounded w-full" />
        <label className="flex items-center gap-2"><input name="destacados" type="checkbox" checked={producto.destacados} onChange={handleChange} /> Destacado</label>

        {categoriaSeleccionada?.tieneTalles && <input name="talles" value={producto.talles} onChange={handleChange} placeholder="Talles (S,M,L)" className="border p-2 rounded w-full" />}
        {categoriaSeleccionada?.tieneColores && <input name="colores" value={producto.colores} onChange={handleChange} placeholder="Colores (rojo, azul)" className="border p-2 rounded w-full" />}
        {categoriaSeleccionada?.tieneMedidas && <input name="medidas" value={producto.medidas} onChange={handleChange} placeholder="Medidas (30x20x15cm)" className="border p-2 rounded w-full" />}
      </div>

      <button onClick={guardarProducto} className={`py-2 px-6 rounded mb-8 text-white ${editandoId ? "bg-violet-600 hover:bg-violet-700" : "bg-pink-600 hover:bg-pink-700"}`}>
        {editandoId ? "Guardar Cambios" : "Crear Producto"}
      </button>

      {/* Listado */}
      <ul className="space-y-6">
        {productos.map((p) => (
          <li key={p.id || p._id} className="flex items-center gap-6 border rounded p-4 shadow-sm">
            <img src={p.imageUrl || "/placeholder.png"} alt={p.nombre || p.name} width="100" className="object-contain rounded" />
            <div className="flex-grow">
              <h3 className="font-semibold text-lg">{p.nombre || p.name}</h3>
              <p className="text-gray-700">{p.descripcion || p.description}</p>
              <p className="font-bold text-pink-600">${p.precio || p.price}</p>
              <p>Estado: {p.estado}</p>
              <p>Categoría: {p.categoria}</p>
              <p>Subcategoría: {p.subcategoria}</p>
              {p.talles && <p>Talles: {p.talles}</p>}
              {p.colores && <p>Colores: {p.colores}</p>}
              {p.medidas && <p>Medidas: {p.medidas}</p>}
              <p>Destacado: {p.destacados ? "Sí" : "No"}</p>
            </div>
            <button onClick={() => editarProducto(p)} className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700 transition mr-2">Editar</button>
            <button onClick={() => eliminarProducto(p.id || p._id)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminProductos;
