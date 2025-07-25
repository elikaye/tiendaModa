// src/components/Admin/AdminProductos.jsx

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
  });

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
      const respuesta = await axios.post(`${API_BASE_URL}/products`, nuevoProducto);
      setProductos([...productos, respuesta.data]);
      setNuevoProducto({ name: '', description: '', price: '', imageUrl: '' });
    } catch (error) {
      console.error('Error al crear el producto:', error);
    }
  };

  const eliminarProducto = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/products/${id}`);
      setProductos(productos.filter((producto) => producto.id !== id));
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };

  return (
    <div>
      <h2>Administrador de Productos</h2>
      <div>
        <input
          type="text"
          placeholder="Nombre"
          value={nuevoProducto.name}
          onChange={(e) => setNuevoProducto({ ...nuevoProducto, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Descripción"
          value={nuevoProducto.description}
          onChange={(e) => setNuevoProducto({ ...nuevoProducto, description: e.target.value })}
        />
        <input
          type="number"
          placeholder="Precio"
          value={nuevoProducto.price}
          onChange={(e) => setNuevoProducto({ ...nuevoProducto, price: e.target.value })}
        />
        <input
          type="text"
          placeholder="URL de imagen"
          value={nuevoProducto.imageUrl}
          onChange={(e) => setNuevoProducto({ ...nuevoProducto, imageUrl: e.target.value })}
        />
        <button onClick={crearProducto}>Crear Producto</button>
      </div>

      <ul>
        {productos.map((producto) => (
          <li key={producto.id}>
            <h3>{producto.name}</h3>
            <p>{producto.description}</p>
            <p>${producto.price}</p>
            <img src={producto.imageUrl} alt={producto.name} width="100" />
            <button onClick={() => eliminarProducto(producto.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminProductos;
