import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

const AdminProductos = () => {
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    imageUrl: '',
    estado: 'activo',
    categoria: '',
    subcategoria: '',
    destacados: false,
  });

  // Base URL para las imágenes
  const baseUrlBackend = API_BASE_URL.split('/api/v1')[0];

  // Tomamos el token guardado en localStorage (modificá si lo guardás en otro lado)
  const token = localStorage.getItem('token');
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
    try {
      const respuesta = await axios.get(`${API_BASE_URL}/products`);
      setProductos(respuesta.data.products || respuesta.data);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  };

  const crearProducto = async () => {
    try {
      const precioFloat = parseFloat(nuevoProducto.precio);
      if (isNaN(precioFloat) || precioFloat <= 0) {
        alert('Por favor ingresa un precio válido mayor que 0');
        return;
      }
      const productoAEnviar = { ...nuevoProducto, precio: precioFloat };

      const respuesta = await axios.post(`${API_BASE_URL}/products`, productoAEnviar, config);
      setProductos([...productos, respuesta.data]);
      setNuevoProducto({
        nombre: '',
        descripcion: '',
        precio: '',
        imageUrl: '',
        estado: 'activo',
        categoria: '',
        subcategoria: '',
        destacados: false,
      });
    } catch (error) {
      console.error('Error al crear el producto:', error);
    }
  };

  const eliminarProducto = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/products/${id}`, config);
      setProductos(productos.filter((producto) => (producto.id || producto._id) !== id));
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Administrador de Productos</h2>

      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Nombre"
          value={nuevoProducto.nombre}
          onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Descripción"
          value={nuevoProducto.descripcion}
          onChange={(e) => setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Precio"
          value={nuevoProducto.precio}
          onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })}
          className="border p-2 rounded"
          step="0.01"
          min="0"
        />
        <input
          type="text"
          placeholder="URL de imagen"
          value={nuevoProducto.imageUrl}
          onChange={(e) => setNuevoProducto({ ...nuevoProducto, imageUrl: e.target.value })}
          className="border p-2 rounded"
        />
        <select
          value={nuevoProducto.estado}
          onChange={(e) => setNuevoProducto({ ...nuevoProducto, estado: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
        <input
          type="text"
          placeholder="Categoría"
          value={nuevoProducto.categoria}
          onChange={(e) => setNuevoProducto({ ...nuevoProducto, categoria: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Subcategoría"
          value={nuevoProducto.subcategoria}
          onChange={(e) => setNuevoProducto({ ...nuevoProducto, subcategoria: e.target.value })}
          className="border p-2 rounded"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={nuevoProducto.destacados}
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, destacados: e.target.checked })}
          />
          Destacado
        </label>
      </div>

      <button
        onClick={crearProducto}
        className="bg-pink-600 text-white py-2 px-6 rounded hover:bg-pink-700 transition mb-8"
      >
        Crear Producto
      </button>

      <ul className="space-y-6">
        {productos.map((producto) => {
          // Construir URL imagen correcta
          const imagePath = producto.imageUrl?.startsWith('/product/')
            ? producto.imageUrl.substring(9)
            : producto.imageUrl;

          const imgSrc = producto.imageUrl
            ? `${baseUrlBackend}/product/${imagePath}`
            : '/placeholder.png';

          return (
            <li
              key={producto.id || producto._id}
              className="flex items-center gap-6 border rounded p-4 shadow-sm"
            >
              <img
                src={imgSrc}
                alt={producto.nombre}
                width="100"
                className="object-contain rounded"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/placeholder.png';
                }}
              />
              <div className="flex-grow">
                <h3 className="font-semibold text-lg">{producto.nombre}</h3>
                <p className="text-gray-700">{producto.descripcion}</p>
                <p className="font-bold text-pink-600">${producto.precio}</p>
                <p>Estado: {producto.estado}</p>
                <p>Categoría: {producto.categoria}</p>
                <p>Subcategoría: {producto.subcategoria}</p>
                <p>Destacado: {producto.destacados ? 'Sí' : 'No'}</p>
              </div>
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
