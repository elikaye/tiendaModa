import React, { useEffect, useState } from 'react';
import ProductForm from './ProductForm';

const API_BASE_URL = 'https://tiendamoda-production.up.railway.app/api/v1/products';

export default function AdminProducts() {
  const [productos, setProductos] = useState([]);
  const [productoEditando, setProductoEditando] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchProductos = async () => {
    try {
      const res = await fetch(API_BASE_URL);
      const data = await res.json();
      setProductos(data.products || []);
    } catch (err) {
      console.error('❌ Error al obtener productos', err);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const confirmarEliminar = (producto) => {
    setProductoAEliminar(producto);
    setModalVisible(true);
  };

  const eliminarProducto = async () => {
    try {
      await fetch(`${API_BASE_URL}/${productoAEliminar.id}`, {
        method: 'DELETE',
      });
      setModalVisible(false);
      setProductoAEliminar(null);
      fetchProductos(); // Refrescar lista
    } catch (err) {
      console.error('❌ Error al eliminar producto', err);
    }
  };

  return (
    <section className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-pink-600">Administrar Productos</h2>

      <button
        onClick={() => {
          setProductoEditando(null);
          setFormVisible(true);
        }}
        className="bg-pink-500 text-white px-4 py-2 rounded-lg mb-4"
      >
        ➕ Agregar Producto
      </button>

      {formVisible && (
        <ProductForm
          producto={productoEditando}
          onCancel={() => {
            setProductoEditando(null);
            setFormVisible(false);
          }}
          onSave={() => {
            setProductoEditando(null);
            setFormVisible(false);
            fetchProductos();
          }}
        />
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border border-gray-200">
          <thead className="bg-pink-100">
            <tr>
              <th className="p-3">Imagen</th>
              <th className="p-3">Nombre</th>
              <th className="p-3">Precio</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Destacado</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id} className="border-t">
                <td className="p-3">
                  <img
                    src={producto.imageUrl}
                    alt={producto.nombre}
                    className="w-12 h-12 object-cover rounded"
                  />
                </td>
                <td className="p-3">{producto.nombre}</td>
                <td className="p-3">${producto.precio}</td>
                <td className="p-3 capitalize">{producto.estado}</td>
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={producto.destacados}
                    readOnly
                  />
                </td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => {
                      setProductoEditando(producto);
                      setFormVisible(true);
                    }}
                    className="bg-gray-800 text-white px-3 py-1 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => confirmarEliminar(producto)}
                    className="bg-pink-500 text-white px-3 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirmar eliminación</h3>
            <p className="mb-6">
              ¿Estás seguro que querés eliminar el producto{' '}
              <strong>{productoAEliminar?.nombre}</strong>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setModalVisible(false);
                  setProductoAEliminar(null);
                }}
                className="px-4 py-2 rounded border border-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={eliminarProducto}
                className="px-4 py-2 rounded bg-pink-500 text-white"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
