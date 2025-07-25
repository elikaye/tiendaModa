// src/pages/AdminProductos.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const AdminProductos = () => {
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    imagen: '',
  });

  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
    try {
      const respuesta = await axios.get(`${API_BASE_URL}/products`);
      setProductos(respuesta.data);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  };

  const crearProducto = async () => {
    try {
      const respuesta = await axios.post(`${API_BASE_URL}/products`, nuevoProducto);
      setProductos([...productos, respuesta.data]);
      setNuevoProducto({ nombre: '', descripcion: '', precio: '', imagen: '' });
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
          value={nuevoProducto.nombre}
          onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
        />
        <input
          type="text"
          placeholder="Descripción"
          value={nuevoProducto.descripcion}
          onChange={(e) => setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })}
        />
        <input
          type="number"
          placeholder="Precio"
          value={nuevoProducto.precio}
          onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })}
        />
        <input
          type="text"
          placeholder="URL de imagen"
          value={nuevoProducto.imagen}
          onChange={(e) => setNuevoProducto({ ...nuevoProducto, imagen: e.target.value })}
        />
        <button onClick={crearProducto}>Crear Producto</button>
      </div>

      <ul>
        {productos.map((producto) => (
          <li key={producto.id}>
            <h3>{producto.nombre}</h3>
            <p>{producto.descripcion}</p>
            <p>${producto.precio}</p>
            <img src={producto.imagen} alt={producto.nombre} width="100" />
            <button onClick={() => eliminarProducto(producto.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminProductos;
