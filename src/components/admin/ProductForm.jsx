
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

const AdminProductos = () => {
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    estado: 'activo',
    categoria: '',
    subcategoria: '',
    destacados: false,
  });

  // Base URL para imágenes
  const baseUrlBackend = API_BASE_URL.split('/api/v1')[0];

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
      // Validar que los campos requeridos no estén vacíos
      if (!nuevoProducto.name || !nuevoProducto.description || !nuevoProducto.price) {
        alert('Por favor completa todos los campos obligatorios');
        return;
      }

      const respuesta = await axios.post(`${API_BASE_URL}/products`, nuevoProducto);
      setProductos([...productos, respuesta.data]);
      setNuevoProducto({
        name: '',
        description: '',
        price: '',
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
      await axios.delete(`${API_BASE_URL}/products/${id}`);
      setProductos(productos.filter((producto) => producto.id !== id && producto._id !== id));
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Administrador de Productos</h2>

      {/* Formulario creación */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Nombre"
          value={nuevoProducto.name}
          onChange={(e) => setNuevoProducto({ ...nuevoProducto, name: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Descripción"
          value={nuevoProducto.description}
          onChange={(e) => setNuevoProducto({ ...nuevoProducto, description: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="Precio"
          value={nuevoProducto.price}
          onChange={(e) => setNuevoProducto({ ...nuevoProducto, price: e.target.value })}
          className="border p-2 rounded"
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
        <div className="flex items-center gap-2">
          <label>
            <input
              type="checkbox"
              checked={nuevoProducto.destacados}
              onChange={(e) => setNuevoProducto({ ...nuevoProducto, destacados: e.target.checked })}
              className="mr-1"
            />
            Destacado
          </label>
        </div>
      </div>

      <button
        onClick={crearProducto}
        className="bg-pink-600 text-white py-2 px-6 rounded hover:bg-pink-700 transition mb-8"
      >
        Crear Producto
      </button>

      {/* Listado de productos */}
      <ul className="space-y-6">
        {productos.map((producto) => {
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
                alt={producto.name}
                width="100"
                className="object-contain rounded"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/placeholder.png';
                }}
              />
              <div className="flex-grow grid grid-cols-2 gap-2">
                <div>
                  <h3 className="font-semibold text-lg">{producto.name}</h3>
                  <p className="text-gray-700 text-sm">{producto.description}</p>
                  <p className="font-bold text-pink-600">${producto.price}</p>
                </div>
                <div className="text-gray-600 text-sm space-y-1">
                  <p><strong>Estado:</strong> {producto.estado || 'N/A'}</p>
                  <p><strong>Categoría:</strong> {producto.categoria || 'N/A'}</p>
                  <p><strong>Subcategoría:</strong> {producto.subcategoria || 'N/A'}</p>
                  <p><strong>Destacado:</strong> {producto.destacados ? 'Sí' : 'No'}</p>
                </div>
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
