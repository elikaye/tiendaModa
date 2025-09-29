import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL, CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "../../config.jsx";

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
    nombre: "", descripcion: "", precio: "", imageUrl: "", imagePublicId: "",
    estado: "activo", categoria: "", subcategoria: "", destacados: false,
    talles: "", colores: "", medidas: ""
  });
  const [editandoId, setEditandoId] = useState(null);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const productosPorPagina = 10;

  const token = localStorage.getItem("token");
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

  // ✅ Traer productos desde backend
  const fetchProductos = async (page = 1, search = "") => {
    try {
      const res = await axios.get(`${API_BASE_URL}/products?page=${page}&limit=${productosPorPagina}&search=${search}`, config);
      setProductos(res.data.products);
      setPagina(res.data.currentPage);
      setTotalPaginas(res.data.totalPages);
    } catch (err) {
      console.error("Error al cargar productos:", err);
      alert("No se pudieron cargar los productos.");
    }
  };

  useEffect(() => { fetchProductos(); }, []);

  // 🔎 Buscar en vivo
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProductos(1, busqueda);
    }, 300); // delay para no spamear el backend
    return () => clearTimeout(delayDebounce);
  }, [busqueda]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProducto(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
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
      setProducto(prev => ({ ...prev, imageUrl: res.data.secure_url, imagePublicId: res.data.public_id }));
    } catch (err) {
      console.error("Error al subir imagen:", err);
      alert("No se pudo subir la imagen.");
    } finally { setSubiendoImagen(false); }
  };

  const resetForm = () => {
    setProducto({ nombre:"", descripcion:"", precio:"", imageUrl:"", imagePublicId:"", estado:"activo", categoria:"", subcategoria:"", destacados:false, talles:"", colores:"", medidas:"" });
    setEditandoId(null);
  };

  const guardarProducto = async () => {
    if (!token) return alert("No estás autenticado.");
    const precioFloat = parseFloat(producto.precio.toString().replace(/\./g,"").replace(",", "."));
    if (isNaN(precioFloat) || precioFloat <= 0) return alert("Precio inválido");

    const payload = { ...producto, precio: precioFloat, subcategoria: producto.subcategoria || null, talles: producto.talles || null, colores: producto.colores || null, medidas: producto.medidas || null };

    try {
      let res;
      if (editandoId) {
        res = await axios.put(`${API_BASE_URL}/products/${editandoId}`, payload, config);
      } else {
        res = await axios.post(`${API_BASE_URL}/products`, payload, config);
      }
      resetForm();
      fetchProductos(pagina, busqueda);
    } catch (err) {
      console.error("Error al guardar producto:", err.response || err);
      alert("Error al guardar producto.");
    }
  };

  const editarProducto = (p) => {
    setProducto({ ...p, talles: p.talles||"", colores: p.colores||"", medidas: p.medidas||"", subcategoria: p.subcategoria||"" });
    setEditandoId(p.id);
    window.scrollTo({ top:0, behavior:"smooth" });
  };

  const eliminarProducto = async (id) => {
    if (!token) return alert("No estás autenticado.");
    try {
      await axios.delete(`${API_BASE_URL}/products/${id}`, config);
      fetchProductos(pagina, busqueda);
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      alert("No se pudo eliminar el producto.");
    }
  };

  const categoriaSeleccionada = CATEGORIAS.find(c => c.name === producto.categoria);

  return (
    <div className="p-6 pt-32 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">AdminProductos</h2>

      {/* Formulario */}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <input name="nombre" value={producto.nombre} onChange={handleChange} placeholder="Nombre" className="border p-2 rounded w-full"/>
        <input name="descripcion" value={producto.descripcion} onChange={handleChange} placeholder="Descripción" className="border p-2 rounded w-full"/>
        <input name="precio" value={producto.precio} onChange={handleChange} placeholder="Precio" className="border p-2 rounded w-full"/>
        <input type="file" onChange={handleImagenChange} className="border p-2 rounded w-full"/>
        {subiendoImagen && <p className="text-sm text-gray-500 col-span-2">Subiendo imagen...</p>}
        {producto.imageUrl && <img src={producto.imageUrl} alt="Previsualización" className="col-span-1 md:col-span-2 object-contain rounded border p-2" style={{maxHeight:"150px"}} />}
        <select name="estado" value={producto.estado} onChange={handleChange} className="border p-2 rounded w-full">
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
        <select name="categoria" value={producto.categoria} onChange={handleChange} className="border p-2 rounded w-full">
          <option value="">Seleccionar categoría</option>
          {CATEGORIAS.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
        </select>
        <input name="subcategoria" value={producto.subcategoria} onChange={handleChange} placeholder="Subcategoría" className="border p-2 rounded w-full"/>
        <label className="flex items-center gap-2">
          <input name="destacados" type="checkbox" checked={producto.destacados} onChange={handleChange}/> Destacado
        </label>
        {categoriaSeleccionada?.tieneTalles && <input name="talles" value={producto.talles} onChange={handleChange} placeholder="Talles" className="border p-2 rounded w-full"/>}
        {categoriaSeleccionada?.tieneColores && <input name="colores" value={producto.colores} onChange={handleChange} placeholder="Colores" className="border p-2 rounded w-full"/>}
        {categoriaSeleccionada?.tieneMedidas && <input name="medidas" value={producto.medidas} onChange={handleChange} placeholder="Medidas" className="border p-2 rounded w-full"/>}
      </div>

      <button onClick={guardarProducto} className={`py-2 px-6 rounded mb-8 text-white ${editandoId?"bg-violet-600 hover:bg-violet-700":"bg-pink-600 hover:bg-pink-700"}`}>
        {editandoId ? "Guardar Cambios" : "Crear Producto"}
      </button>

      {/* 🔎 Buscador */}
      <div className="mb-6">
        <input type="text" value={busqueda} onChange={(e)=>setBusqueda(e.target.value)} placeholder="Buscar producto..." className="border p-2 rounded w-full"/>
      </div>

      {/* Listado */}
      <ul className="space-y-6">
        {productos.map(p => (
          <li key={p.id} className="flex items-center gap-6 border rounded p-4 shadow-sm">
            <img src={p.imageUrl||"/placeholder.png"} alt={p.nombre} width="100" className="object-contain rounded"/>
            <div className="flex-grow">
              <h3 className="font-semibold text-lg">{p.nombre}</h3>
              <p>{p.descripcion}</p>
              <p className="font-bold text-pink-600">${parseFloat(p.precio).toLocaleString()}</p>
              <p>Estado: {p.estado}</p>
              <p>Categoría: {p.categoria}</p>
              <p>Subcategoría: {p.subcategoria}</p>
              {p.talles && <p>Talles: {p.talles}</p>}
              {p.colores && <p>Colores: {p.colores}</p>}
              {p.medidas && <p>Medidas: {p.medidas}</p>}
              <p>Destacado: {p.destacados?"Sí":"No"}</p>
            </div>
            <button onClick={() => editarProducto(p)} className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700 transition mr-2">
              Editar
            </button>
            <button onClick={() => eliminarProducto(p.id)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            disabled={pagina === 1}
            onClick={() => fetchProductos(pagina - 1, busqueda)}
            className="px-3 py-1 border rounded hover:bg-gray-200"
          >
            Anterior
          </button>

          {Array.from({ length: totalPaginas }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => fetchProductos(i + 1, busqueda)}
              className={`px-3 py-1 border rounded ${pagina === i + 1 ? "bg-gray-300" : "hover:bg-gray-200"}`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={pagina === totalPaginas}
            onClick={() => fetchProductos(pagina + 1, busqueda)}
            className="px-3 py-1 border rounded hover:bg-gray-200"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminProductos;
