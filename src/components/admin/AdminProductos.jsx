import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config";

const AdminProductos = () => {
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    imageUrl: "",
    estado: "activo",
    categoria: "",
    subcategoria: "",
    destacados: false,
  });
  const [editandoId, setEditandoId] = useState(null);

  const token = localStorage.getItem("token");
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const baseUrlBackend = API_BASE_URL.split("/api/v1")[0];

  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
    try {
      console.log("Token usado en GET:", token);
      const respuesta = await axios.get(`${API_BASE_URL}/products`, config);
      const productosData = Array.isArray(respuesta.data.products)
        ? respuesta.data.products
        : Array.isArray(respuesta.data)
        ? respuesta.data
        : [];
      setProductos(productosData);
    } catch (error) {
      console.error("Error al obtener los productos:", error.response || error);
      alert("No se pudieron cargar los productos.");
    }
  };

  const crearProducto = async () => {
    if (!token) {
      alert("No estás autenticado para crear productos.");
      return;
    }

    const precioFloat = parseFloat(nuevoProducto.precio);
    if (isNaN(precioFloat) || precioFloat <= 0) {
      alert("Por favor ingresa un precio válido mayor que 0.");
      return;
    }

    const productoAEnviar = {
      name: nuevoProducto.nombre,
      description: nuevoProducto.descripcion,
      price: precioFloat,
      imageUrl: nuevoProducto.imageUrl,
      estado: nuevoProducto.estado,
      categoria: nuevoProducto.categoria,
      subcategoria: nuevoProducto.subcategoria,
      destacados: nuevoProducto.destacados,
    };

    try {
      console.log("Token usado en POST:", token);
      const respuesta = await axios.post(
        `${API_BASE_URL}/products`,
        productoAEnviar,
        config
      );
      setProductos((prev) => [...prev, respuesta.data]);
      resetForm();
    } catch (error) {
      console.error("Error al crear el producto:", error.response || error);
      alert("Error al crear el producto.");
    }
  };

  const editarProducto = (producto) => {
    setNuevoProducto({
      nombre: producto.nombre || producto.name,
      descripcion: producto.descripcion || producto.description,
      precio: producto.precio || producto.price,
      imageUrl: producto.imageUrl,
      estado: producto.estado,
      categoria: producto.categoria,
      subcategoria: producto.subcategoria,
      destacados: producto.destacados,
    });
    setEditandoId(producto.id || producto._id);
  };

  const actualizarProducto = async () => {
    if (!token) {
      alert("No estás autenticado para editar productos.");
      return;
    }

    const precioFloat = parseFloat(nuevoProducto.precio);
    if (isNaN(precioFloat) || precioFloat <= 0) {
      alert("Por favor ingresa un precio válido mayor que 0.");
      return;
    }

    const productoAEnviar = {
      name: nuevoProducto.nombre,
      description: nuevoProducto.descripcion,
      price: precioFloat,
      imageUrl: nuevoProducto.imageUrl,
      estado: nuevoProducto.estado,
      categoria: nuevoProducto.categoria,
      subcategoria: nuevoProducto.subcategoria,
      destacados: nuevoProducto.destacados,
    };

    try {
      console.log("Token usado en PUT:", token);
      const respuesta = await axios.put(
        `${API_BASE_URL}/products/${editandoId}`,
        productoAEnviar,
        config
      );
      // Si la respuesta trae el producto actualizado, úsalo; si no, actualiza localmente
      setProductos((prev) =>
        prev.map((p) =>
          (p.id || p._id) === editandoId
            ? respuesta.data || { ...p, ...productoAEnviar }
            : p
        )
      );
      resetForm();
      setEditandoId(null);
    } catch (error) {
      console.error("Error al actualizar el producto:", error.response || error);
      alert("Error al actualizar el producto.");
    }
  };

  const eliminarProducto = async (id) => {
    if (!token) {
      alert("No estás autenticado para eliminar productos.");
      return;
    }

    try {
      console.log("Token usado en DELETE:", token);
      await axios.delete(`${API_BASE_URL}/products/${id}`, config);
      setProductos((prev) => prev.filter((p) => (p.id ?? p._id) !== id));
    } catch (error) {
      console.error("Error al eliminar producto:", error.response || error);
      alert("Error al eliminar el producto.");
    }
  };

  const resetForm = () => {
    setNuevoProducto({
      nombre: "",
      descripcion: "",
      precio: "",
      imageUrl: "",
      estado: "activo",
      categoria: "",
      subcategoria: "",
      destacados: false,
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Administrador de Productos</h2>

      {/* Formulario para nuevo producto o edición */}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Nombre"
          value={nuevoProducto.nombre}
          onChange={(e) =>
            setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })
          }
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Descripción"
          value={nuevoProducto.descripcion}
          onChange={(e) =>
            setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })
          }
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Precio"
          value={nuevoProducto.precio}
          onChange={(e) =>
            setNuevoProducto({ ...nuevoProducto, precio: e.target.value })
          }
          className="border p-2 rounded"
          step="0.01"
          min="0"
        />
        <input
          type="text"
          placeholder="URL de imagen"
          value={nuevoProducto.imageUrl}
          onChange={(e) =>
            setNuevoProducto({ ...nuevoProducto, imageUrl: e.target.value })
          }
          className="border p-2 rounded"
        />
        <select
          value={nuevoProducto.estado}
          onChange={(e) =>
            setNuevoProducto({ ...nuevoProducto, estado: e.target.value })
          }
          className="border p-2 rounded"
        >
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
        <input
          type="text"
          placeholder="Categoría"
          value={nuevoProducto.categoria}
          onChange={(e) =>
            setNuevoProducto({ ...nuevoProducto, categoria: e.target.value })
          }
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Subcategoría"
          value={nuevoProducto.subcategoria}
          onChange={(e) =>
            setNuevoProducto({ ...nuevoProducto, subcategoria: e.target.value })
          }
          className="border p-2 rounded"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={nuevoProducto.destacados}
            onChange={(e) =>
              setNuevoProducto({ ...nuevoProducto, destacados: e.target.checked })
            }
          />
          Destacado
        </label>
      </div>

      {/* Botón crear o actualizar según modo */}
      {editandoId ? (
        <button
          onClick={actualizarProducto}
          className="bg-violet-600 text-white py-2 px-6 rounded hover:bg-violet-700 transition mb-8"
        >
          Guardar Cambios
        </button>
      ) : (
        <button
          onClick={crearProducto}
          className="bg-pink-600 text-white py-2 px-6 rounded hover:bg-pink-700 transition mb-8"
        >
          Crear Producto
        </button>
      )}

      {/* Lista de productos */}
      <ul className="space-y-6">
        {productos.map((producto) => {
          const imagePath =
            producto.imageUrl && producto.imageUrl.startsWith("/product/")
              ? producto.imageUrl.substring(9)
              : producto.imageUrl;

          const imgSrc = producto.imageUrl
            ? `${baseUrlBackend}/product/${imagePath}`
            : "/placeholder.png";

          return (
            <li
              key={producto.id || producto._id}
              className="flex items-center gap-6 border rounded p-4 shadow-sm"
            >
              <img
                src={imgSrc}
                alt={producto.nombre || producto.name}
                width="100"
                className="object-contain rounded"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/placeholder.png";
                }}
              />
              <div className="flex-grow">
                <h3 className="font-semibold text-lg">
                  {producto.nombre || producto.name}
                </h3>
                <p className="text-gray-700">
                  {producto.descripcion || producto.description}
                </p>
                <p className="font-bold text-pink-600">
                  ${producto.precio || producto.price}
                </p>
                <p>Estado: {producto.estado}</p>
                <p>Categoría: {producto.categoria}</p>
                <p>Subcategoría: {producto.subcategoria}</p>
                <p>Destacado: {producto.destacados ? "Sí" : "No"}</p>
              </div>

              {/* Botón Editar */}
              <button
                onClick={() => editarProducto(producto)}
                className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700 transition mr-2"
              >
                Editar
              </button>

              {/* Botón Eliminar */}
              <button
                onClick={() => eliminarProducto(producto.id || producto._id)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Eliminar
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AdminProductos;
